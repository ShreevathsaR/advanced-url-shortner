import { api } from "@/lib/baseUrl";
import type { AllUrls } from "@/types/Url";

export const getAllUrls = async (): Promise<AllUrls[]> => {
  const response = await api.get("/user/urls");
  return response.data.data;
};
