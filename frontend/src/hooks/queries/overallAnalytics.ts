import { useQuery } from "@tanstack/react-query";
import { overallAnalytics } from "../../api/overallAnalytics";

export function useOverallAnalytics() {
  return useQuery({
    queryKey: ["overall-analytics"],
    queryFn: overallAnalytics,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
  });
}
