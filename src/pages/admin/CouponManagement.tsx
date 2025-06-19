import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Percent,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { BASE_URL } from "@/routes";

// Modal Component
const AddCouponModal = ({ isOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minCartValue, setMinCartValue] = useState("");

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!code || !discountValue) {
      toast({
        title: "Missing Fields",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem("token"); // Replace with your token retrieval method

    if (!token) {
      toast({
        title: "Unauthorized",
        description: "You need to log in first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/coupon`, {
        code,
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        min_cart_value: parseFloat(minCartValue) || 0,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        }
      });

      toast({
        title: "Success",
        description: `Coupon "${code}" added successfully.`,
      });

      onSubmit(); // Refresh coupon list
      onClose(); // Close modal
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add coupon. Please try again.",
        variant: "destructive",
      });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Add New Coupon</h3>
        <div className="mb-4">
          <Input
            placeholder="Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <select
            className="w-full p-2 border rounded-md"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="mb-4">
          <Input
            placeholder="Discount Value"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            type="number"
          />
        </div>
        <div className="mb-4">
          <Input
            placeholder="Min Cart Value (Optional)"
            value={minCartValue}
            onChange={(e) => setMinCartValue(e.target.value)}
            type="number"
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Coupon</Button>
        </div>
      </div>
    </div>
  );
};

const CouponManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false); // Modal state

  const handleAddCoupon = async (formData: {
    code: string;
    discount_type: string;
    discount_value: number;
    min_cart_value: number;
  }) => {
    try {
      await axios.post(`${BASE_URL}/coupon`, formData);
      toast({
        title: "Coupon Created",
        description: `Coupon ${formData.code} was created successfully.`,
      });
      fetchCoupons(); // refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon. Please try again.",
        variant: "destructive",
      });
    }
  };


  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fetch coupons from FastAPI
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/coupon`);
      setCoupons(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coupons.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);


  // Filter coupons based on search term and filters
  const filteredCoupons = coupons.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && c.is_active) ||
      (filterStatus === "inactive" && !c.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (couponId: string) => {
    try {
      await axios.delete(`${BASE_URL}/coupon/delete/${couponId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCoupons(coupons.filter(coupon => coupon.id !== couponId)); // Update state

      toast({
        title: "Coupon deleted",
        description: "Coupon has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon.",
        variant: "destructive",
      });
    }
  };


  const handleToggle = async (coupon) => {
    const token = localStorage.getItem("token");

    try {
      if (coupon.is_active) {
        await axios.delete(`${BASE_URL}/coupon/deactivate/${coupon.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_URL}/coupon/activate/${coupon.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchCoupons(); // or setCoupons(...) to update the list
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };




  const handleEdit = (couponId: string) => {
    // In a real app, this would navigate to an edit page
    toast({
      title: "Edit coupon",
      description: "Redirecting to edit coupon page",
    });
  };

  const formatDiscount = (coupon: any) => {
    return coupon.discount_type === 'percentage'
      ? `${coupon.discount_value}%`
      : `₹${coupon.discount_value}`;
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
            <Percent className="mr-2" /> Coupon Management
          </h1>
          <Button onClick={() => setIsAddCouponModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Add New Coupon
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search coupons..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="px-6 py-3">Coupon ID</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Min Order</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No coupons found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon, index) => (
                    <tr key={coupon.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{coupon.code}</td>
                      <td className="px-6 py-4">{formatDiscount(coupon)}</td>
                      <td className="px-6 py-4">₹{coupon.min_cart_value}</td>
                      <td className="px-6 py-4">
                        {coupon.is_active ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <XCircle size={16} className="mr-1" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(coupon.id)}
                          >
                            <Edit size={16} />
                          </Button> */}
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={coupon.is_active === 1}
                              onChange={() => handleToggle(coupon)} // ✅ Passing coupon
                            />
                            <span className="slider round"></span>
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Coupon Modal */}
        <AddCouponModal
          isOpen={isAddCouponModalOpen}
          onClose={() => setIsAddCouponModalOpen(false)}
          onSubmit={() => fetchCoupons()}
        />
      </div>
    </AdminDashboard>
  );
};

export default CouponManagement;
