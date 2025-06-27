import { api } from "@/lib/baseUrl";
import type { AnalyticsResult } from "@/types/Url";

export const getAnalytics = async (urlId: string): Promise<AnalyticsResult> => {
  const response = await api.get(`/analytics/${urlId}`);
  console.log(response.data)
  return response.data;
};
