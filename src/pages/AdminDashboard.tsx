
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Percent,
  TrendingUp,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Home,
  ChevronLeft,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const menuItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, id: "dashboard" },
    {
      name: "User Management",
      icon: <Users className="h-5 w-5" />,
      id: "users",
    },
    {
      name: "Product Management",
      icon: <Package className="h-5 w-5" />,
      id: "products",
    },
    {
      name: "Coupon Management",
      icon: <Percent className="h-5 w-5" />,
      id: "coupons",
    },
    {
      name: "Offer Management",
      icon: <TrendingUp className="h-5 w-5" />,
      id: "offers",
    },
    {
      name: "Reports",
      icon: <BarChart2 className="h-5 w-5" />,
      id: "reports",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      id: "settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div className="font-bold text-lg text-primary">Admin Panel</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-2 text-left ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </span>
                  {sidebarOpen && activeTab === item.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            {sidebarOpen ? (
              <>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mx-auto">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className={`flex items-center ${
              sidebarOpen ? "w-full" : "w-full justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {
                menuItems.find((item) => item.id === activeTab)?.name ||
                "Dashboard"
              }
            </h1>
            <p className="text-gray-500">
              {activeTab === "dashboard"
                ? "Overview of your store's performance"
                : `Manage all ${activeTab}`}
            </p>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">125</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +12% from last
                      month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹52,489</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +8% from last
                      month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Rentals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +5% from last
                      month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      Details of the last 5 sales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500">
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Product</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            customer: "Amit Kumar",
                            product: "Dell XPS 13",
                            amount: "₹89,999",
                            status: "completed",
                          },
                          {
                            customer: "Priya Singh",
                            product: "MacBook Pro 14",
                            amount: "₹179,999",
                            status: "completed",
                          },
                          {
                            customer: "Rahul Sharma",
                            product: "ASUS ROG Zephyrus",
                            amount: "₹139,999",
                            status: "pending",
                          },
                          {
                            customer: "Sneha Patel",
                            product: "HP Spectre x360",
                            amount: "₹134,999",
                            status: "completed",
                          },
                          {
                            customer: "Vikram Singh",
                            product: "Lenovo ThinkPad X1",
                            amount: "₹124,999",
                            status: "completed",
                          },
                        ].map((sale, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 text-sm">{sale.customer}</td>
                            <td className="py-2 text-sm">{sale.product}</td>
                            <td className="py-2 text-sm">{sale.amount}</td>
                            <td className="py-2 text-sm">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  sale.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Rentals</CardTitle>
                    <CardDescription>
                      Details of the last 5 rentals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500">
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Product</th>
                          <th className="pb-2">Duration</th>
                          <th className="pb-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            customer: "Vikram Singh",
                            product: "Lenovo ThinkPad X1",
                            duration: "3 months",
                            amount: "₹17,997",
                          },
                          {
                            customer: "Anita Desai",
                            product: "HP Spectre x360",
                            duration: "1 month",
                            amount: "₹6,499",
                          },
                          {
                            customer: "Rajesh Kumar",
                            product: "Microsoft Surface",
                            duration: "6 months",
                            amount: "₹26,994",
                          },
                          {
                            customer: "Preeti Joshi",
                            product: "Razer Blade 15",
                            duration: "2 months",
                            amount: "₹19,998",
                          },
                          {
                            customer: "Kabir Singh",
                            product: "Acer Swift 5",
                            duration: "1 month",
                            amount: "₹3,999",
                          },
                        ].map((rental, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 text-sm">{rental.customer}</td>
                            <td className="py-2 text-sm">{rental.product}</td>
                            <td className="py-2 text-sm">{rental.duration}</td>
                            <td className="py-2 text-sm">{rental.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab !== "dashboard" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-center py-12">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                management interface is under development. Please check back
                later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
