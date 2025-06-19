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

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  rental_price?: number;
  type: "sale" | "rent";
  image?: string;
}

interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, isAuthenticated } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [error, setError] = useState('');
  const [apiCart, setApiCart] = useState<CartItem[]>([]);
  const { fetchCartCount } = useCart();

  // Calculate totals
  const subtotal = apiCart.reduce(
    (total, item) => total + (
      item.product.type === 'sale' 
        ? item.product.price 
        : item.product.rental_price || 0
    ) * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  const applyCoupon = async () => {
    if (!couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/coupon/${couponCode}?total=${total}`);
      if (!response.ok) throw new Error('Invalid or expired coupon');

      const couponData = await response.json();
      const discountAmount = couponData.discount_type === 'percentage'
        ? (total * couponData.discount_value) / 100
        : couponData.discount_value;

      setDiscount(discountAmount);
      setFinalTotal(Math.max(0, total - discountAmount));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply coupon');
    }
  };

  const fetchCartAndProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const cartResponse = await fetch(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartResponse.ok) throw new Error('Failed to fetch cart');

      const cartData: CartItem[] = await cartResponse.json();

      // Fetch product details for each cart item
      const cartWithProducts = await Promise.all(
        cartData.map(async (item) => {
          try {
            const productResponse = await fetch(`${BASE_URL}/products/${item.product_id}`);
            if (!productResponse.ok) throw new Error('Failed to fetch product');
            const productDetails: Product = await productResponse.json();
            return { ...item, product: productDetails };
          } catch (error) {
            console.error(`Error fetching product ${item.product_id}:`, error);
            return null;
          }
        })
      );

      setApiCart(cartWithProducts.filter(Boolean) as CartItem[]);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setApiCart([]);
      toast({
        title: 'Error',
        description: 'Failed to load cart items',
        variant: 'destructive',
      });
    }
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('Not authenticated');

      const item = apiCart.find(i => i.product_id === productId);
      if (!item) throw new Error('Item not found in cart');

      const payload = {
        product_id: productId,
        quantity,
        rental_duration: item.product.type === "rent" ? 30 : 0,
        type: item.product.type,
      };

      const response = await fetch(`${BASE_URL}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update cart");
      
      fetchCartAndProducts();
      fetchCartCount();
    } catch (error) {
      console.error("Update cart error:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('Not authenticated');

      const item = apiCart.find(i => i.product_id === productId);
      if (!item) throw new Error('Item not found in cart');

      const response = await fetch(`${BASE_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          type: item.product.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to remove item");
      
      fetchCartAndProducts();
      fetchCartCount();
      toast({ title: "Item removed from cart" });
    } catch (error) {
      console.error("Remove cart error:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
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
    // In a real app, you would redirect to a checkout page
    setTimeout(() => {
      toast({ title: 'Order Placed Successfully' });
      navigate('/');
    }, 2000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartAndProducts();
    } else {
      setApiCart([]);
    }
  }, [isAuthenticated]);

  if (apiCart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Looks like you haven't added any items to your cart yet.</p>
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
          {apiCart.map((item) => (
            <Card key={item.product.id} className="mb-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-32 h-32 bg-gray-100 flex items-center justify-center">
                  <img
                    src={`${BASE_URL}/static/uploaded_images/product_image_1_${item.product.id}.png`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `${BASE_URL}/static/uploaded_images/default_product.png`;
                    }}
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                      <p className="font-medium">
                        {item.product.type === "rent"
                          ? `₹${item.product.rental_price?.toLocaleString()}/mo`
                          : `₹${item.product.price.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <div className="flex items-center space-x-3">
                        {item.product.type !== "rent" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              –
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded border text-sm font-medium text-muted-foreground bg-muted">
                            {item.quantity} item For Rent
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.product.id)}
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
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
                  variant="outline"
                  onClick={applyCoupon}
                >
                  Apply
                </Button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Applied ({couponCode})</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>{discount > 0 ? "Final Total" : "Total"}</span>
                <span>₹{(discount > 0 ? finalTotal : total).toLocaleString()}</span>
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