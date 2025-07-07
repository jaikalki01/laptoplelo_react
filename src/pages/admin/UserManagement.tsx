import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  kycVerified: boolean;
}

interface ApiResponse {
  users: User[];
  total: number;
  totalPages: number;
}
const UserManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterKYC, setFilterKYC] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10; // Number of users to show per page

  // Redirect if not admin
useEffect(() => {
  if (!user) {
    navigate("/login");
    return;
  }

  // Check role first
  if (user.role !== "admin") {
    navigate("/login");
    return;
  }

  // Then check email
  if (user.email !== "mumbaipcmart@gmail.com") {
    navigate("/login");
    return;
  }

}, [user, navigate]);
;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== "admin") return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search_term: searchTerm,
            role: filterRole,
            kyc_status: filterKYC,
            page: currentPage,
            limit: usersPerPage,
          },
        });

        console.log("Fetched users:", response.data);
        // Ensure we set an array
        const data = response.data;
        if (Array.isArray(data)) {
          setUsers(data);
          // If your API doesn't provide pagination info, you might need to handle it differently
          setTotalUsers(data.length);
          setTotalPages(Math.ceil(data.length / usersPerPage));
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
          // Assuming your API returns pagination info like this:
          setTotalUsers(data.total || data.users.length);
          setTotalPages(data.totalPages || Math.ceil((data.total || data.users.length) / usersPerPage));
        } else {
          setUsers([]);
          setTotalUsers(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, filterRole, filterKYC, user, toast, currentPage]);

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  if (user.role !== "admin") {
    return null; // Redirect will happen in useEffect
  }

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => {
        const matchesSearch =
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || u.role === filterRole;
        const matchesKYC =
          filterKYC === "all" ||
          (filterKYC === "verified" && u.kycVerified) ||
          (filterKYC === "unverified" && !u.kycVerified);
        return matchesSearch && matchesRole && matchesKYC;
      })
    : [];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Users className="mr-2" /> User Management
          </h1>
          <div className="text-sm text-gray-500">
            Total Users: {totalUsers}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setCurrentPage(1); // Reset to first page when changing role filter
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterKYC}
                  onChange={(e) => {
                    setFilterKYC(e.target.value);
                    setCurrentPage(1); // Reset to first page when changing KYC filter
                  }}
                >
                  <option value="all">All KYC Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading users...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="px-6 py-3">User ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">KYC Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.kycVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.kycVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found matching your search criteria.
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                    {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default UserManagement;