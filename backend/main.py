from fastapi import FastAPI
from pydantic import BaseModel
import uuid, time, json, os

from agents.repo_agent import clone_repo
from agents.test_agent import run_pytest
from agents.fix_agent import generate_fixes
from agents.git_agent import push_fixes

app = FastAPI()

RUNS = {}

class Request(BaseModel):
    repo_url: str
    team: str
    leader: str

@app.get("/")
def home():
    return {"status": "Backend running"}

@app.post("/run-agent")
def run_agent(data: Request):
    run_id = str(uuid.uuid4())
    start = time.time()

    try:
        # 1️⃣ Clone repo
        path = clone_repo(data.repo_url)

        # 2️⃣ Run tests
        failures = run_pytest(path)

        # 3️⃣ Generate fixes
        fixes = generate_fixes(failures)

        # 4️⃣ Push fixes to GitHub (creates branch)
        branch = push_fixes(
            path,
            data.repo_url,
            fixes,
            data.team,
            data.leader
        )

        # 5️⃣ Build result object
        result = {
            "repo": data.repo_url,
            "team": data.team,
            "leader": data.leader,
            "branch": branch,
            "failures": failures,
            "fixes": fixes,
            "count": len(failures),
            "final_status": "PASSED" if len(failures) > 0 else "NO_FAILURES",
            "time_taken": int(time.time() - start)
        }

        # 6️⃣ Save results.json (Hackathon requirement)
        os.makedirs("results", exist_ok=True)
        with open("results/results.json", "w") as f:
            json.dump(result, f, indent=2)

        RUNS[run_id] = result

        return {"run_id": run_id, "result": result}

    except Exception as e:
        return {
            "error": str(e),
            "hint": "Check GitHub token, repo permissions, or pytest setup"
        }

@app.get("/results/{run_id}")
def get_result(run_id: str):
    return RUNS.get(run_id, {"error": "Run ID not found"})
