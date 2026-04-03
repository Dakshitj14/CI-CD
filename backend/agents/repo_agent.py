import os
import shutil
import tempfile
from pathlib import Path

import git
from dotenv import load_dotenv

load_dotenv()

DEMO_REPO = Path(__file__).resolve().parent.parent / "demo_repo"
RUNTIME_ROOT = Path(tempfile.gettempdir()) / "autonomous-ai-cicd-agent"
TOKEN = os.getenv("GITHUB_TOKEN")


def workspace_for_run(run_id):
    if run_id:
        return RUNTIME_ROOT / "workspaces" / run_id
    return RUNTIME_ROOT / "workspace"


def clone_repo(repo_url, run_id=None):
    workspace = workspace_for_run(run_id)
    if workspace.exists():
        shutil.rmtree(workspace)

    workspace.parent.mkdir(parents=True, exist_ok=True)

    if repo_url.startswith(("mock://", "local://")):
        shutil.copytree(DEMO_REPO, workspace)
        return str(workspace)

    if os.path.exists(repo_url) and not repo_url.startswith("http"):
        shutil.copytree(repo_url, workspace)
        return str(workspace)

    try:
        git.Repo.clone_from(repo_url, workspace)
        return str(workspace)
    except Exception as primary_error:
        if TOKEN and repo_url.startswith("https://github.com/"):
            auth_url = repo_url.replace("https://github.com/", f"https://{TOKEN}@github.com/")
            try:
                git.Repo.clone_from(auth_url, workspace)
                return str(workspace)
            except Exception as auth_error:
                raise RuntimeError(
                    f"Failed to clone GitHub repo with and without token: {auth_error}"
                ) from auth_error
        raise RuntimeError(f"Failed to clone repository: {primary_error}") from primary_error
