
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Clock, 
  Search, 
  Filter, 
  Eye,
  ArrowUpDown,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { transactions } from "@/data/transactions";

// Filter only rent transactions
const rentTransactions = transactions.filter(t => t.type === 'rent');

const RentManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filter rent transactions
  let filteredRentals = rentTransactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    
    let matchesDate = true;
    const txDate = new Date(t.date);
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the full end date
      matchesDate = txDate >= start && txDate <= end;
    } else if (startDate) {
      const start = new Date(startDate);
      matchesDate = txDate >= start;
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = txDate <= end;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Sort transactions
  filteredRentals = filteredRentals.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
    } else if (sortBy === 'duration') {
      const durationA = a.rentDuration || 0;
      const durationB = b.rentDuration || 0;
      return sortOrder === 'asc' ? durationA - durationB : durationB - durationA;
    }
    return 0;
  });

  const handleViewDetails = (transactionId: string) => {
    // In a real app, this would navigate to a details page
    toast({
      title: "View rental",
      description: "Redirecting to rental details page",
    });
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Calculate due date (rental start date + rental duration)
  const calculateDueDate = (startDate: string, duration: number = 30) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return formatDate(date.toISOString());
  };

  // Check if rental is overdue
  const isOverdue = (startDate: string, duration: number = 30) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + duration);
    return new Date() > dueDate;
  };

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Clock className="mr-2" /> Rental Management
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/reports')}>
              View Reports
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
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
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">In Progress</option>
                  <option value="completed">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="date"
                    className="pl-10"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="date"
                    className="pl-10"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="px-6 py-3">Rental ID</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">
                    <button 
                      className="flex items-center text-left font-medium"
                      onClick={() => toggleSort('date')}
                    >
                      Start Date
                      <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button 
                      className="flex items-center text-left font-medium"
                      onClick={() => toggleSort('duration')}
                    >
                      Duration (Days)
                      <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">
                    <button 
                      className="flex items-center text-left font-medium"
                      onClick={() => toggleSort('amount')}
                    >
                      Amount
                      <ArrowUpDown size={14} className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => {
                  const overdue = rental.status === 'pending' && isOverdue(rental.date, rental.rentDuration);
                  
                  return (
                    <tr key={rental.id} className={`border-b hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4">{rental.id}</td>
                      <td className="px-6 py-4">{rental.userId}</td>
                      <td className="px-6 py-4">{formatDate(rental.date)}</td>
                      <td className="px-6 py-4">{rental.rentDuration || 30} days</td>
                      <td className="px-6 py-4">
                        {calculateDueDate(rental.date, rental.rentDuration)}
                        {overdue && (
                          <span className="inline-flex items-center ml-2 text-red-600">
                            <AlertCircle size={16} />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatPrice(rental.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rental.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : rental.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {rental.status === 'pending' ? 'In Progress' : 
                           rental.status === 'completed' ? 'Returned' : 'Cancelled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(rental.id)}
                        >
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRentals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No rentals found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default RentManagement;
