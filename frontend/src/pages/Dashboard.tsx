import {
  Loader2,
  RefreshCcw,
  Monitor,
  Globe,
  Users,
  MousePointer,
  BarChart3,
  TrendingUp,
  Phone,
  MonitorCheck,
  Link,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useOverallAnalytics } from "@/hooks/queries/overallAnalytics";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import CustomTooltip from "@/components/CustomTootip";
import CustomTooltip1 from "@/components/CustomTootip1";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const {
    data: analyticsData,
    isFetching,
    error,
    refetch,
  } = useOverallAnalytics();

  if (error) {
    console.log(error);
  }

  const navigate = useNavigate()

  // Prepare chart data
  const osChartData =
    analyticsData?.osType?.map((item) => ({
      name: item.osName,
      value: item.uniqueUsers,
      clicks: item.uniqueClicks,
    })) || [];

  const deviceChartData =
    analyticsData?.deviceType?.map((item) => ({
      name: item.deviceName,
      users: item.uniqueUsers,
      clicks: item.uniqueClicks,
    })) || [];

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Loading Overlay */}
      {isFetching && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1a2e] p-6 rounded-lg border border-[#303052]">
            <Loader2 className="animate-spin h-8 w-8 text-[#6366f1] mx-auto mb-2" />
            <p className="text-[#e2e2f5] font-[SF-Pro-Regular]">
              Loading analytics...
            </p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6366f1]/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-[#6366f1]" />
            </div>
            <h1 className="text-4xl text-white font-[SF-Pro-Bold]">
              Dashboard
            </h1>
          </div>
          <div className="gap-5 flex">
            <Button
              onClick={() => navigate("/urls")}
              className="bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <Link className="h-4 w-4 mr-2" />
              URLs
            </Button>
            <Button
              onClick={() => refetch()}
              className="bg-[#c4c2ff] hover:bg-[#5855eb] text-[#0f0f1a] hover:text-white font-[SF-Pro-Bold] hover:cursor-pointer px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#1a1a2e] border-[#303052] hover:border-[#6366f1]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#6366f1]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm mb-1">
                    Total URLs
                  </p>
                  <p className="text-3xl font-[SF-Pro-Bold] text-[#e2e2f5]">
                    {analyticsData?.totalUrls || 0}
                  </p>
                </div>
                <div className="p-3 bg-[#6366f1]/20 rounded-full">
                  <Globe className="h-6 w-6 text-[#6366f1]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a2e] border-[#303052] hover:border-[#8b5cf6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5cf6]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm mb-1">
                    Total Clicks
                  </p>
                  <p className="text-3xl font-[SF-Pro-Bold] text-[#e2e2f5]">
                    {analyticsData?.totalClicks || 0}
                  </p>
                </div>
                <div className="p-3 bg-[#8b5cf6]/20 rounded-full">
                  <MousePointer className="h-6 w-6 text-[#8b5cf6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a2e] border-[#303052] hover:border-[#10b981]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#10b981]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm mb-1">
                    Unique Users
                  </p>
                  <p className="text-3xl font-[SF-Pro-Bold] text-[#e2e2f5]">
                    {analyticsData?.uniqueUsers || 0}
                  </p>
                </div>
                <div className="p-3 bg-[#10b981]/20 rounded-full">
                  <Users className="h-6 w-6 text-[#10b981]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* OS Analytics with Chart */}
          <Card className="bg-[#1a1a2e] border-[#303052]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white font-[SF-Pro-Bold] flex items-center gap-3">
                <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                  <Monitor className="h-5 w-5 text-[#6366f1]" />
                </div>
                OS Based Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OS Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analyticsData?.osType?.map((ele, index) => (
                  <div
                    key={index}
                    className="bg-[#0f0f1a] border border-[#303052] p-4 rounded-lg hover:border-[#6366f1]/30 transition-all duration-200"
                  >
                    <p className="text-[#e2e2f5] text-xl font-[SF-Pro-Bold] mb-3">
                      {ele.osName}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm">
                          Unique Clicks
                        </span>
                        <span className="text-[#e2e2f5] font-[SF-Pro-Bold] text-sm">
                          {ele.uniqueClicks}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm">
                          Unique Users
                        </span>
                        <span className="text-[#e2e2f5] font-[SF-Pro-Bold] text-sm">
                          {ele.uniqueUsers}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* OS Pie Chart */}
              {osChartData.length > 0 && (
                <div className="h-64">
                  <h3 className="text-lg text-[#e2e2f5] font-[SF-Pro-Bold] mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    User Distribution by OS
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={osChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          const safePercent = percent ?? 0;
                          return `${name} ${Math.round(safePercent * 100)}%`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {osChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Analytics with Chart */}
          <Card className="bg-[#1a1a2e] border-[#303052]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white font-[SF-Pro-Bold] flex items-center gap-3">
                <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
                  <MonitorCheck className="h-5 w-5 text-[#8b5cf6]" />
                </div>
                Device Based Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Device Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analyticsData?.deviceType?.map((ele, index) => (
                  <div
                    key={index}
                    className="bg-[#0f0f1a] border border-[#303052] p-4 rounded-lg hover:border-[#8b5cf6]/30 transition-all duration-200"
                  >
                    <p className="text-[#e2e2f5] text-xl font-[SF-Pro-Bold] mb-3">
                      {ele.deviceName}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm">
                          Unique Clicks
                        </span>
                        <span className="text-[#e2e2f5] font-[SF-Pro-Bold] text-sm">
                          {ele.uniqueClicks}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#e2e2f5]/70 font-[SF-Pro-Regular] text-sm">
                          Unique Users
                        </span>
                        <span className="text-[#e2e2f5] font-[SF-Pro-Bold] text-sm">
                          {ele.uniqueUsers}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Device Bar Chart */}
              {deviceChartData.length > 0 && (
                <div className="h-64">
                  <h3 className="text-lg text-[#e2e2f5] font-[SF-Pro-Bold] mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Users vs Clicks by Device
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#303052" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#e2e2f5", fontSize: 12 }}
                        axisLine={{ stroke: "#303052" }}
                      />
                      <YAxis
                        tick={{ fill: "#e2e2f5", fontSize: 12 }}
                        axisLine={{ stroke: "#303052" }}
                      />
                      <Tooltip content={<CustomTooltip1 />} />
                      <Legend wrapperStyle={{ color: "#e2e2f5" }} />
                      <Bar
                        dataKey="users"
                        fill="#8b5cf6"
                        name="Users"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="clicks"
                        fill="#6366f1"
                        name="Clicks"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
