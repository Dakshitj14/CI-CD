"use client";

import { motion } from "framer-motion";
import { Bot, CircleCheckBig, GitBranchPlus, Sparkles } from "lucide-react";
import { HeroForm } from "@/components/hero-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Bot,
    title: "Autonomous repair",
    description: "Clones, tests, fixes, and prepares a pull request in one loop.",
  },
  {
    icon: GitBranchPlus,
    title: "Branch orchestration",
    description: "Generates a safe feature branch and keeps the process visible.",
  },
  {
    icon: CircleCheckBig,
    title: "Operational clarity",
    description: "Live logs, timeline animation, and a diff-first results panel.",
  },
];

export function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <Badge className="bg-neon/12 text-neon border-neon/25">AI CI/CD Agent</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Futuristic DevOps control for autonomous test fixing.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/65 md:text-lg">
              Trigger a pipeline, watch the logs, inspect fixes, and review the generated
              pull request from a polished control panel built for demos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="h-full border-white/12 bg-white/6">
                    <CardContent className="space-y-3 p-5">
                      <Icon className="h-5 w-5 text-neon" />
                      <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                      <p className="text-sm leading-6 text-white/58">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-emerald-400/18 blur-2xl animate-pulseGlow" />
          <HeroForm />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 border-white/12 bg-black/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-neon" />
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">
                Demo-friendly pipeline
              </p>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">
              Use a real GitHub repo URL or the built-in <span className="text-neon">mock://sample</span>{" "}
              fixture to test without GitHub access. The backend keeps updating logs and state
              while the frontend polls in real time.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/12 bg-black/20">
          <CardContent className="p-6 text-sm text-white/65">
            <p className="uppercase tracking-[0.22em] text-white/45">API</p>
            <p className="mt-3 text-white">POST /run-agent</p>
            <p className="mt-2 text-white">GET /results/{`{run_id}`}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
