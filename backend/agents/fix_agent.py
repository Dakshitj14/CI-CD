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

    return response.json()["response"]


def generate_fixes(failures):

    fixes = []

    for f in failures:

        error = f.get("error", "")
        file = f.get("file", "")
        line = f.get("line", 0)

        prompt = f"""
You are an AI CI/CD fixing agent.

A pytest test failed.

Error:
{error}

Return a fix suggestion for this bug.

Respond only with a short explanation and code patch.
"""

        ai_response = ask_llm(prompt)

        fixes.append({
            "file": file,
            "line": line,
            "type": f.get("type", "LOGIC"),
            "commit": f"[AI-AGENT] Auto fix for {file}",
            "suggestion": ai_response,
            "status": "Generated"
        })

    return fixes