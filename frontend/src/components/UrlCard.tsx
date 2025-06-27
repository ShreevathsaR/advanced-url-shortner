import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAnalytics } from "@/hooks/queries/getAnalytics";
import type { AllUrls } from "@/types/Url";
import { Link2, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UrlCardProps {
  showUrlCard: boolean;
  setShowUrlCard: React.Dispatch<React.SetStateAction<boolean>>;
  url: AllUrls;
}

export function UrlCard({ showUrlCard, setShowUrlCard, url }: UrlCardProps) {
  const { data: analyticsData, error } = useAnalytics(url._id);

  console.log(analyticsData);
  error && console.log("Error", error);

  return (
    <Dialog open={showUrlCard} onOpenChange={setShowUrlCard}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a2e] text-[#e2e2f5]">
        <DialogHeader>
          <DialogTitle className="font-[SF-Pro-Bold] flex gap-2 items-center">
            Your alias:{" "}
            <p className="text-white/70 font-[SF-Pro-Regular] text-sm">
              {url.customAlias}
            </p>
          </DialogTitle>
          <DialogDescription className="flex gap-5 mt-3">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url.originalUrl),
                  toast.success("Link copied to you clipboard");
              }}
              className="bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <LinkIcon />
              Original URL
            </Button>
            <Button
              className="bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              onClick={() => {
                navigator.clipboard.writeText(url.originalUrl),
                  toast.success("Link copied to you clipboard");
              }}
            >
              <Link2 />
              Short URL
            </Button>
          </DialogDescription>
        </DialogHeader>
        <h1 className="font-[SF-Pro-Bold] text-xl">Overall</h1>
        <div className="flex items-center justify-around">
          <div className="p-3 bg-[#303060] rounded-lg shadow-lg text-[#e2e2f5] font-[SF-Pro-Bold] flex flex-col items-center justify-center">
            <p>{analyticsData?.totalClicks}</p>
            <p className="font-[SF-Pro-Regular] text-sm">Total Clicks</p>
          </div>
          <div className="p-3 bg-[#303060] rounded-lg shadow-lg text-[#e2e2f5] font-[SF-Pro-Bold] flex flex-col items-center justify-center">
            <p>{analyticsData?.uniqueClicks}</p>
            <p className="font-[SF-Pro-Regular] text-sm">Unique Clicks</p>
          </div>
        </div>
        <h1 className="font-[SF-Pro-Bold] text-xl">Analytics</h1>
        <Tabs defaultValue="os" className="bg-[#303060] p-3 rounded-lg">
          <TabsList>
            <TabsTrigger value="os" className="bg-[#1a1a2e]">OS</TabsTrigger>
            <TabsTrigger value="device" className="bg-[#1a1a2e] ml-2">Device</TabsTrigger>
          </TabsList>
          <TabsContent value="os">
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
          </TabsContent>
          <TabsContent value="device">
            {" "}
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
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      \{" "}
    </Dialog>
  );
}
