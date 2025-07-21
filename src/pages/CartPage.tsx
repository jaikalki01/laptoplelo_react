import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "../components/layout/cartprovider";
import { BASE_URL } from "@/routes";

interface CartItem {
  id?: number;
  product_id: number;
  quantity: number;
  rental_duration?: number;
  type: "sale" | "rent" | "both";
  product?: {
    id: number;
    name: string;
    brand: string;
    price: number;
    rental_price?: number;
    type: "sale" | "rent" | "both";
    image: string;
  };
  // For localStorage items
  name?: string;
  price?: number;
  rental_price?: number;
  image?: string;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const calculateTotals = () => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      if (!item) return sum;
      
      if (item.product) {
        const price = item.type === 'rent' 
          ? (item.product.rental_price || 0) * (item.rental_duration || 1)
          : item.product.price;
        return sum + (price * item.quantity);
      }
      
      const price = item.type === 'rent'
        ? (item.rental_price || 0) * (item.rental_duration || 1)
        : (item.price || 0);
      return sum + (price * item.quantity);
    }, 0);

    const calculatedTax = calculatedSubtotal * 0.18;
    const calculatedShipping = calculatedSubtotal > 10000 ? 0 : 500;
    const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping;
    
    return {
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      shipping: calculatedShipping,
      total: calculatedTotal,
      finalTotal: Math.max(0, calculatedTotal - discount)
    };
  };

  const { subtotal, tax, shipping, total, finalTotal } = calculateTotals();

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
        return;
      }

      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/cart/`, { headers });
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error instanceof Error && error.message === 'No authentication token found') {
        navigate('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated]);

  const updateCartQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setIsLoading(true);
      const item = cartItems.find(i => i.id === itemId || i.product_id === itemId);
      if (!item) return;

      if (!isAuthenticated) {
        const updatedCart = cartItems.map(i => 
          (i.product_id === item.product_id) ? { ...i, quantity: newQuantity } : i
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        return;
      }

      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/cart/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: newQuantity,
          type: item.type,
          rental_duration: item.rental_duration
        }),
      });

      if (!response.ok) throw new Error('Failed to update cart');
      await fetchCartItems();
      fetchCartCount();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      const item = cartItems.find(i => i.id === itemId || i.product_id === itemId);
      if (!item) return;

      if (!isAuthenticated) {
        const updatedCart = cartItems.filter(i => i.product_id !== item.product_id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        fetchCartCount();
        return;
      }

      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/cart/remove`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          product_id: item.product_id,
          type: item.type
        }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      await fetchCartItems();
      fetchCartCount();
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/coupon/${couponCode}?total=${subtotal}`, {
        headers
      });
      if (!response.ok) throw new Error('Invalid or expired coupon');

      const couponData = await response.json();
      const discountAmount = couponData.discount_type === 'percentage'
        ? (subtotal * couponData.discount_value) / 100
        : couponData.discount_value;

      setDiscount(discountAmount);
      setError('');
      toast({
        title: "Coupon Applied",
        description: `Discount of ₹${discountAmount.toLocaleString()} applied`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid coupon');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to continue with checkout',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      toast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your order!',
      });
      navigate('/orders');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/products">
          <Button className="bg-primary hover:bg-primary/90">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id || item.product_id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-32 bg-gray-100">
                    <img
                      src={`${BASE_URL}${item.product?.image || item.image}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/default-product-image.png";
                      }}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {item.product?.name || item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.product?.brand || ''}
                        </p>
                        <p className="font-medium">
                          {item.type === "rent"
                            ? `₹${(item.product?.rental_price || item.rental_price || 0).toLocaleString()}/mo`
                            : `₹${(item.product?.price || item.price || 0).toLocaleString()}`}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded border text-sm font-medium text-muted-foreground bg-muted">
                              {item.quantity} item{item.quantity > 1 ? 's' : ''} {item.type === 'rent' ? 'For Rent' : item.type === 'sale' ? 'For Sale' : 'For Both'}
                            </span>
                            {item.type === 'sale' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateCartQuantity(item.id || item.product_id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  –
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateCartQuantity(item.id || item.product_id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id || item.product_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <Button
                    onClick={applyCoupon}
                    variant="outline"
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Applied ({couponCode})</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{discount > 0 ? "Final Total" : "Total"}</span>
                  <span>
                    ₹{(discount > 0 ? finalTotal : total).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;