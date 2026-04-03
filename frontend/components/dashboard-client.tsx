"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchRun } from "@/lib/api";
import type { RunResult } from "@/lib/types";
import { ActivityTimeline } from "@/components/activity-timeline";
import { PipelineTerminal } from "@/components/pipeline-terminal";
import { ResultsPanel } from "@/components/results-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardClient({ runId }: { runId: string }) {
  const [run, setRun] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let intervalId: number | undefined;

    async function poll() {
      try {
        const data = await fetchRun(runId);
        if (!alive) {
          return;
        }

        setRun(data);
        setError(null);

        if (data.status !== "completed" && data.status !== "failed") {
          intervalId = window.setTimeout(poll, 1500);
        }
      } catch (pollError) {
        if (!alive) {
          return;
        }

        setError(pollError instanceof Error ? pollError.message : "Unable to fetch run");
        intervalId = window.setTimeout(poll, 2000);
      }
    }

    poll();

    return () => {
      alive = false;
      if (intervalId) {
        window.clearTimeout(intervalId);
      }
    };
  }, [runId]);

  const currentStep = run?.current_step ?? "queued";
  const status = run?.summary?.status ?? run?.status ?? "QUEUED";
  const hasBackendSignal = Boolean(run && (run.logs?.length || run.status !== "queued"));
  const isActive = Boolean(
    run && run.status === "running" && currentStep !== "queued" && currentStep !== "completed",
  );
  const connectionLabel = !run
    ? "Waiting for job"
    : run.error
      ? "Backend error"
      : run.status === "queued" && !hasBackendSignal
        ? "Awaiting backend"
        : run.execution_mode === "mock"
          ? "Mock fallback"
          : "Live pipeline connected";

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge className="bg-neon/12 text-neon border-neon/25">Run ID: {runId}</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            AI CI/CD Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Polling the backend for live progress, logs, failures, fixes, and the generated PR.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/70 backdrop-blur-xl">
          {connectionLabel}
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {run?.error ? (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {run.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <ActivityTimeline currentStep={currentStep} status={run?.status ?? "queued"} />
          <PipelineTerminal logs={run?.logs ?? []} isActive={isActive} />
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl"
          >
            <Card className="border-white/10 bg-black/25">
              <CardHeader>
                <CardTitle className="text-xl text-white">Execution Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">Progress</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{run?.progress ?? 0}%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">Mode</div>
                  <div className="mt-3 text-2xl font-semibold text-white">
                    {run?.execution_mode ?? "queued"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">Failures</div>
                  <div className="mt-3 text-2xl font-semibold text-white">
                    {run?.summary?.failure_count ?? run?.failures?.length ?? 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {run ? (
            <ResultsPanel run={run} />
          ) : (
            <Card className="border-white/10 bg-black/25">
              <CardContent className="p-6 text-sm text-white/55">
                Waiting for the first backend update...
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
