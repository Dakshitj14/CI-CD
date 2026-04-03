export type PipelineStep =
  | "queued"
  | "cloning"
  | "testing"
  | "fixing"
  | "pushing"
  | "completed";

export interface FailureItem {
  file: string;
  line?: number;
  type?: string;
  types?: string[];
  error: string;
  original_code?: string | null;
}

export interface FixItem {
  file: string;
  original_code: string;
  fixed_code: string;
  explanation?: string;
  commit?: string;
}

export interface RunResult {
  run_id: string;
  repo_url: string;
  team: string;
  leader: string;
  status: "queued" | "running" | "completed" | "failed";
  current_step: PipelineStep;
  progress: number;
  logs: string[];
  stage_history?: Array<{
    stage: PipelineStep;
    label: string;
    message: string;
    timestamp: number;
  }>;
  failures: FailureItem[];
  fixes: FixItem[];
  branch_created?: string | null;
  pull_request_url?: string | null;
  pr_created?: boolean;
  base_branch?: string;
  started_at?: number;
  finished_at?: number;
  execution_mode?: "live" | "mock";
  summary?: {
    failure_count: number;
    status: "PASSED" | "NO_FAILURES" | "FAILED" | "QUEUED";
    time_taken: number;
    mock_mode: boolean;
  };
  error?: string;
}

export interface RunRequest {
  repo_url: string;
  team: string;
  leader: string;
}
