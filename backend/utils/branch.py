import time

def generate_branch(team, leader):

    timestamp = int(time.time())

    branch = f"{team}_{leader}_AI_FIX_{timestamp}"

    return branch.upper().replace(" ", "_")