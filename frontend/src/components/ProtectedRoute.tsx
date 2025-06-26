import { useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/baseUrl";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/apiResponse";
import { useStore } from "../context/store";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const checkisAuthenticated = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/auth/check");
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          return setIsAuthenticated(response.data.isAuthenticated);
        }
        navigate("/login", { replace: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError.response?.data.message);
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkisAuthenticated();
  }, [navigate]);

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1a1a2e] p-6 rounded-lg border border-[#303052]">
          <Loader2 className="animate-spin h-8 w-8 text-[#6366f1] mx-auto mb-2" />
          <p className="text-[#e2e2f5] font-[SF-Pro-Regular]">Loading...</p>
        </div>
      </div>
    );
  if (isAuthenticated) return children;
};

export default ProtectedRoute;
