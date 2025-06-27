import { getAnalytics } from "@/api/getAnalytics";
import { useQuery } from "@tanstack/react-query";

export const useAnalytics = (urlId: string) => {
  return useQuery({
    queryKey: ["url-analytics", urlId],
    queryFn: () => getAnalytics(urlId),
    staleTime: 10000,
  });
};
