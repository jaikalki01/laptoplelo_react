
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield,
  Edit,
  FileText,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";

const AdminProfile = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: "admin",
    joined: "April 15, 2023",
    lastActive: "Today, 9:32 AM"
  });

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    setIsEditing(false);
  };

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <User className="mr-2" /> Admin Profile
          </h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit size={18} className="mr-2" /> Edit Profile
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="mr-2 text-gray-500" size={18} />
                        <span>{formData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="mr-2 text-gray-500" size={18} />
                        <span>{formData.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="mr-2 text-gray-500" size={18} />
                        <span>{formData.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center">
                      <Shield className="mr-2 text-gray-500" size={18} />
                      <span className="capitalize">{formData.role}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Joined Date</Label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={18} />
                      <span>{formData.joined}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Last Active</Label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={18} />
                      <span>{formData.lastActive}</span>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Your avatar and verification status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
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
              
              <div className="text-center">
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex justify-center items-center mt-2">
                  <Shield className="text-green-500 mr-1" size={16} />
                  <span className="text-sm text-green-500">Admin Account</span>
                </div>
              </div>
              
              {isEditing && (
                <Button variant="outline" className="mt-4 w-full">
                  Upload New Image
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
         
        </div>
      </div>
    </AdminDashboard>
  );
};

export default AdminProfile;
