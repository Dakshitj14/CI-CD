def generate_fixes(failures):
    fixes = []

    for f in failures:
        fixes.append({
            "file": f.get("file", "test.py"),
            "line": f.get("line", 1),
            "type": f.get("type", "LOGIC"),
            "commit": f"[AI-AGENT] Fix {f.get('type','BUG')} in {f.get('file','test.py')} line {f.get('line',1)}",
            "status": "Fixed"
        })

    return fixes
