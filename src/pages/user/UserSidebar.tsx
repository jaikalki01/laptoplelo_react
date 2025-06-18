
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  User,
  MapPin,
  Shield,
  Lock,
  ShoppingBag
} from "lucide-react";
import { Card } from "@/components/ui/card";

const UserSidebar = () => {
  const { user } = useApp();
  const location = useLocation();
  
  const menuItems = [
    {
      name: "My Profile",
      icon: <User size={18} />,
      path: "/user/profile",
    },
    {
      name: "My Addresses",
      icon: <MapPin size={18} />,
      path: "/user/address",
    },
    {
      name: "KYC Verification",
      icon: <Shield size={18} />,
      path: "/user/kyc",
    },
    {
      name: "Change Password",
      icon: <Lock size={18} />,
      path: "/user/password",
    },
    {
      name: "Purchase History",
      icon: <ShoppingBag size={18} />,
      path: "/user/purchases",
    },
  ];

  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <Card className="overflow-hidden">
        <div className="p-6 bg-primary text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
              {user?.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt={user?.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User size={32} />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm opacity-90">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 hover:bg-gray-100 transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserSidebar;
