import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  User, 
  Mail, 
  MapPin, 
  Shield,
  Edit,
  X,
  Check,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import UserSidebar from "./UserSidebar";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/routes";

const UserProfile = () => {
  const { user, setUser } = useApp();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: null as File | null
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when modal opens
  const openEditModal = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePic: null
      });
      setPreviewImage(user.profilePic || "");
    }
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      // Make API call to update profile
      const response = await fetch(`${BASE_URL}/users/${user.id}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update user context with server response
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openEditModal}
                >
                  <Edit size={16} className="mr-2" /> Edit Profile
                </Button>
              </div>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt={user.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-lg flex items-center">
                        {user.email} 
                        {user.emailVerified && (
                          <span className="ml-2 text-green-600 flex items-center text-sm">
                            <Shield size={14} className="mr-1" /> Verified
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-lg">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Card (unchanged) */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>My Addresses</CardTitle>
                <Button variant="outline" size="sm">
                  <MapPin size={16} className="mr-2" /> Manage Addresses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* ... existing address tab content ... */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and profile picture
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile preview"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="profilePic" className="flex items-center cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    Change Photo
                    <Input
                      id="profilePic"
                      name="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </Label>
                  {formData.profilePic && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 mt-2"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, profilePic: null }));
                        setPreviewImage(user.profilePic || "");
                      }}
                    >
                      <X size={14} className="mr-1" /> Remove
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      disabled={user.emailVerified}
                    />
                    {user.emailVerified && (
                      <span className="text-green-600 flex items-center text-sm">
                        <Shield size={14} className="mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  {user.emailVerified && (
                    <p className="text-xs text-gray-500">
                      Verified email cannot be changed
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check size={16} className="mr-2" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;