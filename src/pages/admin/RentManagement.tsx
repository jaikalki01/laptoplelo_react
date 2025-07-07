// src/pages/admin/RentManagement.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Clock, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { BASE_URL } from "@/routes";
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
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showModal, setShowModal] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/rentals/rentals`);
      setRentals(response.data);
    } catch (err) {
      setError("Failed to load rentals");
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch rental data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchRentals();
    else navigate("/login");
  }, [user]);

  const filteredRentals = rentals
    .filter((r) => [r.id, r.user_id].some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase())))
    .filter((r) => filterStatus === "all" || r.status === filterStatus)
    .filter((r) => {
      const rentalDate = new Date(r.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate + "T23:59:59") : null;
      return (!from || rentalDate >= from) && (!to || rentalDate <= to);
    });

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const paginatedRentals = filteredRentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderRentalDetails = (rental: Rental) => (
    <div className="text-sm space-y-2">
      <div><strong>ID:</strong> {rental.id}</div>
      <div><strong>Status:</strong> {rental.status}</div>
      <div><strong>Total:</strong> ₹{rental.total}</div>
      <div><strong>Type:</strong> {rental.type || "rent"}</div>
      <div><strong>Duration:</strong> {rental.rent_duration || 30} days</div>
      <div><strong>Date:</strong> {new Date(rental.date).toLocaleString()}</div>
      <div className="pt-2 border-t">
        <h4 className="font-semibold">User Info</h4>
        {rental.user ? (
          <>
            <div>ID: {rental.user.id}</div>
            <div>Name: {rental.user.name}</div>
            <div>Email: {rental.user.email}</div>
            <div>Phone: {rental.user.phone || "N/A"}</div>
          </>
        ) : <div className="text-gray-500">Unavailable</div>}
      </div>
      <div className="pt-2 border-t">
        <h4 className="font-semibold">Product Info</h4>
        {rental.product ? (
          <>
            <div>ID: {rental.product.id}</div>
            <div>Name: {rental.product.name}</div>
            <div>Price: ₹{rental.product.price}</div>
          </>
        ) : <div className="text-gray-500">Unavailable</div>}
      </div>
    </div>
  );

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Input placeholder="Search by ID or User ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="border rounded px-2 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

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
              {paginatedRentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="p-3">{rental.id}</td>
                  <td className="p-3">{rental.user_id}</td>
                  <td className="p-3">{rental.product_id ?? "N/A"}</td>
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
                  <td className="p-3 text-sm">{rental.user?.name || "N/A"}</td>
                  <td className="p-3 text-sm">{rental.product?.name || "N/A"}</td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRental(rental);
                        setShowModal(true);
                      }}
                    >
                      <Eye size={14} className="mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center items-center gap-2">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</Button>
          <span className="px-2">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
        </div>

        {showModal && selectedRental && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
              <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
                <X />
              </button>
              <h3 className="text-lg font-bold mb-4">Rental Details</h3>
              {renderRentalDetails(selectedRental)}
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default RentManagement;
