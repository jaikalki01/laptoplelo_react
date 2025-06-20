import { useState, useEffect } from "react";
import { AiOutlineDesktop } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Search, Menu, X, User, LogIn,
  LogOut, Store
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "./wishlistprovider";
import { BASE_URL } from "../../routes";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    wishlist,
    user,
    logout,
    isAuthenticated,
    searchProducts
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    console.log(BASE_URL)
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

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

          {/* Search bar - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center w-1/3 relative"
          >
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
              className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-[#9b87f5] text-white font-bold tracking-wider uppercase rounded-md shadow-lg transition-transform transform hover:scale-105 duration-300 overflow-hidden text-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-30 blur-md animate-pulse"></span>
              <AiOutlineDesktop className="mr-2 z-10 text-sm" />
              <span className="z-10">Build Your PC</span>
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
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

          {/* Mobile menu */}
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

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search laptops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                      <Button type="submit" size="icon" variant="ghost">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </form>

                  {/* Navigation Links */}
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <SheetClose key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="block py-2 text-lg hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Auth & Wishlist Links */}
                  <div className="mt-auto space-y-4">
                    <SheetClose asChild>
                      <Link
                        to="/wishlist"
                        className="flex items-center justify-between py-2"
                      >
                        <span className="flex items-center">
                          <Heart className="h-5 w-5 mr-2" /> Wishlist
                        </span>
                        {wishlist.length > 0 && (
                          <Badge className="bg-primary">{wishlist.length}</Badge>
                        )}
                      </Link>
                    </SheetClose>
                    {isAuthenticated ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to={user?.role === 'admin' ? '/admin' : '/profile'}
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
