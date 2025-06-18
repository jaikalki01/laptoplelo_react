import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Lock, 
  Shield, 
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import UserSidebar from "./UserSidebar";
import { BASE_URL } from "@/routes";

const UserPassword = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length >= 8
    if (password.length >= 8) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return false;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return false;
    }
    
    if (passwordStrength < 3) {
      toast({
        title: "Error",
        description: "Please use a stronger password (include uppercase, lowercase, numbers, or symbols)",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");
      
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }
      
      // Success
      toast({
        title: "Success",
        description: "Password updated successfully! Please login again.",
        action: (
          <Button variant="ghost" onClick={() => {
            logout();
            navigate('/login');
          }}>
            Login
          </Button>
        )
      });
      
      setPasswordChanged(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lock className="mr-2" /> Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordChanged ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Password Changed Successfully!</h3>
                  <p className="text-gray-500 mb-6">
                    Your password has been updated. Please login again with your new password.
                  </p>
                  <Button onClick={() => {
                    logout();
                    navigate('/login');
                  }}>
                    Go to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} className="text-gray-500" />
                          ) : (
                            <Eye size={16} className="text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff size={16} className="text-gray-500" />
                          ) : (
                            <Eye size={16} className="text-gray-500" />
                          )}
                        </Button>
                      </div>
                      
                      {passwordForm.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Password strength:</span>
                            <span className="text-xs font-medium">
                              {passwordStrength === 0 && "Very Weak"}
                              {passwordStrength === 1 && "Weak"}
                              {passwordStrength === 2 && "Fair"}
                              {passwordStrength === 3 && "Good"}
                              {passwordStrength === 4 && "Strong"}
                              {passwordStrength === 5 && "Very Strong"}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                passwordStrength === 0 ? 'bg-red-500 w-[10%]' :
                                passwordStrength === 1 ? 'bg-red-500 w-[20%]' :
                                passwordStrength === 2 ? 'bg-yellow-500 w-[40%]' :
                                passwordStrength === 3 ? 'bg-yellow-500 w-[60%]' :
                                passwordStrength === 4 ? 'bg-green-500 w-[80%]' :
                                'bg-green-500 w-full'
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} className="text-gray-500" />
                          ) : (
                            <Eye size={16} className="text-gray-500" />
                          )}
                        </Button>
                      </div>
                      
                      {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Passwords don't match
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Updating..."
                    ) : (
                      <>
                        <Lock size={16} className="mr-2" /> Update Password
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> Security Tips
              </CardTitle>
              <CardDescription>Keep your account secure with these tips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Use a strong, unique password</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a password that's at least 12 characters long with a mix of letters, numbers, and symbols.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Don't reuse passwords</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Use different passwords for different accounts to prevent security breaches.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Consider a password manager</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Password managers can generate and store strong, unique passwords for all your accounts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;