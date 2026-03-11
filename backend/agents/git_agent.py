import os
from github import Github
from dotenv import load_dotenv
from utils.branch import generate_branch

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")

def push_fixes(repo_path, repo_url, fixes, team, leader):
    branch = generate_branch(team, leader)

    # Enter repo
    os.chdir(repo_path)

    # Create new branch
    os.system(f"git checkout -b {branch}")

    # Apply simple fix (append comment for demo)
    for fix in fixes:
        file_path = fix["file"]

        # Ensure file exists
        if os.path.exists(file_path):
            with open(file_path, "a") as f:
                f.write("\n# AI FIX APPLIED\n")

            os.system(f'git add {file_path}')
            os.system(f'git commit -m "{fix["commit"]}"')

    # Push using token auth
    repo_name = repo_url.replace("https://github.com/", "")
    auth_url = f"https://{TOKEN}@github.com/{repo_name}.git"

    os.system(f"git push {auth_url} {branch}")

    return branch
