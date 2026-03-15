# Autonomous AI CI/CD Agent

This project implements an AI-powered CI pipeline that automatically:

- clones a GitHub repository
- runs tests using pytest
- detects failing tests
- uses an LLM (DeepSeek via Ollama) to generate code fixes
- commits the fix
- creates a pull request automatically

## Stack

- FastAPI
- Python
- PyTest
- Ollama
- DeepSeek-Coder
- GitPython
- PyGithub

## Pipeline

Repo → Tests → Failure → AI Fix → Commit → PR