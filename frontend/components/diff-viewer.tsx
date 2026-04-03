"use client";

import { Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function CodePane({
  title,
  code,
  accent,
}: {
  title: string;
  code: string;
  accent: "original" | "fixed";
}) {
  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#08131f]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <span className="text-sm font-medium text-white">{title}</span>
        <Badge variant={accent === "original" ? "warning" : "success"}>
          {accent}
        </Badge>
      </div>
      <pre className="overflow-auto p-4 text-sm leading-6 text-white/78">
        <code>{code || "No code available."}</code>
      </pre>
    </div>
  );
}

export function DiffViewer({
  originalCode,
  fixedCode,
  fileName,
}: {
  originalCode: string;
  fixedCode: string;
  fileName: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-neon" />
          Diff Viewer
        </CardTitle>
        <p className="mt-2 text-sm text-white/55">{fileName}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodePane title="Original code" code={originalCode} accent="original" />
          <CodePane title="Fixed code" code={fixedCode} accent="fixed" />
        </div>
      </CardContent>
    </Card>
  );
}
