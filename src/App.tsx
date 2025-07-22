
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/components/layout/MainLayout";

// Pages
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import LoginPage from "@/components/auth/LoginPage";
import SignupPage from "@/components/auth/SignupPage";
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"

import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import CouponManagement from "@/pages/admin/CouponManagement";
import OfferManagement from "@/pages/admin/OfferManagement";
import TransactionManagement from "@/pages/admin/TransactionManagement";
import RentManagement from "@/pages/admin/RentManagement";
import ReportsPage from "@/pages/admin/ReportsPage";
import Analytics from "@/pages/admin/Analytics";
import AdminProfile from "@/pages/admin/AdminProfile";
import AdminSettings from "@/pages/admin/AdminSettings";
import Orders from "@/pages/admin/Orders";
import UserProfile from "@/pages/user/UserProfile";
import UserAddress from "@/pages/user/UserAddress";
import UserKYC from "@/pages/user/UserKYC";
import UserPassword from "@/pages/user/UserPassword";
import UserPurchaseHistory from "@/pages/user/UserPurchaseHistory";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";
import Adminaddproduct from "./pages/admin/Adminaddproduct";
import EditProductPage from "./pages/admin/EditProductPage"
import BuildyourPc from "./pages/BuildyourPC";
import AboutUs from "./pages/AboutUs";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy ";
import TermsAndConditions from "./pages/TermsAndConditions ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ScrollToTop from "./pages/ScrollToTop";
import { WishlistProvider } from "./components/layout/wishlistprovider";
import { CartProvider } from "./components/layout/cartprovider";
import ContactList from "./pages/admin/ContactList";
import BuildYourPC from '../src/pages/admin/BuildYourPC';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <MainLayout>
                        <HomePage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/aboutus"
                    element={
                      <MainLayout>
                        <AboutUs />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/refund-policy"
                    element={
                      <MainLayout>
                        <RefundPolicy />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/shipping-policy"
                    element={
                      <MainLayout>
                        <ShippingPolicy />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/terms-conditions"
                    element={
                      <MainLayout>
                        <TermsAndConditions />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/privacy-policy"
                    element={
                      <MainLayout>
                        <PrivacyPolicy />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/buildyourpc"
                    element={
                      <MainLayout>
                        <BuildyourPc />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <MainLayout>
                        <ProductsPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/products/:type"
                    element={
                      <MainLayout>
                        <ProductsPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <MainLayout>
                        <ProductDetailPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <MainLayout>
                        <CartPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <MainLayout>
                        <WishlistPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <MainLayout>
                        <LoginPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <MainLayout>
                        <SignupPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <MainLayout>
                        <ForgotPassword />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <MainLayout>
                        <ResetPassword />
                      </MainLayout>
                    }
                  />
                

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/contacts" element={<ContactList />} />
                  <Route path="/admin/add-product" element={<Adminaddproduct />} />
                  <Route path="/admin/coupons" element={<CouponManagement />} />
                  <Route path="/admin/offers" element={<OfferManagement />} />
                  <Route path="/admin/transactions" element={<TransactionManagement />} />
                  <Route path="/admin/rentals" element={<RentManagement />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/buildpc" element={<BuildYourPC />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/edit-product/:productId" element={<EditProductPage />} />
                  <Route path="/admin/" element={<AdminDashboard />} />
                  {/* User Routes */}
                  <Route
                    path="/user/profile"
                    element={
                      <MainLayout>
                        <UserProfile />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/user/address"
                    element={
                      <MainLayout>
                        <UserAddress />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/user/kyc"
                    element={
                      <MainLayout>
                        <UserKYC />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/user/password"
                    element={
                      <MainLayout>
                        <UserPassword />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/user/purchases"
                    element={
                      <MainLayout>
                        <UserPurchaseHistory />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <MainLayout>
                        <ContactPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <MainLayout>
                        <NotFound />
                      </MainLayout>
                    }
                  />
                </Routes>
              </ScrollToTop>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
