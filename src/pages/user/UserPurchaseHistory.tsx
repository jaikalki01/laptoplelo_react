
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { transactions } from "@/data/transactions";
import { products } from "@/data/products";
import UserSidebar from "./UserSidebar";

const UserPurchaseHistory = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Filter transactions for the current user
  const userTransactions = transactions.filter(t => t.userId === user.id);
  
  // Apply filters
  const filteredTransactions = userTransactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.products.some(p => 
        products.find(prod => prod.id === p.product.id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesType = filterType === "all" || t.type === filterType;
    
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
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    // In a real app, this would download an invoice
    toast({
      title: "Invoice downloaded",
      description: `Invoice for order ${orderId} has been downloaded`,
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

  // Calculate due date for rentals (rental start date + rental duration)
  const calculateDueDate = (startDate: string, duration: number = 30) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return formatDate(date.toISOString());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ShoppingBag className="mr-2" /> Purchase History
              </CardTitle>
              <CardDescription>
                View your order history and track your purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Filter Orders</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Search orders..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="p-2 border rounded-md w-full"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="sale">Purchase</option>
                        <option value="rent">Rental</option>
                      </select>
                      
                      <select
                        className="p-2 border rounded-md w-full"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="startDate">From Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10 mt-1"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Label htmlFor="endDate">To Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10 mt-1"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Orders List */}
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No orders found</h3>
                    <p className="mt-1 text-gray-500">
                      {userTransactions.length === 0 
                        ? "You haven't made any purchases yet"
                        : "No orders match your search criteria"}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/products')}
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((order) => (
                      <div 
                        key={order.id} 
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Order #{order.id}</span>
                              <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>
                                {formatDate(order.date)} • {formatPrice(order.total)}
                              </span>
                              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                {order.type === 'sale' ? 'Purchase' : 'Rental'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex mt-2 sm:mt-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mr-2"
                              onClick={() => handleDownloadInvoice(order.id)}
                            >
                              <Download size={14} className="mr-1" /> Invoice
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleOrderDetails(order.id)}
                            >
                              {expandedOrder === order.id ? (
                                <>
                                  <ChevronUp size={14} className="mr-1" /> Hide
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={14} className="mr-1" /> Details
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Order Details */}
                        {expandedOrder === order.id && (
                          <div className="p-4 border-t">
                            {/* Products */}
                            <h3 className="font-medium mb-3">Products</h3>
                            <div className="space-y-4 mb-6">
                              {order.products.map((item, index) => {
                                const product = products.find(p => p.id === item.product.id) || item.product;
                                
                                return (
                                  <div key={index} className="flex items-center">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>
                                    
                                    <div className="ml-4 flex-1">
                                      <div className="flex justify-between">
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="font-medium">
                                          {formatPrice(order.type === 'rent' && product.rentalPrice 
                                            ? product.rentalPrice 
                                            : product.price
                                          )}
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                              {/* Rental Info */}
                              {order.type === 'rent' && (
                                <div>
                                  <h3 className="font-medium mb-2">Rental Information</h3>
                                  <dl className="divide-y">
                                    <div className="flex justify-between py-2">
                                      <dt className="text-sm text-gray-500">Rental Duration</dt>
                                      <dd className="text-sm font-medium">
                                        {order.rentDuration || 30} days
                                      </dd>
                                    </div>
                                    <div className="flex justify-between py-2">
                                      <dt className="text-sm text-gray-500">Start Date</dt>
                                      <dd className="text-sm font-medium">
                                        {formatDate(order.date)}
                                      </dd>
                                    </div>
                                    <div className="flex justify-between py-2">
                                      <dt className="text-sm text-gray-500">Due Date</dt>
                                      <dd className="text-sm font-medium">
                                        {calculateDueDate(order.date, order.rentDuration)}
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              )}
                              
                              {/* Payment Info */}
                              <div>
                                <h3 className="font-medium mb-2">Payment Information</h3>
                                <dl className="divide-y">
                                  <div className="flex justify-between py-2">
                                    <dt className="text-sm text-gray-500">Subtotal</dt>
                                    <dd className="text-sm font-medium">
                                      {formatPrice(order.total * 0.82)} {/* Simulated subtotal */}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-2">
                                    <dt className="text-sm text-gray-500">Tax</dt>
                                    <dd className="text-sm font-medium">
                                      {formatPrice(order.total * 0.18)} {/* Simulated tax */}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-2">
                                    <dt className="text-sm text-gray-500">Total</dt>
                                    <dd className="text-sm font-bold">
                                      {formatPrice(order.total)}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                            
                            {/* Order Status */}
                            {order.status === 'pending' && (
                              <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex">
                                <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
                                <div>
                                  <h3 className="font-medium text-yellow-800">Order in Progress</h3>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    {order.type === 'sale'
                                      ? "Your order is being processed. You'll receive a confirmation when it ships."
                                      : "Your rental is in progress. Please return the item(s) by the due date."}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

export default UserPurchaseHistory;
