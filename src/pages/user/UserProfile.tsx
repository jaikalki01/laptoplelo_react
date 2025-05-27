
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  User, 
  Mail, 
  MapPin, 
  Shield,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserSidebar from "./UserSidebar";

const UserProfile = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/user/profile/edit')}>
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
                    {/* <div>
                      <h3 className="text-sm font-medium text-gray-500">KYC Status</h3>
                      <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                        user.kycVerified 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.kycVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div> */}
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
                  {user.addresses.find(addr => addr.isDefault) ? (
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
                    {user.addresses.map((address) => (
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
