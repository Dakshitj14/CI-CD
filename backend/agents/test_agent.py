import subprocess


def run_pytest(repo_path):

    try:

        subprocess.check_output(
            ["pytest", "-q"],
            cwd=repo_path,
            stderr=subprocess.STDOUT
        )

        return []

    except subprocess.CalledProcessError as e:

        logs = e.output.decode()

        return parse_failures(logs)


def parse_failures(logs):

    failures = []

    lines = logs.split("\n")

    for line in lines:

        # Detect pytest FAILED lines
        if "FAILED" in line and ".py" in line:

            parts = line.split("::")

            file = parts[0].replace("FAILED ", "").strip()

            failures.append({
                "file": file,
                "line": 0,
                "type": "TEST_FAILURE",
                "error": line.strip()
            })

        # Detect assertion errors
        if "AssertionError" in line:

            failures.append({
                "file": "unknown.py",
                "line": 0,
                "type": "ASSERTION_ERROR",
                "error": line.strip()
            })

    return failures