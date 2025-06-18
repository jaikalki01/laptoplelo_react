import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  User, 
  Mail, 
  MapPin, 
  Shield,
  Edit,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import UserSidebar from "./UserSidebar";
import { useState } from "react";
const UserProfile = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call your API to update user
      await updateUser(editForm);
      toast({
        title: "Profile updated successfully",
        variant: "default",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">My Profile</CardTitle>
                
                {/* Edit Profile Dialog */}
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                           // Typically emails shouldn't be changed
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save changes</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
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

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>My Addresses</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/user/address')}>
                  <MapPin size={16} className="mr-2" /> Manage Addresses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="default" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="default">Default Address</TabsTrigger>
                  <TabsTrigger value="all">All Addresses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="default">
                  {user.addresses?.find(addr => addr.isDefault) ? (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="font-medium">{user.name}</p>
                      <p>{user.addresses.find(addr => addr.isDefault)?.street}</p>
                      <p>
                        {user.addresses.find(addr => addr.isDefault)?.city}, {user.addresses.find(addr => addr.isDefault)?.state} - {user.addresses.find(addr => addr.isDefault)?.pincode}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No default address set. Please add an address.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses?.map((address) => (
                      <div 
                        key={address.id} 
                        className={`p-4 rounded-lg border ${address.isDefault ? 'bg-gray-50 border-primary' : ''}`}
                      >
                        {address.isDefault && (
                          <span className="text-xs text-primary font-medium mb-2 block">Default Address</span>
                        )}
                        <p className="font-medium">{user.name}</p>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;