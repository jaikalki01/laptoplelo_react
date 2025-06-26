// src/pages/admin/RentManagement.tsx
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

// Rental Interface
interface Rental {
  id: string;
  user_id: string;
  product_id?: string;
  date: string;
  rent_duration?: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  type?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
  };
}


// API base URL
const API_BASE_URL = "http://localhost:8001";

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

  const fetchRentals = async () => {
    try {
      setLoading(true);
const response = await axios.get("http://localhost:8001/rentals/rentals");
      setRentals(response.data);
    } catch (err) {
      setError("Failed to load rentals");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch rental data",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async () => {
    if (!selectedRental) return;
    try {
      await axios.patch(`${API_BASE_URL}/rentals/${selectedRental.id}/status`, {
        status: editStatus,
      });
      setRentals((prev) =>
        prev.map((r) =>
          r.id === selectedRental.id ? { ...r, status: editStatus as Rental["status"] } : r
        )
      );
      toast({ title: "Updated", description: "Rental status updated successfully." });
      setShowModal(false);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const deleteRental = async (id: string) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE_URL}/rentals/${id}`);
      setRentals((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Rental deleted." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Delete failed." });
    }
  };

  const filteredRentals = rentals
    .filter((r) =>
      [r.id, r.user_id].some((v) =>
        v?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((r) => filterStatus === "all" || r.status === filterStatus)
    .filter((r) => {
      const rentalDate = new Date(r.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate + "T23:59:59") : null;
      return (!from || rentalDate >= from) && (!to || rentalDate <= to);
    })
    .sort((a, b) => {
      const get = (key: string, r: Rental) =>
        key === "date"
          ? new Date(r.date).getTime()
          : key === "amount"
          ? r.total
          : r.rent_duration || 0;
      const aVal = get(sortBy, a);
      const bVal = get(sortBy, b);
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const isOverdue = (date: string, duration = 30) => {
    const due = new Date(date);
    due.setDate(due.getDate() + duration);
    return new Date() > due;
  };

  useEffect(() => {
    if (user?.role === "admin") fetchRentals();
    else navigate("/login");
  }, [user]);

  if (loading) {
    return (
      <AdminDashboard>
        <div className="p-10 text-center">Loading...</div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <Clock className="mr-2" /> Rental Management
          </h2>
          <Button onClick={fetchRentals}>Refresh</Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by ID or User ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded px-2 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        {/* Table */}
        <div className="overflow-auto rounded shadow bg-white">
          <table className="w-full text-sm">
           <thead>
  <tr className="bg-gray-100 text-left">
    <th className="p-3">ID</th>
    <th className="p-3">User ID</th>
    <th className="p-3">Product ID</th>
    <th className="p-3">Start Date</th>
    <th className="p-3">Duration</th>
    <th className="p-3">Status</th>
    <th className="p-3">Amount</th>
    <th className="p-3">Type</th>
    <th className="p-3">User Info</th>
    <th className="p-3">Product Info</th>
    <th className="p-3">Actions</th>
  </tr>
</thead>

            <tbody>
              {filteredRentals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No rentals found.
                  </td>
                </tr>
              ) : (
                filteredRentals.map((rental) => (
                <tr key={rental.id}>
  <td className="p-3">{rental.id}</td>
  <td className="p-3">{rental.user_id}</td>
  <td className="p-3">{rental.product_id}</td>
  <td className="p-3">{new Date(rental.date).toLocaleDateString()}</td>
  <td className="p-3">{rental.rent_duration || 30} days</td>
  <td className="p-3">
    <span className={`px-2 py-1 rounded text-xs ${
      rental.status === "completed"
        ? "bg-green-100 text-green-800"
        : rental.status === "cancelled"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }`}>
      {rental.status}
    </span>
  </td>
  <td className="p-3">₹{rental.total}</td>
  <td className="p-3">{rental.type || "rent"}</td>

  {/* User Info */}
  <td className="p-3 text-sm">
    <div>ID: {rental.user?.id}</div>
    <div>Name: {rental.user?.name}</div>
    <div>Email: {rental.user?.email}</div>
    <div>Phone: {rental.user?.phone}</div>
  </td>

  {/* Product Info */}
  <td className="p-3 text-sm">
    <div>ID: {rental.product?.id}</div>
    <div>Name: {rental.product?.name}</div>
    <div>Price: ₹{rental.product?.price}</div>
  </td>

  {/* Actions */}
  <td className="p-3 flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setSelectedRental(rental);
        setEditStatus(rental.status);
        setShowModal(true);
      }}
    >
      <Eye size={14} className="mr-1" /> View
    </Button>
    <Button
      variant="destructive"
      size="sm"
      onClick={() => deleteRental(rental.id)}
    >
      <X size={14} className="mr-1" /> Delete
    </Button>
  </td>
</tr>

                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showModal && selectedRental && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
              <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
                <X />
              </button>
              <h3 className="text-lg font-bold mb-2">Update Status</h3>
              <p className="mb-2 text-sm">Rental ID: {selectedRental.id}</p>
              <select
                className="w-full border px-3 py-2 rounded mb-4"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={updateRentalStatus}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default RentManagement;
