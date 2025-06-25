import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";

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
  { name: 'processor', label: 'Processor' },
  { name: 'graphics_card', label: 'Graphics Card' },
  { name: 'ram', label: 'RAM' },
  { name: 'storage', label: 'Storage' },
  { name: 'cooling', label: 'Cooling' },
  { name: 'case_style', label: 'Case Style' },
  { name: 'monitor', label: 'Monitor' },
  { name: 'rgb_lights', label: 'RGB Lights' },
  { name: 'mouse', label: 'Mouse' },
  { name: 'keyboard', label: 'Keyboard' },
  { name: 'headset', label: 'Headset' },
  { name: 'speakers', label: 'Speakers' },
  { name: 'power_supply', label: 'Power Supply' },
  { name: 'os', label: 'Operating System' },
];

const BuildYourPC = () => {
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/pcbuilds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch builds");
        }
        return res.json();
      })
      .then((data) => {
        setBuilds(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, []);

  return (
    <AdminDashboard>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">🛠 Build Your PC Submissions</h1>

        {loading ? (
          <div className="text-gray-500">Loading builds...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : builds.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            No builds found.
          </div>
        ) : (
          <div className="overflow-auto border rounded-lg max-h-[70vh]">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
                <tr>
                  {fields.map((field) => (
                    <th key={field.name} className="px-4 py-3 border-b">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {builds.map((build) => (
                  <tr key={build.id} className="hover:bg-gray-50 border-b">
                    {fields.map((field) => (
                      <td key={field.name} className="px-4 py-2">
                        {build[field.name as keyof PCBuild] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default BuildYourPC;
