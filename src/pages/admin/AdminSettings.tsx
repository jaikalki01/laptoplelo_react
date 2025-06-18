import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Settings, 
  Lock, 
  Bell, 
  Mail,
  Shield,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const AdminSettings = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    newUsers: true,
    newRentals: true,
    systemAlerts: true,
    emailNotifications: true,
    browserNotifications: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

const changePasswordApi = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  try {
    const response = await fetch(`${BASE_URL}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      navigate("/login");
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Password change failed.");
    }

    return await response.json();
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    // Validate password strength
    if (!validatePassword(passwordForm.newPassword)) {
      throw new Error(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
    }

    // Call API
    await changePasswordApi({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    // Success
    toast({
      title: "Success",
      description: "Password updated successfully!",
    });

    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call
    toast({
      title: "Settings updated",
      description: "Your notification settings have been updated successfully",
    });
  };

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Settings className="mr-2" /> Admin Settings
          </h1>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5" /> Change Password
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Password must be at least 8 characters long and contain a mix of uppercase,
                          lowercase, numbers, and special characters.
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" /> Security Settings
                  </CardTitle>
                  <CardDescription>Configure additional security measures for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Setup 2FA</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login History</h3>
                        <p className="text-sm text-gray-500">View your recent login activities</p>
                      </div>
                      <Button variant="outline">View History</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Session Timeout</h3>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                      <select className="p-2 border rounded-md">
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" /> Notification Preferences
                </CardTitle>
                <CardDescription>Configure which notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                      Activity Notifications
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newOrders" className="font-normal">New Orders</Label>
                          <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                        </div>
                        <Switch
                          id="newOrders"
                          checked={notificationSettings.newOrders}
                          onCheckedChange={() => handleNotificationChange('newOrders')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newUsers" className="font-normal">New User Registrations</Label>
                          <p className="text-sm text-gray-500">Get notified when a new user registers</p>
                        </div>
                        <Switch
                          id="newUsers"
                          checked={notificationSettings.newUsers}
                          onCheckedChange={() => handleNotificationChange('newUsers')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newRentals" className="font-normal">New Rentals</Label>
                          <p className="text-sm text-gray-500">Get notified when a new rental is created</p>
                        </div>
                        <Switch
                          id="newRentals"
                          checked={notificationSettings.newRentals}
                          onCheckedChange={() => handleNotificationChange('newRentals')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemAlerts" className="font-normal">System Alerts</Label>
                          <p className="text-sm text-gray-500">Important system notifications and alerts</p>
                        </div>
                        <Switch
                          id="systemAlerts"
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={() => handleNotificationChange('systemAlerts')}
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mt-6">
                      Notification Channels
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="font-normal">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleNotificationChange('emailNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="browserNotifications" className="font-normal">Browser Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                        </div>
                        <Switch
                          id="browserNotifications"
                          checked={notificationSettings.browserNotifications}
                          onCheckedChange={() => handleNotificationChange('browserNotifications')}
                        />
                      </div>
                    </div>
                    
                    {notificationSettings.emailNotifications && (
                      <div className="pt-4 border-t">
                        <div className="grid gap-2">
                          <Label htmlFor="emailDigestFrequency">Email Digest Frequency</Label>
                          <select 
                            id="emailDigestFrequency" 
                            className="p-2 border rounded-md"
                          >
                            <option value="realtime">Real-time</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboard>
  );
};

export default AdminSettings;