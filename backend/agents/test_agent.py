import sys
import subprocess
import re


def _pick_failure_type(types):
    priority = [
        "COLLECTION_ERROR",
        "IMPORT_ERROR",
        "ASSERTION_ERROR",
        "TEST_FAILURE",
        "NO_TESTS_COLLECTED",
    ]
    for item in priority:
        if item in types:
            return item
    return types[0] if types else "FAILURE"


def run_pytest(repo_path):
    try:
        process = subprocess.run(
            [sys.executable, "-m", "pytest", "-q"],
            cwd=repo_path,
            stderr=subprocess.STDOUT,
            stdout=subprocess.PIPE,
            text=True,
        )

        output = process.stdout or ""
        logs = [line for line in output.splitlines() if line.strip()]

        if process.returncode == 0:
            return {
                "failures": [],
                "logs": logs,
                "raw_output": output,
                "passed": True,
                "exit_code": 0,
            }

        failures = parse_failures(output)
        if not failures and ("no tests ran" in output.lower() or "collected 0 items" in output.lower()):
            failures = [
                {
                    "file": "pytest",
                    "line": 0,
                    "type": "NO_TESTS_COLLECTED",
                    "error": "pytest did not collect any tests",
                }
            ]

        return {
            "failures": failures,
            "logs": logs,
            "raw_output": output,
            "passed": False,
            "exit_code": process.returncode,
        }
    except subprocess.CalledProcessError as e:
        logs = e.output.decode() if isinstance(e.output, (bytes, bytearray)) else str(e.output)
        failures = parse_failures(logs)
        if not failures and ("no tests ran" in logs.lower() or "collected 0 items" in logs.lower()):
            failures = [
                {
                    "file": "pytest",
                    "line": 0,
                    "type": "NO_TESTS_COLLECTED",
                    "error": "pytest did not collect any tests",
                }
            ]
        return {
            "failures": failures,
            "logs": [line for line in logs.splitlines() if line.strip()],
            "raw_output": logs,
            "passed": False,
            "exit_code": e.returncode,
        }


def parse_failures(logs):
    failures_by_file = {}
    file_order = []
    lines = logs.split("\n")
    current_file = None

    def record_failure(file_name, failure_type, error_message):
        key = file_name or "unknown.py"
        if key not in failures_by_file:
            failures_by_file[key] = {
                "file": key,
                "line": 0,
                "types": [],
                "errors": [],
            }
            file_order.append(key)
        entry = failures_by_file[key]
        if failure_type not in entry["types"]:
            entry["types"].append(failure_type)
        if error_message and error_message not in entry["errors"]:
            entry["errors"].append(error_message)

    for line in lines:
        error_collecting = re.search(r"ERROR collecting (.+\.py)", line)
        if error_collecting:
            current_file = error_collecting.group(1).split("/")[-1].strip()
            record_failure(current_file, "COLLECTION_ERROR", line.strip())
            continue

        failed_line = re.search(r"FAILED\s+(.+\.py)", line)
        if failed_line:
            current_file = failed_line.group(1).split("/")[-1].strip()
            record_failure(current_file, "TEST_FAILURE", line.strip())
            continue

        if "ModuleNotFoundError" in line or "ImportError while importing test module" in line:
            record_failure(current_file, "IMPORT_ERROR", line.strip())
            continue

        if "NameError" in line:
            record_failure(current_file, "NAME_ERROR", line.strip())
            continue

        if "AssertionError" in line:
            record_failure(current_file, "ASSERTION_ERROR", line.strip())

    failures = []
    for file_name in file_order:
        entry = failures_by_file[file_name]
        failures.append(
            {
                "file": entry["file"],
                "line": entry["line"],
                "type": _pick_failure_type(entry["types"]),
                "error": "\n".join(entry["errors"]) if entry["errors"] else "pytest reported a failure",
                "types": entry["types"],
            }
        )

    return failures
