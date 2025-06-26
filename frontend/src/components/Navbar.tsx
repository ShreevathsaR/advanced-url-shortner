import { Link } from "react-router";
import { useStore } from "../context/store";
import { Button } from "./ui/button";
import { Link2Icon, LogOut } from "lucide-react";
import { api } from "@/lib/baseUrl";
import { toast } from "sonner";

const Navbar = () => {
  const user = useStore((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await api.get("/auth/logout");
      if (response.data.success) {
        window.location.href = "/login";
        toast.success("Success", {
          description: "Logged out successfully",
        });
      } else {
        toast.error("Failed logging out", {
          description: "Failed logging out please try again",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <div className="flex bg-[#0f0f1a] items-center justify-between font-['SF-Pro-Regular'] shadow-lg py-5 px-15 position-absolute">
        <h1 className="text-2xl flex gap-3 items-center text-[#e2e2f5] font-bold font-['SF-Pro-Bold'] text-shadow-md">
          <Link2Icon />
          Advanced URL Shortner
        </h1>
        {user ? (
          <div className="flex items-center gap-5">
            <p className="text-[#c4c2ff] font-['SF-Pro-Bold']">
              Welcome {user?.name}
            </p>{" "}
            <Button
              className="bg-[#c4c2ff] text-[#0f0f1a] hover:text-[#e2e2f5] hover:cursor-pointer font-['SF-Pro-Bold']"
              onClick={() => handleLogout()}
            >
              Sign out <LogOut />
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
