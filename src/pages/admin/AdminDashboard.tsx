// AdminDashboard.tsx
import { useState, ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
 import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Package,
  Percent,
  ShoppingCart,
  Clock,
  FileText,
  BarChart2,
  User,
  Settings,
  PhoneCall,
  Home,
  LogOut,
  Cpu
} from "lucide-react";
import { BASE_URL } from "@/routes";

interface AdminDashboardProps {
  children?: ReactNode;
}

const AdminDashboard = ({ children }: AdminDashboardProps) => {

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

const { user, logout, isAuthReady } = useAuth();
 // ⬅ make sure you're getting isAuthReady

useEffect(() => {
  if (isAuthReady && (!user || user.role !== "admin")) {
    navigate("/login");
  }
}, [user, isAuthReady, navigate]);

if (!isAuthReady) return null; // ⬅ wait before rendering


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
    { name: "User Management", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Product Management", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Coupon Management", icon: <Percent size={20} />, path: "/admin/coupons" },
    { name: "Sales Transactions", icon: <ShoppingCart size={20} />, path: "/admin/transactions" },
    { name: "Rental Management", icon: <Clock size={20} />, path: "/admin/rentals" },
    { name: "Build PC", icon: <Cpu size={20} />, path: "/admin/buildpc" },
    { name: "Reports", icon: <FileText size={20} />, path: "/admin/reports" },
    // { name: "Analytics", icon: <BarChart2 size={20} />, path: "/admin/analytics" },
    { name: "Profile", icon: <User size={20} />, path: "/admin/profile" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
    { name: "Contact", icon: <PhoneCall size={20} />, path: "/admin/contacts" }
  ];

  const [stats, setStats] = useState({
    total_users: 0,
    products: 0,
    active_rentals: 0,
    sales_this_month: "\u20B90",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching dashboard stats:", err));
  }, []);

  const dashboardItems = [
    { title: "Total Users", value: stats.total_users, icon: <Users className="h-8 w-8 text-primary" /> },
    { title: "Products", value: stats.products, icon: <Package className="h-8 w-8 text-primary" /> },
    { title: "Active Rentals", value: stats.active_rentals, icon: <Clock className="h-8 w-8 text-primary" /> },
    { title: "Sales This Month", value: stats.sales_this_month, icon: <ShoppingCart className="h-8 w-8 text-primary" /> },
  ];

  const dashboardContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardItems.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 h-screen`}>
        <div className="flex items-center justify-between p-4 border-b">
         <Link to="/">
  <h1 className={`font-bold text-xl text-primary ${!isSidebarOpen && 'hidden'}`}>
    MumbaipcMart Admin
  </h1>
</Link>
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarOpen ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
            </svg>
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex ${isSidebarOpen ? "items-center" : "flex-col items-center"} px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors ${
                    window.location.pathname === item.path ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                  {!isSidebarOpen && <span className="text-xs mt-1">{item.name.split(" ")[0]}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className={`flex ${isSidebarOpen ? "items-center" : "flex-col items-center"} w-full px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors`}
              >
                <span className="mr-3"><LogOut size={20} /></span>
                {isSidebarOpen && <span>Logout</span>}
                {!isSidebarOpen && <span className="text-xs mt-1">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold">
              {window.location.pathname === "/admin"
                ? "Dashboard"
                : menuItems.find(item => item.path === window.location.pathname)?.name || "Dashboard"}
            </h1>
            <div className="flex items-center">
              <span className="text-sm mr-4">Welcome, {user?.name}</span>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold uppercase">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children || dashboardContent}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;