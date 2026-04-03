"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Clock3,
  GitBranch,
  Globe2,
  MoveRight,
  SplitSquareHorizontal,
} from "lucide-react";
import type { FixItem, FailureItem, RunResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DiffViewer } from "@/components/diff-viewer";

function ResultCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-white/55">
        <Icon className="h-4 w-4 text-neon" />
        <span className="text-xs uppercase tracking-[0.18em]">{title}</span>
      </div>
      <div className="mt-3 break-all text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function FailureBlock({ failure }: { failure: FailureItem }) {
  const isCollectionError =
    failure.type === "COLLECTION_ERROR" || failure.type === "IMPORT_ERROR";
  return (
    <div
      className={`rounded-2xl p-4 ${
        isCollectionError
          ? "border border-amber-400/20 bg-amber-500/10"
          : "border border-red-400/15 bg-red-500/8"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-white">{failure.file}</p>
          <p className="mt-1 text-sm text-white/60">{failure.type ?? "Failure"}</p>
          {failure.types?.length ? (
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
              {failure.types.join(" • ")}
            </p>
          ) : null}
        </div>
        <Badge variant={isCollectionError ? "warning" : "danger"}>
          line {failure.line ?? 0}
        </Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/85">{failure.error}</p>
    </div>
  );
}

function FixBlock({ fix }: { fix: FixItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-400/15 bg-emerald-500/8 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-white">{fix.file}</p>
          <p className="mt-1 text-sm text-white/60">{fix.explanation ?? "AI generated fix."}</p>
        </div>
        <Badge variant="success">fixed</Badge>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-[#06121a] p-4">
        <pre className="overflow-auto text-sm leading-6 text-white/80">
          <code>{fix.fixed_code}</code>
        </pre>
      </div>
    </motion.div>
  );
}

export function ResultsPanel({ run }: { run: RunResult }) {
  const firstFix = run.fixes?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SplitSquareHorizontal className="h-5 w-5 text-neon" />
          Results Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ResultCard title="Repo URL" value={run.repo_url} icon={Globe2} />
          <ResultCard title="Branch" value={run.branch_created ?? "Pending"} icon={GitBranch} />
          <ResultCard title="Failures" value={`${run.summary?.failure_count ?? run.failures?.length ?? 0}`} icon={AlertTriangle} />
          <ResultCard
            title="Time Taken"
            value={`${run.summary?.time_taken ?? 0}s`}
            icon={Clock3}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={run.summary?.status === "NO_FAILURES" ? "success" : "default"}>
            {run.summary?.status ?? "QUEUED"}
          </Badge>
          {run.execution_mode === "mock" ? (
            <Badge variant="warning">mock fallback</Badge>
          ) : run.pr_created ? (
            <Badge variant="success">github pr created</Badge>
          ) : run.status === "running" ? (
            <Badge variant="success">live run</Badge>
          ) : (
            <Badge variant="default">queued</Badge>
          )}
          {run.pull_request_url ? (
            <a
              href={run.pull_request_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neon transition hover:text-emerald-200"
            >
              Open pull request
              <MoveRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        {run.base_branch ? (
          <div className="text-sm text-white/55">
            Base branch: <span className="text-white">{run.base_branch}</span>
          </div>
        ) : null}

        <Separator />

        {run.error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            {run.error}
          </div>
        ) : null}

        {run.stage_history?.length ? (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold text-white">Stage History</h3>
            </div>
            <div className="space-y-2">
              {run.stage_history.map((stage) => (
                <div
                  key={`${stage.stage}-${stage.timestamp}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{stage.label}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-neon">
                      {new Date(stage.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{stage.message}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-neon" />
            <h3 className="text-lg font-semibold text-white">Failures</h3>
          </div>
          {run.failures?.length ? (
            <div className="space-y-3">
              {run.failures.map((failure, index) => (
                <FailureBlock key={`${failure.file}-${index}`} failure={failure} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              No failures reported by pytest.
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-neon" />
            <h3 className="text-lg font-semibold text-white">Fixes</h3>
          </div>
          {run.fixes?.length ? (
            <div className="space-y-4">
              {run.fixes.map((fix, index) => (
                <FixBlock key={`${fix.file}-${index}`} fix={fix} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              No fixes were produced yet.
            </div>
          )}
        </section>

        {firstFix ? (
          <DiffViewer
            fileName={firstFix.file}
            originalCode={firstFix.original_code}
            fixedCode={firstFix.fixed_code}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
