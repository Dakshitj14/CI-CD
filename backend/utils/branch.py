import secrets
import time


def generate_branch():
    timestamp = int(time.time())
    suffix = secrets.token_hex(3)
    return f"ai-fix-{timestamp}-{suffix}".lower()
