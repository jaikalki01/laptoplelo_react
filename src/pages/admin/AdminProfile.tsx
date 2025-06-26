import { useEffect, useState } from "react";
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
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    name: "",
    email: "",
    phone: "",
    role: "admin",
    joined: "April 15, 2023",
    lastActive: "Today, 9:32 AM",
  });

  // Redirect if user is not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Sync user data to form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "admin",
        joined: "April 15, 2023",
        lastActive: "Today, 9:32 AM",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });

    setIsEditing(false);
  };

  if (!user) return <div className="p-6">Loading...</div>;

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
                  {/* Full Name */}
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

                  {/* Email */}
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

                  {/* Phone */}
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

                  {/* Role */}
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center">
                      <Shield className="mr-2 text-gray-500" size={18} />
                      <span className="capitalize">{formData.role}</span>
                    </div>
                  </div>

                  {/* Joined */}
                  <div className="space-y-2">
                    <Label>Joined Date</Label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={18} />
                      <span>{formData.joined}</span>
                    </div>
                  </div>

                  {/* Last Active */}
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
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
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
                {user?.profilePic ? (
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

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions in the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Updated product listing", item: "Dell XPS 13", time: "Today, 9:32 AM" },
                  { action: "Approved user KYC", item: "Jane Smith", time: "Yesterday, 4:15 PM" },
                  { action: "Created new coupon", item: "SUMMER25", time: "Apr 16, 2024, 11:20 AM" },
                  { action: "Marked order as complete", item: "Order #1234", time: "Apr 15, 2024, 2:45 PM" },
                  { action: "Added new product", item: "HP Spectre x360", time: "Apr 14, 2024, 10:30 AM" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{activity.item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminDashboard>
  );
};

export default AdminProfile;
