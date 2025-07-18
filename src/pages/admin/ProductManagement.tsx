import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Package,
  Search,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";

interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  available: boolean;
  type: string;
  image: string;
  rental_price: number;
}

const ProductManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

 const token = localStorage.getItem("token");
const isVerifying = token && !user;

useEffect(() => {
  if (isVerifying) return; // wait until token is verified

  if (!user || user.role !== "admin") {
    navigate("/login");
  }
}, [user, isVerifying, navigate]);



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || p.type.toLowerCase() === filterType;

      const matchesAvailability =
        filterAvailability === "all" ||
        (filterAvailability === "available" && p.available) ||
        (filterAvailability === "unavailable" && !p.available);

      return matchesSearch && matchesType && matchesAvailability;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterType, filterAvailability]);

  const handleDelete = async (productId: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });

      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete the product",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminDashboard>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Package className="mr-2" /> Product Management
          </h1>
          <Link to="/admin/add-product">
            <Button>
              <Plus size={18} className="mr-2" /> Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="both">For Both</option>
                </select>
              </div>
              <div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading products...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="px-6 py-3">Image</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Brand</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Rental Price</th>
                      <th className="px-6 py-3">Available</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={`${BASE_URL}/static/uploaded_images/${product.image}`}
                            alt={product.name}
                            className="w-16 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/default-product-image.png";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.brand}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.type === "sale"
                                ? "bg-blue-100 text-blue-700"
                                : product.type === "rent"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {product.type === "sale"
                              ? "For Sale"
                              : product.type === "rent"
                              ? "For Rent"
                              : "For Both"}
                          </span>
                        </td>
                        <td className="px-6 py-4">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">
                          {product.rental_price
                            ? formatPrice(product.rental_price)
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {product.available ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle size={16} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/edit-product/${product.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products found matching your search criteria.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default ProductManagement;
