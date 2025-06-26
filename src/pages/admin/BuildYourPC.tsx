import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PCBuild {
  id: string;
  processor: string;
  graphics_card: string;
  ram: string;
  storage: string;
  cooling: string;
  case_style: string;
  monitor: string;
  rgb_lights: string;
  mouse: string;
  keyboard: string;
  headset: string;
  speakers: string;
  power_supply: string;
  os: string;
}

const fields = [
  { name: "processor", label: "Processor" },
  { name: "graphics_card", label: "Graphics Card" },
  { name: "ram", label: "RAM" },
  { name: "storage", label: "Storage" },
  { name: "cooling", label: "Cooling" },
  { name: "case_style", label: "Case Style" },
  { name: "monitor", label: "Monitor" },
  { name: "rgb_lights", label: "RGB Lights" },
  { name: "mouse", label: "Mouse" },
  { name: "keyboard", label: "Keyboard" },
  { name: "headset", label: "Headset" },
  { name: "speakers", label: "Speakers" },
  { name: "power_supply", label: "Power Supply" },
  { name: "os", label: "Operating System" },
];

const BuildYourPC = () => {
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/pcbuilds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch builds");
      }

      const data = await response.json();
      setBuilds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  return (
    <AdminDashboard>
      <div className="p-6 space-y-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">
            🛠 PC Build Submissions
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBuilds}
            disabled={loading}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-900"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="border-purple-200 shadow-sm">
          <CardHeader className="bg-purple-50 rounded-t-lg border-b border-purple-100">
            <CardTitle className="text-lg text-purple-800">
              Custom PC Configurations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-purple-100" />
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive" className="m-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error loading builds</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : builds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="text-purple-600">
                  No PC builds found
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchBuilds}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-purple-50">
                    <TableRow>
                      {fields.map((field) => (
                        <TableHead 
                          key={field.name} 
                          className="font-medium text-purple-800"
                        >
                          {field.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {builds.map((build) => (
                      <TableRow 
                        key={build.id} 
                        className="hover:bg-purple-50/50 border-b border-purple-100"
                      >
                        {fields.map((field) => (
                          <TableCell key={field.name}>
                            {build[field.name as keyof PCBuild] || (
                              <span className="text-purple-400">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboard>
  );
};

export default BuildYourPC;