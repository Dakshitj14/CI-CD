"use client";

import { motion } from "framer-motion";
import { TerminalSquare, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PipelineTerminal({
  logs,
  isActive,
}: {
  logs: string[];
  isActive: boolean;
}) {
  return (
    <Card className="h-full border-white/12 bg-black/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TerminalSquare className="h-5 w-5 text-neon" />
            Live Logs
          </CardTitle>
          <p className="mt-2 text-sm text-white/55">
            Polling the backend for step-by-step pipeline output.
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
          <Circle className={`h-2.5 w-2.5 ${isActive ? "fill-neon text-neon" : "text-white/25"}`} />
          {isActive ? "Streaming" : "Idle"}
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-[#041018] p-4 font-mono text-sm text-emerald-200">
          {logs.length ? (
            <div className="space-y-2">
              {logs.map((line, index) => (
                <motion.div
                  key={`${index}-${line}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(index * 0.02, 0.2) }}
                  className="flex gap-3"
                >
                  <span className="text-white/25">▸</span>
                  <span className="whitespace-pre-wrap break-words">{line}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-white/40">Waiting for the pipeline to emit logs...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
