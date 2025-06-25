import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Clock,
  Search,
  Eye,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";

interface Rental {
  id: string;
  userId: string;
  date: string;
  rentDuration?: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  type: string;
}

// API configuration
const API_BASE_URL = "http://localhost:8001"; // Replace with your actual API base URL
const apiRoutes = {
  rentals: {
    getAll: `${API_BASE_URL}/rentals`,
    updateStatus: (id: string) => `${API_BASE_URL}/rentals/${id}/status`,
    delete: (id: string) => `${API_BASE_URL}/rentals/${id}`,
  },
};

const RentManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  // Helper functions
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const calculateDueDate = (startDate: string, duration: number = 30) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return formatDate(date.toISOString());
  };

  const isOverdue = (startDate: string, duration: number = 30) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + duration);
    return new Date() > dueDate;
  };

  // Data fetching
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get(apiRoutes.rentals.getAll);
        setRentals(response.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch rentals");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch rentals",
        });
      }
    };

    if (user && user.role === "admin") {
      fetchRentals();
    }
  }, [user, toast]);

  // Handlers
  const handleDeleteRental = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this rental?");
    if (confirmDelete) {
      try {
        await axios.delete(apiRoutes.rentals.delete(id));
        setRentals((prev) => prev.filter((r) => r.id !== id));
        toast({ title: "Deleted", description: `Rental ${id} has been deleted.` });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete rental",
        });
      }
    }
  };

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setEditStatus(rental.status);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedRental) return;

    try {
      await axios.patch(apiRoutes.rentals.updateStatus(selectedRental.id), {
        status: editStatus,
      });
      setRentals(prev =>
        prev.map(r =>
          r.id === selectedRental.id ? { ...r, status: editStatus as Rental['status'] } : r
        )
      );
      toast({ title: "Updated", description: `Status updated to "${editStatus}"` });
      setShowModal(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update rental status",
      });
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Filtering and sorting
  let filteredRentals = rentals.filter((t) => {
   const matchesSearch =
  String(t.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
  String(t.userId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || t.status === filterStatus;

    let matchesDate = true;
    const txDate = new Date(t.date);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = txDate >= start && txDate <= end;
    } else if (startDate) {
      matchesDate = txDate >= new Date(startDate);
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = txDate <= end;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  filteredRentals = filteredRentals.sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "amount") {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
    } else if (sortBy === "duration") {
      const durationA = a.rentDuration || 0;
      const durationB = b.rentDuration || 0;
      return sortOrder === "asc" ? durationA - durationB : durationB - durationA;
    }
    return 0;
  });

  // Auth check
  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <AdminDashboard>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminDashboard>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminDashboard>
        <div className="p-6 text-red-500 text-center">{error}</div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Clock className="mr-2" /> Rental Management
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/reports")}>
              View Reports
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b font-medium">Filters</div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by rental ID or user..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input type="date" className="pl-10" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input type="date" className="pl-10" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="px-6 py-3">Rental ID</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">
                    <button onClick={() => toggleSort("date")} className="flex items-center">
                      Start Date <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button onClick={() => toggleSort("duration")} className="flex items-center">
                      Duration <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">
                    <button onClick={() => toggleSort("amount")} className="flex items-center">
                      Amount <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => {
                  const overdue = rental.status === "pending" && isOverdue(rental.date, rental.rentDuration);
                  return (
                    <tr key={rental.id} className={`border-b ${overdue ? "bg-red-50" : ""}`}>
                      <td className="px-6 py-4">{rental.id}</td>
                      <td className="px-6 py-4">{rental.userId}</td>
                      <td className="px-6 py-4">{formatDate(rental.date)}</td>
                      <td className="px-6 py-4">{rental.rentDuration || 30} days</td>
                      <td className="px-6 py-4">
                        {calculateDueDate(rental.date, rental.rentDuration)}
                        {overdue && <AlertCircle size={16} className="text-red-600 inline ml-2" />}
                      </td>
                      <td className="px-6 py-4 font-medium">{formatPrice(rental.total)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            rental.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : rental.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rental.status === "pending" ? "Pending" : rental.status === "completed" ? "Returned" : "Cancelled"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(rental)}>
                            <Eye size={16} className="mr-1" /> View
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteRental(rental.id)}>
                            <X size={16} className="mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRentals.length === 0 && (
              <div className="text-center py-8 text-gray-500">No rentals found matching your criteria.</div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedRental && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedRental.id}</p>
                <p><strong>User ID:</strong> {selectedRental.userId}</p>
                <p><strong>Start Date:</strong> {formatDate(selectedRental.date)}</p>
                <p><strong>Duration:</strong> {selectedRental.rentDuration || 30} days</p>
                <p><strong>Amount:</strong> {formatPrice(selectedRental.total)}</p>
                <div>
                  <label className="block text-sm font-medium mb-1">Update Status</label>
                  <select className="w-full p-2 border rounded-md" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="completed">Returned</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
                <Button onClick={handleSaveStatus}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default RentManagement;