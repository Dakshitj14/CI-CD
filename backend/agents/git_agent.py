import os
import subprocess
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from github import Github

from utils.branch import generate_branch

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")


def normalize_repo_name(repo_url):
    if repo_url.startswith("git@github.com:"):
        return repo_url.split("git@github.com:", 1)[1].removesuffix(".git").removesuffix("/")

    parsed = urlparse(repo_url)
    if parsed.netloc.endswith("github.com"):
        return parsed.path.strip("/").removesuffix(".git")

    return repo_url.removeprefix("https://github.com/").removeprefix("http://github.com/").removesuffix(".git").strip("/")


def _run_git(args, cwd):
    return subprocess.run(
        ["git", *args],
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    )


def _has_staged_or_unstaged_changes(cwd):
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    )
    return bool(result.stdout.strip())


def push_fixes(repo_path, repo_url, fixes, team, leader, mock_mode=False):
    branch = generate_branch()
    cwd = Path(repo_path)
    file_paths = []

    if not fixes:
        return {"branch": None, "pr_url": None, "mocked": mock_mode, "skipped": True}

    if not (cwd / ".git").exists():
        _run_git(["init"], cwd)

    _run_git(["checkout", "-b", branch], cwd)
    _run_git(["config", "user.email", "ai-ci@example.com"], cwd)
    _run_git(["config", "user.name", "AI CI/CD Agent"], cwd)

    for fix in fixes:
        file_path = cwd / fix["file"]
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(fix["fixed_code"])
        if fix["file"] not in file_paths:
            file_paths.append(fix["file"])

    if not _has_staged_or_unstaged_changes(cwd):
        return {
            "branch": None,
            "pr_url": None,
            "mocked": mock_mode,
            "skipped": True,
            "reason": "No actual file diff was produced after applying fixes.",
        }

    if file_paths:
        _run_git(["add", *file_paths], cwd)
        _run_git(["commit", "-m", "ai-fix"], cwd)

    repo_name = normalize_repo_name(repo_url) if "github.com" in repo_url else "mock/demo-repo"
    pr_url = None
    default_branch = "main"

    if not mock_mode and TOKEN and "github.com" in repo_url:
        try:
            auth_url = f"https://{TOKEN}@github.com/{repo_name}.git"
            _run_git(["push", auth_url, branch], cwd)

            github = Github(TOKEN)
            repo = github.get_repo(repo_name)
            default_branch = getattr(repo, "default_branch", None) or "main"
            pr = repo.create_pull(
                title="AI Auto Fix",
                body="This pull request was automatically created by the AI CI/CD Agent.",
                head=branch,
                base=default_branch,
            )
            pr_url = pr.html_url
            return {
                "branch": branch,
                "pr_url": pr_url,
                "mocked": False,
                "pr_created": True,
                "base_branch": default_branch,
            }
        except Exception as error:
            return {
                "branch": branch,
                "pr_url": None,
                "mocked": False,
                "pr_created": False,
                "base_branch": default_branch,
                "error": str(error),
            }

    pr_url = f"https://github.com/{repo_name}/pull/1" if "github.com" in repo_url else None
    return {
        "branch": branch,
        "pr_url": pr_url,
        "mocked": True,
        "pr_created": False,
        "base_branch": default_branch,
    }
