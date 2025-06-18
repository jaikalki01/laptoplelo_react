import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  User,
  Edit,
  X,
  Check,
  Upload,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/routes";

const EditProfile = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: null as File | null
  });
  
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePic: null
      });
      if (user.profilePic) {
        setPreviewImage(user.profilePic);
      }
    }
  }, [user]);

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
      
      // Create preview URL
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
      if (!token) throw new Error("Authentication token missing");
      
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      if (formData.profilePic) {
        formPayload.append("profilePic", formData.profilePic);
      }

      const response = await fetch(`${BASE_URL}/users/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formPayload
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      
      // Update user context
      setUser({
        ...user,
        ...data.user,
        profilePic: data.user.profilePic || user?.profilePic
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      navigate("/user/profile");
      
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/user/profile")}
              >
                <X size={16} className="mr-2" /> Cancel
              </Button>
            </div>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          setPreviewImage(user?.profilePic || "");
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
                        disabled={user?.emailVerified}
                      />
                      {user?.emailVerified && (
                        <span className="text-green-600 flex items-center text-sm">
                          <Shield size={14} className="mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    {user?.emailVerified && (
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
                  
                  <div className="pt-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;