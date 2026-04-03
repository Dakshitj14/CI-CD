import { DashboardClient } from "@/components/dashboard-client";

export default async function Page({
  params,
}: {
  params: Promise<{
    runId: string;
  }>;
}) {
  const { runId } = await params;
  return <DashboardClient runId={runId} />;
}
