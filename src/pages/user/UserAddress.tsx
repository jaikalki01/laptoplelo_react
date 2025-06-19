import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  Plus,
  Check,
  Trash2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import UserSidebar from "./UserSidebar";
import { BASE_URL } from "@/routes";

const UserAddress = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [addressForm, setAddressForm] = useState({
    id: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const fetchUserAddresses = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/users/${user.id}/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const apiAddresses = Array.isArray(data) ? data : [];

    const transformedAddresses = apiAddresses.map(addr => ({
      id: addr.id?.toString() || Date.now().toString(),
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: Boolean(addr.is_default)
    }));

    updateUser({
      ...user,
      addresses: transformedAddresses
    });

  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch addresses",
      variant: "destructive"
    });

    updateUser({
      ...user,
      addresses: []
    });
  }
};


  const resetAddressForm = () => {
    setAddressForm({
      id: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false
    });
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm(prev => ({
      ...prev,
      isDefault: e.target.checked
    }));
  };

  const handleEditAddress = (address: any) => {
    setAddressForm(address);
    setEditMode(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/users/${user.id}/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to delete address");

    await fetchUserAddresses();

    toast({
      title: "Address deleted",
      description: "Your address has been deleted successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete address",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleSetDefaultAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}/addresses/${addressId}/set_default`, {
        method: "PATCH"
      });

      if (!response.ok) throw new Error("Failed to set default address");

      await fetchUserAddresses();

      toast({
        title: "Default address updated",
        description: "Your default address has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

 const handleSaveAddress = async () => {
  if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");

    const addressData = {
      street: addressForm.street,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      is_default: addressForm.isDefault
    };

    let response;
    if (editMode) {
      response = await fetch(`${BASE_URL}/users/addresses/${addressForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
    } else {
      response = await fetch(`${BASE_URL}/users/${user.id}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
    }

    if (!response.ok) throw new Error(editMode ? "Failed to update address" : "Failed to add address");

    await fetchUserAddresses();

    toast({
      title: editMode ? "Address updated" : "Address added",
      description: editMode
        ? "Your address has been updated successfully"
        : "Your address has been added successfully",
    });

    resetAddressForm();
  } catch (error) {
    toast({
      title: "Error",
      description: editMode ? "Failed to update address" : "Failed to add address",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
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
                <CardTitle className="text-2xl flex items-center">
                  <MapPin className="mr-2" /> My Addresses
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={resetAddressForm}>
                      <Plus size={16} className="mr-2" /> Add New Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new delivery address.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          name="street"
                          value={addressForm.street}
                          onChange={handleInputChange}
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={addressForm.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={addressForm.state}
                            onChange={handleInputChange}
                            placeholder="Enter your state"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleInputChange}
                          placeholder="Enter your PIN code"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="isDefault" className="font-normal">
                          Set as default address
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleSaveAddress}>Save Address</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Manage your delivery addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No addresses found</h3>
                  <p className="mt-1 text-gray-500">Add a new address to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`p-4 rounded-lg border ${address.isDefault ? 'bg-primary/10 border-primary' : ''}`}
                    >
                      {address.isDefault && (
                        <div className="flex items-center mb-2 text-primary">
                          <Check size={16} className="mr-1" />
                          <span className="text-xs font-medium">Default Address</span>
                        </div>
                      )}
                      <p className="font-medium">{user.name}</p>
                      <p className="mt-1">{address.street}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      
                      <div className="flex mt-4 space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit size={14} className="mr-1" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Address</DialogTitle>
                              <DialogDescription>
                                Update your delivery address information.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input 
                                  id="street" 
                                  name="street" 
                                  value={addressForm.street}
                                  onChange={handleInputChange}
                                  placeholder="Enter your street address"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="city">City</Label>
                                  <Input 
                                    id="city" 
                                    name="city" 
                                    value={addressForm.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter your city"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="state">State</Label>
                                  <Input 
                                    id="state" 
                                    name="state" 
                                    value={addressForm.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter your state"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="pincode">PIN Code</Label>
                                <Input 
                                  id="pincode" 
                                  name="pincode" 
                                  value={addressForm.pincode}
                                  onChange={handleInputChange}
                                  placeholder="Enter your PIN code"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="isDefault"
                                  name="isDefault"
                                  checked={addressForm.isDefault}
                                  onChange={handleCheckboxChange}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="isDefault" className="font-normal">
                                  Set as default address
                                </Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleSaveAddress}>Save Changes</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserAddress;
