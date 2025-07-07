import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Settings, 
  Lock, 
  Bell, 
  Eye,
  EyeOff,
  Loader2,
  Save,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";
const AdminSettings = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    newUsers: true,
    newRentals: true,
    systemAlerts: true,
    emailNotifications: true,
    browserNotifications: false
  });

  // Redirect if not admin
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

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
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

    // Validate inputs
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login again",
        variant: "destructive"
      });
      navigate('/login');
      setIsLoading(false);
      return;
    }
 // place this at top of your file

    try {
    const response = await fetch(`${BASE_URL}/users/change-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
body: JSON.stringify({
  current_password: passwordForm.currentPassword,
  new_password: passwordForm.newPassword
})

});
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('current')}
                            aria-label={showPassword.current ? "Hide password" : "Show password"}
                          >
                            {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('new')}
                            aria-label={showPassword.new ? "Hide password" : "Show password"}
                          >
                            {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Password must be at least 8 characters long and contain a mix of uppercase,
                          lowercase, numbers, and special characters.
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('confirm')}
                            aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                          >
                            {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? "Updating..." : "Update Password"}
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