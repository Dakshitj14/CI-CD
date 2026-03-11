import subprocess

def run_pytest(repo_path):
    try:
        subprocess.check_output(
            ["pytest"],
            cwd=repo_path,
            stderr=subprocess.STDOUT
        )
        return []
    except subprocess.CalledProcessError as e:
        return parse_failures(e.output.decode())


def parse_failures(logs):
    failures = []
    lines = logs.split("\n")

    for line in lines:
        if ".py" in line and "Error" in line:
            failures.append({
                "file": "unknown.py",
                "line": 0,
                "type": "LOGIC",
                "error": line.strip()
            })

    return failures
