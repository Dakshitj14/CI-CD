import requests
import os

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "deepseek-coder:6.7b"


def ask_llm(prompt):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data.get("response", "")


def generate_fixes(failures):

    fixes = []

    # Correct path to cloned repo
    target_file = "workspace/repo/math_utils.py"

    print("Failures detected:", failures)

    if not os.path.exists(target_file):
        print("File not found:", target_file)
        return fixes

    with open(target_file, "r") as f:
        code = f.read()

    for failure in failures:

        error = failure.get("error", "")

        prompt = f"""
You are an AI agent fixing Python code.

The following pytest failed:

{error}

Here is the buggy file:

{code}

Fix the bug and return the FULL corrected Python file.

Return ONLY valid Python code.
"""

        print("Sending prompt to AI...")

        fixed_code = ask_llm(prompt)

        # Clean markdown and explanations
        fixed_code = fixed_code.replace("```python", "")
        fixed_code = fixed_code.replace("```", "")
        fixed_code = fixed_code.strip()

        print("AI RESPONSE:", fixed_code)

        if not fixed_code.strip():
            print("AI returned empty fix")
            continue

        fixes.append({
            "file": target_file,
            "fixed_code": fixed_code,
            "commit": "[AI-AGENT] Fix division bug"
        })

    print("Generated fixes:", fixes)

    return fixes