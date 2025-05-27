
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  FileText,
  Clock,
  ChevronRight,
  LogOut,
  Plus,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState("profile");

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSavePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully",
    });
  };

  const handleAddAddress = () => {
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully",
    });
  };

  const handleSubmitKYC = () => {
    toast({
      title: "KYC Submitted",
      description: "Your KYC documents have been submitted for verification",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mb-4">
                  <User className="h-10 w-10" />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <button
                  className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-md ${
                    activeTab === "profile"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    <span>My Profile</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-md ${
                    activeTab === "password"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("password")}
                >
                  <span className="flex items-center">
                    <Lock className="h-5 w-5 mr-3" />
                    <span>Change Password</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-md ${
                    activeTab === "address"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-3" />
                    <span>Address & KYC</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-md ${
                    activeTab === "orders"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>Purchase History</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile">
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={user.name.split(" ")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={user.name.split(" ")[1] || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+91 98765 43210" />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="password">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSavePassword}
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="address">
                <CardHeader>
                  <CardTitle>Address & KYC</CardTitle>
                  <CardDescription>
                    Manage your addresses and KYC documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="addresses">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="addresses">Addresses</TabsTrigger>
                      <TabsTrigger value="kyc">KYC Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="addresses" className="pt-6">
                      <div className="space-y-4">
                        {user.addresses.map((address, index) => (
                          <div
                            key={address.id}
                            className="border rounded-lg p-4 relative"
                          >
                            {address.isDefault && (
                              <span className="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                            <p className="font-medium">
                              {user.name} - Address {index + 1}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.street}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <div className="flex mt-2 space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              {!address.isDefault && (
                                <Button variant="outline" size="sm">
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center"
                          onClick={handleAddAddress}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="kyc" className="pt-6">
                      <div className="space-y-6">
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                          <p className="font-medium">KYC Status</p>
                          <p className="text-sm">
                            {user.kycVerified
                              ? "Your KYC verification is complete."
                              : "Your KYC verification is pending. Please submit the required documents."}
                          </p>
                        </div>

                        {!user.kycVerified && (
                          <form className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="idType">ID Type</Label>
                              <select
                                id="idType"
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="">Select ID Type</option>
                                <option value="aadhar">Aadhar Card</option>
                                <option value="pan">PAN Card</option>
                                <option value="passport">Passport</option>
                                <option value="driving">
                                  Driving License
                                </option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="idNumber">ID Number</Label>
                              <Input id="idNumber" placeholder="Enter ID Number" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="idFront">
                                Upload Front Side
                              </Label>
                              <Input id="idFront" type="file" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="idBack">Upload Back Side</Label>
                              <Input id="idBack" type="file" />
                            </div>
                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={handleSubmitKYC}
                            >
                              Submit KYC
                            </Button>
                          </form>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </TabsContent>

              <TabsContent value="orders">
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>
                    View your previous orders and rentals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="purchases">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="purchases">Purchases</TabsTrigger>
                      <TabsTrigger value="rentals">Rentals</TabsTrigger>
                    </TabsList>
                    <TabsContent value="purchases" className="pt-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #12345</p>
                              <p className="text-xs text-gray-500">
                                April 10, 2023
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Delivered
                            </span>
                          </div>
                          <div className="p-4 flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-100 rounded">
                              <img
                                src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Dell XPS 13"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Dell XPS 13</p>
                              <p className="text-sm text-gray-600">
                                Qty: 1 × ₹89,999
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #12346</p>
                              <p className="text-xs text-gray-500">
                                March 25, 2023
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Delivered
                            </span>
                          </div>
                          <div className="p-4 flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-100 rounded">
                              <img
                                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Acer Swift 5"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Acer Swift 5</p>
                              <p className="text-sm text-gray-600">
                                Qty: 1 × ₹79,999
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="rentals" className="pt-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Rental #78901</p>
                              <p className="text-xs text-gray-500">
                                April 15, 2023 - May 15, 2023
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Active
                            </span>
                          </div>
                          <div className="p-4 flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-100 rounded">
                              <img
                                src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Lenovo ThinkPad X1"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Lenovo ThinkPad X1</p>
                              <p className="text-sm text-gray-600">
                                1 month × ₹5,999
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Rental #78902</p>
                              <p className="text-xs text-gray-500">
                                March 1, 2023 - March 31, 2023
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Completed
                            </span>
                          </div>
                          <div className="p-4 flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-100 rounded">
                              <img
                                src="https://images.unsplash.com/photo-1544099858-75feeb57f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="HP Spectre x360"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">HP Spectre x360</p>
                              <p className="text-sm text-gray-600">
                                1 month × ₹6,499
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

