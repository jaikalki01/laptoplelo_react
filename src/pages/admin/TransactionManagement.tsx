
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye,
  Download,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { transactions } from "@/data/transactions";

const TransactionManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    
    const matchesType = filterType === "all" || t.type === filterType;
    
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
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const handleViewDetails = (transactionId: string) => {
    // In a real app, this would navigate to a details page
    toast({
      title: "View transaction",
      description: "Redirecting to transaction details page",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export transactions",
      description: "Transactions have been exported successfully",
    });
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

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <ShoppingCart className="mr-2" /> Transaction Management
          </h1>
          <Button onClick={handleExport}>
            <Download size={18} className="mr-2" /> Export
          </Button>
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
                    placeholder="Search by ID or user..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
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
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{transaction.id}</td>
                    <td className="px-6 py-4">{transaction.userId}</td>
                    <td className="px-6 py-4">{formatDate(transaction.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'sale' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {transaction.type === 'sale' ? 'Sale' : 'Rent'}
                        {transaction.rentDuration && ` (${transaction.rentDuration} days)`}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(transaction.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(transaction.id)}
                      >
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default TransactionManagement;
