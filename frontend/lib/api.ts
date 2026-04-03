import type { RunRequest, RunResult } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function createRun(payload: RunRequest) {
  const response = await fetch(`${API_BASE}/run-agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to start run (${response.status})`);
  }

  return response.json() as Promise<{
    run_id: string;
    status: string;
    current_step: string;
    result_url: string;
  }>;
}

export async function fetchRun(runId: string) {
  const response = await fetch(`${API_BASE}/results/${runId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch run ${runId} (${response.status})`);
  }

  return response.json() as Promise<RunResult>;
}

export function getApiBase() {
  return API_BASE;
}
