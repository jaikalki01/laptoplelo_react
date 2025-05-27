
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { users } from "@/data/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import axios from 'axios';

const UserManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterKYC, setFilterKYC] = useState("all");

  // If user is not admin, redirect to home
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:8001/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search_term: searchTerm,
            role: filterRole,
            kyc_status: filterKYC,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [searchTerm, filterRole, filterKYC]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || u.role === filterRole;

    const matchesKYC = filterKYC === "all" ||
      (filterKYC === "verified" && u.kycVerified) ||
      (filterKYC === "unverified" && !u.kycVerified);

    return matchesSearch && matchesRole && matchesKYC;
  });

  const handleDelete = (userId) => {
    // In a real app, this would be an API call
    toast({
      title: "User deleted",
      description: "User has been deleted successfully",
    });
  };

  const handleVerifyKYC = (userId) => {
    // In a real app, this would be an API call
    toast({
      title: "KYC status updated",
      description: "User KYC status has been updated successfully",
    });
  };

  const handleEdit = (userId) => {
    // In a real app, this would navigate to an edit page
    toast({
      title: "Edit user",
      description: "Redirecting to edit user page",
    });
  };


  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Users className="mr-2" /> User Management
          </h1>
          {/* <Button>Add New User</Button> */}
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              {/* <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterKYC}
                  onChange={(e) => setFilterKYC(e.target.value)}
                >
                  <option value="all">All KYC Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  {/* <th className="px-6 py-3">KYC Status</th>
                  <th className="px-6 py-3">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      {user.kycVerified ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" /> Not Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(user.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        {!user.kycVerified && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleVerifyKYC(user.id)}
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default UserManagement;
