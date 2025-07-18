import { useState, useEffect } from "react";
import { AiOutlineDesktop } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, Search, Menu, X, User, LogIn,
  LogOut, Phone, Store
} from "lucide-react";

import { useAuth } from "@/context/AuthContext"; // ✅ Correct context
import { useWishlist } from "./wishlistprovider";
import { useCart } from "./cartprovider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "../../routes";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ using AuthContext
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const isAuthenticated = !!user;

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Buy Laptops", path: "/products/sale" },
    { name: "Rent Laptops", path: "/products/rent" },
    { name: "Membership", path: "/membership" },
    { name: "Contact Us", path: "/contact" },
  ];
  

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Store className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">MumbaiPcMart</span>
          </Link>

          {/* Search bar */}
          <form className="hidden md:flex items-center w-1/3 relative">
            <Input
              type="text"
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/buildyourpc"
              className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-[#9b87f5] text-white font-bold tracking-wider uppercase rounded-md shadow-lg hover:scale-105 transition-transform text-sm"
            >
              <AiOutlineDesktop className="mr-2 z-10 text-sm" />
              <span className="z-10">Build Your PC</span>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-9 w-5 bg-primary">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-primary">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={user?.role === 'admin' ? '/admin' : '/user/profile'}>
                  <Button style={{ backgroundColor: 'rgb(155, 135, 245)', color: 'white' }}>
                    Profile
                  </Button>
                </Link>
                <Button onClick={logout} style={{ backgroundColor: 'rgb(155, 135, 245)', color: 'white' }}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button style={{ backgroundColor: 'rgb(155, 135, 245)', color: 'white' }}>
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Menu</span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Links */}
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <SheetClose key={item.path} asChild>
                        <Link to={item.path} className="block py-2 text-lg hover:text-primary">
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Mobile Profile/Logout */}
                  <div className="mt-auto space-y-4">
                    {isAuthenticated ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to={user?.role === 'admin' ? '/admin' : '/user/profile'}
                            className="flex items-center py-2"
                          >
                            <User className="h-5 w-5 mr-2" />
                            {user?.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={logout}
                          >
                            <LogOut className="h-5 w-5 mr-2" /> Logout
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            <LogIn className="h-5 w-5 mr-2" /> Login
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
