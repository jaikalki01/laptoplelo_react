
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Tag, 
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

// Mock offers data
const offers = [
  {
    id: "OFF001",
    title: "Summer Special",
    description: "Get 20% off on selected laptops",
    discountType: "percentage",
    discountValue: 20,
    productIds: ["PRD001", "PRD002", "PRD003"],
    validFrom: "2025-05-01",
    validTo: "2025-06-30",
    isActive: true,
    bannerImage: "https://placehold.co/600x200/orange/white?text=Summer+Sale"
  },
  {
    id: "OFF002",
    title: "Back to School",
    description: "Flat ₹5000 off on premium laptops",
    discountType: "fixed",
    discountValue: 5000,
    productIds: ["PRD004", "PRD005"],
    validFrom: "2025-07-01",
    validTo: "2025-08-15",
    isActive: true,
    bannerImage: "https://placehold.co/600x200/blue/white?text=Back+To+School"
  },
  {
    id: "OFF003",
    title: "Gaming Special",
    description: "15% off on gaming laptops",
    discountType: "percentage",
    discountValue: 15,
    productIds: ["PRD006", "PRD007"],
    validFrom: "2025-04-01",
    validTo: "2025-04-30",
    isActive: false,
    bannerImage: "https://placehold.co/600x200/red/white?text=Gaming+Special"
  }
];

const OfferManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filter offers based on search term and filters
  const filteredOffers = offers.filter(o => {
    const matchesSearch = 
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && o.isActive) ||
      (filterStatus === "inactive" && !o.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (offerId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Offer deleted",
      description: "Offer has been deleted successfully",
    });
  };

  const handleEdit = (offerId: string) => {
    // In a real app, this would navigate to an edit page
    toast({
      title: "Edit offer",
      description: "Redirecting to edit offer page",
    });
  };

  const formatDiscount = (offer: any) => {
    return offer.discountType === 'percentage' 
      ? `${offer.discountValue}%` 
      : `₹${offer.discountValue}`;
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
            <Tag className="mr-2" /> Offer Management
          </h1>
          <Button>
            <Plus size={18} className="mr-2" /> Add New Offer
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
                    placeholder="Search offers..."
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
          <div className="grid gap-6 p-6">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="flex flex-col md:flex-row">
                  {offer.bannerImage && (
                    <div className="md:w-1/4">
                      <img 
                        src={offer.bannerImage} 
                        alt={offer.title} 
                        className="w-full h-32 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-4 flex-1 ${!offer.bannerImage ? 'md:w-full' : 'md:w-3/4'}`}>
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{offer.title}</h3>
                        <p className="text-gray-600">{offer.description}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        {offer.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle size={12} className="mr-1" /> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Offer ID</p>
                        <p>{offer.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Discount</p>
                        <p className="font-medium">{formatDiscount(offer)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valid Period</p>
                        <p>{formatDate(offer.validFrom)} - {formatDate(offer.validTo)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Products</p>
                        <p>{offer.productIds.length} products</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(offer.id)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredOffers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No offers found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboard>
  );
};

export default OfferManagement;
