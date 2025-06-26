import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <Separator className="border-[#303052] border"/>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
