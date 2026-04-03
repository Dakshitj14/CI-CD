# Autonomous AI CI/CD Agent

An AI-powered CI/CD demo that:

- clones a GitHub repo or a local mock fixture
- runs `pytest`
- detects failures
- asks Ollama DeepSeek for fixes
- commits changes on a new branch
- opens a pull request or generates a dummy PR in mock mode

## Project Layout

- `backend/` - FastAPI pipeline and AI agents
- `frontend/` - Next.js App Router dashboard

## Backend

### Features

- `POST /run-agent`
- `GET /results/{run_id}`
- live step tracking
- log streaming via polling
- mock fallback when AI or GitHub fails
- local demo repo via `mock://sample`

### Run

```bash
cd backend
./venv/bin/uvicorn main:app --reload --port 8000
```

If you are not using the bundled venv, install dependencies first:

```bash
pip install -r requirements.txt
```

### Test the API

Start a run:

```bash
curl -X POST http://localhost:8000/run-agent \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "mock://sample",
    "team": "Nebula",
    "leader": "Daksh"
  }'
```

Poll the result:

```bash
curl http://localhost:8000/results/<run_id>
```

### Sample GitHub Repo

Use any repository with a failing `pytest` suite, or create a small temporary repo like:

```bash
mkdir sample-repo
cd sample-repo
git init
printf 'def divide(a, b):\n    return a / b\n' > math_utils.py
printf 'from math_utils import divide\n\ndef test_divide_by_zero_returns_zero():\n    assert divide(10, 0) == 0\n' > test_math.py
git add .
git commit -m "initial failing test"
```

Push that repo to GitHub if you want to exercise the real clone/push path.

## Frontend

### Features

- dark futuristic landing page
- repo/team/leader input form
- dashboard with polling-based live logs
- animated pipeline timeline
- results panel with summary, failures, fixes, and PR link
- side-by-side diff viewer

### Run

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment

Set the API base URL if the backend is not on `localhost:8000`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Mock Mode

If GitHub or Ollama is unavailable, use:

- `repo_url = mock://sample`

This uses the built-in local fixture in `backend/demo_repo/` and returns a dummy PR URL so the dashboard still demonstrates the full flow.

## Curl / Postman Flow

1. `POST /run-agent` with the repo URL, team name, and leader name.
2. Copy the returned `run_id`.
3. Poll `GET /results/{run_id}` every 1 to 2 seconds.
4. Watch `status`, `current_step`, `logs`, `failures`, and `fixes` update.

## What To Expect

- `summary.status` will be `NO_FAILURES` when `pytest` passes.
- `summary.status` will be `PASSED` when failures were found and the pipeline produced fixes/PR output.
- `execution_mode` becomes `mock` when the system falls back to simulated fixes or a dummy PR.
