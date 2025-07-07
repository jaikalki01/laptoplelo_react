import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Box,
  Clock,
  CalendarDays,
  User,
  CheckCircle,
  XCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
  Truck,
  CreditCard,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import axios from 'axios';
import { BASE_URL } from "@/routes";
interface Specs {
  processor: string;
  memory: string;
  storage: string;
  display: string;
  graphics: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  type: string;
  image: string;
  brand: string;
  specs: Specs;
  available: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

interface Order {
  id: number;
  product_id: string;
  rental_duration: number;
  timestamp: string;
  status: "ordered" | "packed" | "shipped" | "delivered" | "cancelled";
  delivery_date: string;
  payment_method: string;
  product: Product;
}

const Orders = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState({
    product_id: "",
    rental_duration: "7"
  });
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const endpoint = user.role === 'admin' ? '/order/list' : '/order/my';
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
    if (!newOrder.product_id || !newOrder.rental_duration) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post('${BASE_URL}/order/create', {
        product_id: parseInt(newOrder.product_id),
        rental_duration: parseInt(newOrder.rental_duration),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Order placed successfully",
      });

      const endpoint = user?.role === 'admin' ? '/order/list' : '/order/my';
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setNewOrder({ product_id: "", rental_duration: "7" });
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered": return "bg-blue-100 text-blue-800";
      case "packed": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered": return <Clock className="mr-1" size={14} />;
      case "packed": return <Box className="mr-1" size={14} />;
      case "shipped": return <Truck className="mr-1" size={14} />;
      case "delivered": return <CheckCircle className="mr-1" size={14} />;
      case "cancelled": return <XCircle className="mr-1" size={14} />;
      default: return null;
    }
  };

  return (
    <AdminDashboard>
      <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600">View and manage your rental orders</p>
        </div>

        {/* Order Tabs */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </Button>
            <Button
              variant={activeTab === "ordered" ? "default" : "ghost"}
              onClick={() => setActiveTab("ordered")}
            >
              Ordered
            </Button>
            <Button
              variant={activeTab === "packed" ? "default" : "ghost"}
              onClick={() => setActiveTab("packed")}
            >
              Packed
            </Button>
            <Button
              variant={activeTab === "shipped" ? "default" : "ghost"}
              onClick={() => setActiveTab("shipped")}
            >
              Shipped
            </Button>
            <Button
              variant={activeTab === "delivered" ? "default" : "ghost"}
              onClick={() => setActiveTab("delivered")}
            >
              Delivered
            </Button>
            <Button
              variant={activeTab === "cancelled" ? "default" : "ghost"}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow flex justify-center">
              <RefreshCw className="animate-spin" size={24} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Order #{order.id} • Placed on {new Date(order.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {order.status === "shipped" && (
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <Truck className="mr-1" size={14} />
                        Expected delivery by {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    {expandedOrder === order.id ? "Hide Details" : "View Details"}
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="p-4 flex items-start">
                  <img
                    src={order.product.image || "https://via.placeholder.com/80"}
                    alt={order.product.name}
                    className="w-20 h-20 object-contain border rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{order.product.name}</h3>
                    <p className="text-sm text-gray-500">{order.product.brand}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
                        <span className="text-xs font-medium">{order.product.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({order.product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="text-gray-500">Rental Duration:</span> {order.rental_duration} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(order.product.rental_price * order.rental_duration).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">₹{order.product.rental_price}/day</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Product Details */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Box className="mr-2" size={18} /> Product Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Brand:</span> {order.product.brand}</p>
                          <p><span className="text-gray-500">Type:</span> {order.product.type}</p>
                          <p><span className="text-gray-500">Description:</span> {order.product.description}</p>
                        </div>
                      </div>

                      {/* Specifications */}
                      <div>
                        <h4 className="font-medium mb-3">Specifications</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Processor:</span> {order.product.specs.processor}</p>
                          <p><span className="text-gray-500">Memory:</span> {order.product.specs.memory}</p>
                          <p><span className="text-gray-500">Storage:</span> {order.product.specs.storage}</p>
                          <p><span className="text-gray-500">Display:</span> {order.product.specs.display}</p>
                          <p><span className="text-gray-500">Graphics:</span> {order.product.specs.graphics}</p>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <CreditCard className="mr-2" size={18} /> Order Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Order Date:</span> {new Date(order.timestamp).toLocaleString()}</p>
                          <p><span className="text-gray-500">Status:</span> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span></p>
                          <p><span className="text-gray-500">Payment Method:</span> {order.payment_method}</p>
                          <p><span className="text-gray-500">Total Amount:</span> ₹{(order.product.rental_price * order.rental_duration).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                      <div className="space-x-2">
                        {order.status === "ordered" && (
                          <Button variant="destructive" size="sm">
                            Cancel Order
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Need Help?
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Orders;