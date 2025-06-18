import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  Shield, 
  Upload, 
  Check, 
  Clock, 
  AlertCircle,
  Trash2,
  Info,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import UserSidebar from "./UserSidebar";

const UserKYC = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [kycStatus, setKycStatus] = useState(
    user?.kycVerified ? "verified" : "unverified"
  );
  
  const [kycForm, setKycForm] = useState({
    documentType: "",
    documentNumber: "",
    frontImage: null as File | null,
    backImage: null as File | null,
    frontPreview: "",
    backPreview: "",
    processing: false
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKycForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocTypeChange = (value: string) => {
    setKycForm(prev => ({
      ...prev,
      documentType: value
    }));
  };

  const handleFileChange = (side: 'front' | 'back', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or PDF file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setKycForm(prev => ({
          ...prev,
          [`${side}Image`]: file,
          [`${side}Preview`]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setKycForm(prev => ({
        ...prev,
        [`${side}Image`]: file,
        [`${side}Preview`]: "" // No preview for PDFs
      }));
    }

    toast({
      title: "File uploaded",
      description: `Document ${side} side uploaded successfully`,
    });
  };

  const handleRemoveFile = (side: 'front' | 'back') => {
    setKycForm(prev => ({
      ...prev,
      [`${side}Image`]: null,
      [`${side}Preview`]: ""
    }));
    
    // Reset file input
    if (side === 'front' && frontInputRef.current) {
      frontInputRef.current.value = "";
    }
    if (side === 'back' && backInputRef.current) {
      backInputRef.current.value = "";
    }
    
    toast({
      title: "File removed",
      description: `Document ${side} side removed`,
    });
  };

  const handleSubmitKYC = () => {
    // Validation
    if (!kycForm.documentType || !kycForm.documentNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!kycForm.frontImage || (kycForm.documentType !== 'passport' && !kycForm.backImage)) {
      toast({
        title: "Error",
        description: "Please upload all required document images",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the KYC documents for verification
    setKycForm(prev => ({
      ...prev,
      processing: true
    }));
    
    setKycStatus("pending");
    
    toast({
      title: "KYC submitted",
      description: "Your KYC documents have been submitted for verification",
    });
    
    // Simulate KYC verification process (would be done by admin in real app)
    setTimeout(() => {
      updateUser({
        ...user,
        kycVerified: true
      });
      
      setKycStatus("verified");
      
      toast({
        title: "KYC verified",
        description: "Your KYC documents have been verified successfully",
      });
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <UserSidebar />
        
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="mr-2" /> KYC Verification
              </CardTitle>
              <CardDescription>
                Verify your identity to access all features of our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {kycStatus === "verified" ? (
                <div className="text-center py-8 border rounded-lg bg-green-50">
                  <Check className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium">KYC Verified</h3>
                  <p className="mt-1 text-gray-500">
                    Your identity has been verified successfully
                  </p>
                </div>
              ) : kycStatus === "pending" ? (
                <div className="text-center py-8 border rounded-lg bg-yellow-50">
                  <Clock className="mx-auto h-12 w-12 text-yellow-500" />
                  <h3 className="mt-2 text-lg font-medium">Verification in Progress</h3>
                  <p className="mt-1 text-gray-500">
                    Your documents are being verified. This may take 24-48 hours.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800">Why verify your identity?</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        KYC verification is required to rent or purchase laptops on our platform. 
                        This helps us maintain security and prevent fraud.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="documentType">ID Document Type</Label>
                      <Select 
                        onValueChange={handleDocTypeChange}
                        value={kycForm.documentType}
                      >
                        <SelectTrigger id="documentType">
                          <SelectValue placeholder="Select ID document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driving">Driving License</SelectItem>
                          <SelectItem value="voter">Voter ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="documentNumber">
                        Document Number
                      </Label>
                      <Input 
                        id="documentNumber" 
                        name="documentNumber" 
                        value={kycForm.documentNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your document number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Document Front Side</Label>
                      <div className="border rounded-lg p-4">
                        {kycForm.frontImage ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-green-600">
                                <Check size={16} className="mr-1" />
                                <span>Document front side uploaded</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleRemoveFile('front')}
                              >
                                <Trash2 size={16} className="mr-1" /> Remove
                              </Button>
                            </div>
                            {kycForm.frontPreview && (
                              <div className="mt-2 border rounded-md overflow-hidden">
                                <img 
                                  src={kycForm.frontPreview} 
                                  alt="Document front preview" 
                                  className="w-full h-auto max-h-40 object-contain"
                                />
                              </div>
                            )}
                            {!kycForm.frontPreview && (
                              <div className="flex items-center gap-2 mt-2 text-gray-500">
                                <Image size={16} />
                                <span>{kycForm.frontImage.name}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">
                              Supported formats: JPEG, PNG, PDF (Max 5MB)
                            </p>
                            <input
                              type="file"
                              ref={frontInputRef}
                              onChange={(e) => handleFileChange('front', e)}
                              accept="image/jpeg,image/png,application/pdf"
                              className="hidden"
                              id="front-upload"
                            />
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => frontInputRef.current?.click()}
                            >
                              Select File
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {kycForm.documentType !== 'passport' && (
                      <div className="space-y-2">
                        <Label>Upload Document Back Side</Label>
                        <div className="border rounded-lg p-4">
                          {kycForm.backImage ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-green-600">
                                  <Check size={16} className="mr-1" />
                                  <span>Document back side uploaded</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleRemoveFile('back')}
                                >
                                  <Trash2 size={16} className="mr-1" /> Remove
                                </Button>
                              </div>
                              {kycForm.backPreview && (
                                <div className="mt-2 border rounded-md overflow-hidden">
                                  <img 
                                    src={kycForm.backPreview} 
                                    alt="Document back preview" 
                                    className="w-full h-auto max-h-40 object-contain"
                                  />
                                </div>
                              )}
                              {!kycForm.backPreview && (
                                <div className="flex items-center gap-2 mt-2 text-gray-500">
                                  <Image size={16} />
                                  <span>{kycForm.backImage.name}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-400">
                                Supported formats: JPEG, PNG, PDF (Max 5MB)
                              </p>
                              <input
                                type="file"
                                ref={backInputRef}
                                onChange={(e) => handleFileChange('back', e)}
                                accept="image/jpeg,image/png,application/pdf"
                                className="hidden"
                                id="back-upload"
                              />
                              <Button 
                                variant="outline" 
                                className="mt-4"
                                onClick={() => backInputRef.current?.click()}
                              >
                                Select File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full md:w-auto"
                        onClick={handleSubmitKYC}
                        disabled={kycForm.processing}
                      >
                        {kycForm.processing ? (
                          "Processing..."
                        ) : (
                          <>
                            <Shield size={16} className="mr-2" /> Submit for Verification
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification FAQ</CardTitle>
              <CardDescription>Common questions about our verification process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">What is KYC verification?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    KYC (Know Your Customer) is a process to verify the identity of our users. 
                    This helps us maintain security and prevent fraud on our platform.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Why do I need to verify my identity?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Identity verification is required to rent or purchase laptops on our platform. 
                    This ensures that the person using our service is who they claim to be.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">How long does verification take?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    The verification process typically takes 24-48 hours. You will be notified once 
                    your verification is complete.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Is my data secure?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Yes, all your personal information and documents are encrypted and stored securely. 
                    We follow strict data protection protocols to ensure your privacy.
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

export default UserKYC;