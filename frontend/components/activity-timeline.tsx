"use client";

import { motion } from "framer-motion";
import {
  CircleCheckBig,
  FileSearch,
  GitBranchPlus,
  GitPullRequest,
  GitBranch,
  Wrench,
} from "lucide-react";
import type { PipelineStep } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { key: "cloning", title: "Cloning repository", icon: GitBranchPlus },
  { key: "testing", title: "Running tests", icon: FileSearch },
  { key: "fixing", title: "Generating fixes", icon: Wrench },
  { key: "pushing", title: "Creating branch", icon: GitBranch },
  { key: "completed", title: "Opening PR", icon: GitPullRequest },
] as const;

export function ActivityTimeline({
  currentStep,
  status,
}: {
  currentStep: PipelineStep;
  status: string;
}) {
  const currentIndex = STEPS.findIndex((item) => item.key === currentStep);
  const isFinished = status === "completed" || status === "failed";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleCheckBig className="h-5 w-5 text-neon" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {STEPS.map((step, index) => {
          const active = currentIndex >= index;
          const current = !isFinished && step.key === currentStep;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`flex items-start gap-4 rounded-2xl border px-4 py-3 transition ${
                active
                  ? "border-neon/30 bg-neon/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                  current
                    ? "border-neon bg-neon/20 text-neon"
                    : active
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-white/8 bg-white/5 text-white/35"
                }`}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{step.title}</p>
                  {current ? (
                    <Badge variant="success">Active</Badge>
                  ) : active ? (
                    <Badge>Done</Badge>
                  ) : (
                    <Badge variant="default">Pending</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/50">
                  {step.key === "completed"
                    ? "Results are being finalized."
                    : `Stage ${index + 1} of ${STEPS.length}.`}
                </p>
              </div>
            </motion.div>
          );
        })}

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <span>Current state</span>
          <span className="font-mono uppercase tracking-[0.18em] text-neon">
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
