import os
from github import Github
from dotenv import load_dotenv
from utils.branch import generate_branch

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")


def push_fixes(repo_path, repo_url, fixes, team, leader):

    branch = generate_branch(team, leader)

    # Enter repo directory
    os.chdir(repo_path)

    # Create new branch
    os.system(f"git checkout -b {branch}")

    # Apply fixes (demo fix for now)
    for fix in fixes:

        file_path = os.path.basename(fix["file"])

        if os.path.exists(file_path):

            with open(file_path, "w") as f:
                f.write(fix["fixed_code"])

            os.system(f"git add {file_path}")
            os.system(f'git commit -m "{fix["commit"]}"')

    # Push branch to GitHub using token authentication
    repo_name = repo_url.replace("https://github.com/", "")
    auth_url = f"https://{TOKEN}@github.com/{repo_name}.git"

    os.system(f"git push {auth_url} {branch}")

    # Create Pull Request using PyGithub
    try:

        g = Github(TOKEN)

        repo = g.get_repo(repo_name)

        pr = repo.create_pull(
            title="AI Auto Fix",
            body="This pull request was automatically created by the AI CI/CD Agent.",
            head=branch,
            base="main"
        )

        print(f"Pull Request created: {pr.html_url}")

    except Exception as e:

        print("PR creation failed:", str(e))

    return branch