import { useAllUrls } from "@/hooks/queries/getAllUrls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Loader2,
  RefreshCcw,
  BarChart,
  Plus,
  Delete,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "@/lib/baseUrl";

const Urls = () => {
  const { data: urls, error, isFetching, refetch } = useAllUrls();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");

  const navigate = useNavigate();

  if (error) {
    console.log(error);
  }

  function truncate(str: string, maxLength = 20) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  const handleCreateShortUrl = async () => {
    if (!originalUrl) {
      return toast.error("Please enter Original URL");
    }

    const payload = {
      originalUrl,
      ...(topic && topic.trim() !== "" && { topic }),
      ...(customAlias && customAlias.trim() !== "" && { customAlias }),
    };

    try {
      const response = await api.post("/shorten", { ...payload });
      console.log(response.data);
      if (response.data.success) {
        toast.success("Success", {
          description: "Short URL created successfully",
        });
        setTopic('')
        setCustomAlias('')
        setOriginalUrl('')
        //TODO Close Dialog
        return;
      }
      toast.error("Error creating URL");
    } catch (error) {
      console.log(error);
      toast.error("Error creating URL");
    }
  };

  return (
    <div className="min-h-screen p-15 flex flex-col bg-[#0f0f1a] max-w-screen">
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
      <div className="flex justify-between w-full p-10">
        <h1 className="text-4xl text-white font-[SF-Pro-Bold]">
          Your all URLs
        </h1>
        <div className="gap-5 flex">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Dialog>
            <DialogTrigger className="flex items-center bg-[#e2e2f5] hover:text-[#e2e2f5] hover:cursor-pointer hover:bg-[#5855eb] text-[#0f0f1a] font-[SF-Pro-Bold] px-4 rounded-lg transition-all duration-200 hover:shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#303060] text-[#e2e2f5]">
              <DialogHeader>
                <DialogTitle>Shorten a URL</DialogTitle>
                <DialogDescription>Create a new short URL</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="originalUrl-1">Original URL/Long URL</Label>
                  <Input
                    id="originalUrl"
                    name="orignalUrl"
                    placeholder="URL to be shortened"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="alias-1">Custom Alias</Label>
                  <Input
                    id="customAlias"
                    name="customAlias"
                    placeholder="A unique alia"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="topic-1">Topic</Label>
                  <Input
                    id="topic"
                    name="topic"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleCreateShortUrl()}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => refetch()}
            className="bg-[#c4c2ff] hover:bg-[#5855eb] text-[#0f0f1a] hover:text-white font-[SF-Pro-Bold] hover:cursor-pointer px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {urls && urls.length > 0 && (
        <Table className="w-full rounded-lg bg-[#1a1a2e] border border-[#303060] overflow-hidden text-sm">
          <TableHeader>
            <TableRow className="bg-[#23233b] text-[#a48fff] border-b border-[#303060]">
              <TableHead className="w-[120px] px-4 py-3">Alias</TableHead>
              <TableHead className="px-4 py-3">Original URL</TableHead>
              <TableHead className="px-4 py-3">Topic</TableHead>
              <TableHead className="px-4 py-3">Created At</TableHead>
              <TableHead className="px-4 py-3">Copy</TableHead>
              <TableHead className="text-right px-4 py-3">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url, index) => {
              return (
                <TableRow
                  key={index}
                  className="text-[#e2e2f5] border-b border-[#303060] hover:bg-[#2a2a45] transition-colors duration-150"
                >
                  <TableCell className="font-medium px-4 py-2">
                    {url.customAlias}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {truncate(url.originalUrl)}
                  </TableCell>
                  <TableCell className="px-4 py-2">{url.topic}</TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(url.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Copy
                      className="hover:text-[#a48fff] cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        navigator.clipboard.writeText(url.shortUrl),
                          toast.success("Copied to clipboard");
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex justify-end px-4 py-2">
                    <Delete className="hover:text-[#ff5470] cursor-pointer transition-colors duration-150" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Urls;
