"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";
import { useState } from "react";
import { createRun } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HeroForm() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("mock://sample");
  const [team, setTeam] = useState("Nebula");
  const [leader, setLeader] = useState("Daksh");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        repo_url: repoUrl.trim(),
        team: team.trim(),
        leader: leader.trim(),
      };

      const run = await createRun(payload);
      localStorage.setItem("last_run_id", run.run_id);
      localStorage.setItem("last_run_payload", JSON.stringify(payload));
      router.push(`/dashboard/${run.run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start pipeline");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="border-white/12 bg-black/20">
        <CardContent className="space-y-5 p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Repo URL
                </label>
                <Input
                  value={repoUrl}
                  onChange={(event) => setRepoUrl(event.target.value)}
                  placeholder="https://github.com/owner/repo.git or mock://sample"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Team Name
                </label>
                <Input value={team} onChange={(event) => setTeam(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Leader Name
                </label>
                <Input
                  value={leader}
                  onChange={(event) => setLeader(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Launching pipeline...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Run AI Pipeline
                  </>
                )}
              </Button>
              <p className="text-sm text-white/50">
                The dashboard will open with live polling as soon as the backend returns a run ID.
              </p>
            </div>
          </form>

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
