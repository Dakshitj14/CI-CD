
import git, os, shutil

WORKSPACE = "workspace/repo"

def clone_repo(repo_url):
    if os.path.exists(WORKSPACE):
        shutil.rmtree(WORKSPACE)

    git.Repo.clone_from(repo_url, WORKSPACE)
    return WORKSPACE
