import { getAllUrls } from "@/api/getAllUrls"
import { useQuery } from "@tanstack/react-query"

export const useAllUrls = () => {
    return useQuery({
        queryKey:["get-all-urls"],
        queryFn: getAllUrls,
        staleTime: 10000,
        refetchOnWindowFocus: true,
        retry: false
    })
}