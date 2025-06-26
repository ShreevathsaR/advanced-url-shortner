import type { OverallAnalyticsResult } from "@/types/Url";
import { api } from "../lib/baseUrl";

export async function overallAnalytics(): Promise<OverallAnalyticsResult> {
  const response = await api.get("/overall/analytics");
  return response.data;
}
