
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
import { useCart } from "../components/layout/cartprovider"
import { BASE_URL } from "@/routes";


const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, isAuthenticated } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);
  const [error, setError] = useState('');
  const [apicart, setapiCart] = useState([]);
  const { fetchCartCount } = useCart()

  // Calculate the subtotal (without the discount applied yet)
  const subtotal = apicart.reduce(
    (total, item) =>
      total + (item.product.type === 'sale' ? item.product.price : item.product.rental_price || 0) * item.quantity,
    0
  );

  // Calculate tax and shipping
  const tax = subtotal * 0.18; // Assuming 18% GST
  const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0;

  // Default total without discount
  const total = subtotal + tax + shipping;

  // Apply coupon logic
 const applyCoupon = async () => {
  if (!couponCode) {
    setError('Please enter a coupon code');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/coupon/${couponCode}?total=${total}`);
    if (!response.ok) throw new Error('Invalid or expired coupon');

    const couponData = await response.json();

    const discountAmount =
      couponData.discount_type === 'percentage'
        ? (total * couponData.discount_value) / 100
        : couponData.discount_value;

    const final = Math.max(0, total - discountAmount);
    setDiscount(discountAmount);
    setFinalTotal(final);
    setError('');
  } catch (err: any) {
    setError(err.message || 'Failed to apply coupon');
  }
};



  const fetchCartAndProducts = async () => {
    try {
      const token = localStorage.getItem('token');

      const cartResponse = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!cartResponse.ok) throw new Error('Failed to fetch cart');

      const cartData = await cartResponse.json();
      console.log('Raw cart data:', cartData);

      const transformedCart = cartData.map(item => ({
        ...item,
        product: {
          id: item.product_id,
        },
        quantity: item.quantity
      }));

      const cartWithProducts = await Promise.all(
        transformedCart.map(async (item) => {
          try {
            const productResponse = await fetch(`${BASE_URL}/products/${item.product.id}`);
            if (!productResponse.ok) {
              console.error(`Failed to fetch product ${item.product.id}`);
              return null;
            }
            const productDetails = await productResponse.json();
            return {
              ...item,
              product: productDetails
            };
          } catch (error) {
            console.error(`Error fetching product ${item.product.id}:`, error);
            return null;
          }
        })
      );

      const validCartItems = cartWithProducts.filter(item => item !== null);
      setapiCart(validCartItems);
    } catch (err) {
      console.error('Error:', err);
      setapiCart([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartAndProducts();
    } else {
      setapiCart([]);
    }
  }, [isAuthenticated]);



  const updateCartQuantity = async (productId: number, quantity: number) => {
    try {
      const payload = {
        product_id: productId,
        quantity,
        rental_duration: 1, // adjust this as needed
        type: "sale",       // or "rental"        // dynamically get current user id
      };

      const token = localStorage.getItem("token"); // or wherever you store the JWT

      const response = await fetch(`${BASE_URL}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,  // send token in header
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
      fetchCartAndProducts();
      fetchCartCount();

      // optionally refresh cart state here
    } catch (error) {
      console.error("Update cart error:", error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const payload = {
        product_id: productId,
        type: "sale", // or "rental"
      };
      
      const token = localStorage.getItem("token"); // get token from storage

      const response = await fetch(`${BASE_URL}/cart/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,  // send token in header
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      // ✅ Refresh the page after successful removal
      fetchCartAndProducts();
      fetchCartCount();
    } catch (error) {
      console.error("Remove cart error:", error);
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

    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your order!',
      });
      // In a real app, we would redirect to an order confirmation page
      navigate('/');
    }, 2000);
  };


  if (apicart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">
          Looks like you haven't added any laptops to your cart yet.
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
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {apicart.map((item) => (
              <Card key={item.product.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-32 bg-gray-100">
                    <img
                      src={`${BASE_URL}/static/uploaded_images/product_image_1_${item.product.id}.jpg`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = () => {
                          target.onerror = null;
                          target.src = `${BASE_URL}/uploaded_images/product_image_${item.product.id}.jpeg`;
                        };
                        target.src = `${BASE_URL}/static/uploaded_images/product_image_${item.product.id}.png`;
                      }}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
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
                        <p className="text-sm text-gray-500 mb-2">
                          {item.product.brand}
                        </p>
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
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                –
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded border text-sm font-medium text-muted-foreground bg-muted">
                                {item.quantity} item For Rent
                              </span>
                            </div>
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {/* Coupon input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Error message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Coupon Applied Message */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Applied ({couponCode})</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                {/* Final Total */}
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

          <div className="mt-6">
            <h3 className="font-medium mb-3">We Accept</h3>
            <div className="flex space-x-3">
              <div className="p-2 bg-gray-100 rounded">
                <svg
                  viewBox="0 0 38 24"
                  className="h-6 w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"
                    fill="#000"
                    opacity=".07"
                  ></path>
                  <path
                    d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M15 19c1.8 0 3.3-1.5 3.3-3.3V12h8.8c.5 0 .9-.4.9-.9V9.1c0-.5-.4-.9-.9-.9h-8.8V3.3C18.3 1.5 16.8 0 15 0c-1.8 0-3.3 1.5-3.3 3.3v12.4c0 1.8 1.5 3.3 3.3 3.3Z"
                    fill="#4F6DE7"
                  ></path>
                </svg>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <svg
                  viewBox="0 0 38 24"
                  className="h-6 w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"
                    fill="#000"
                    opacity=".07"
                  ></path>
                  <path
                    d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M21.382 9.713c0 1.668-1.177 2.858-2.988 2.858h-1.826V6.854h1.826c1.811 0 2.988 1.19 2.988 2.86ZM20.342 9.713c0-.969-.686-1.64-1.674-1.64h-.947v3.28h.947c.988 0 1.674-.683 1.674-1.64Z"
                    fill="#000"
                  ></path>
                  <path
                    d="M22.57 12.572h-.877V6.854h.877v5.718ZM23.985 12.572v-5.36h-1.285V6.854h3.446v.358h-1.284v5.36h-.877ZM27.264 12.572v-2.888c0-.242.016-.484.032-.727l-.82.043-.031.042-1.129 3.53h-.84L23.363 9c-.016-.042-.016-.042-.031-.042-.016 0-.031-.016-.047-.043v3.657h-.78V6.854h1.154l1.353 4.115.015.043c.016 0 .031 0 .031-.043l1.354-4.115h1.153v5.718h-.876Z"
                    fill="#000"
                  ></path>
                  <path
                    d="m15.865 12.573-.941-2.507h-1.92v2.507h-.913V6.855h2.4c1.319 0 2.105.751 2.105 1.659 0 .7-.4 1.195-1.096 1.42l1.077 2.639h-1.044 .332Zm-1.043-3.286c.705 0 1.115-.358 1.115-.911 0-.553-.41-.911-1.115-.911h-1.446v1.822h1.446ZM14.579 19.981a3.585 3.585 0 0 0 1.532.338c.7 0 1.115-.338 1.115-.874 0-.526-.395-.827-1.115-.827-.442 0-.853.111-1.106.222l-.216-.684c.358-.173.911-.338 1.531-.338 1.186 0 1.847.637 1.847 1.595s-.689 1.643-2.011 1.643c-.637 0-1.169-.143-1.48-.317l.216-.758h-.313ZM9.673 19.189c0-1.58 1.096-2.779 2.59-2.779 1.514 0 2.59 1.183 2.59 2.779 0 1.58-1.095 2.779-2.609 2.779-1.494 0-2.59-1.183-2.571-2.779Zm4.252 0c0-1.025-.668-1.975-1.68-1.975-1.01 0-1.663.934-1.663 1.975 0 1.026.654 1.975 1.682 1.975s1.661-.934 1.661-1.975ZM18.041 20.05v-.825h-2.147v-.655l2.01-2.841h.917v2.82h.627v.679h-.627v.824h-.809 .029Zm0-1.501v-1.417l-1.011 1.417h1.011ZM8.633 13.873a5.96 5.96 0 0 1-1.187.118c-1.444 0-2.4-.961-2.4-2.52 0-1.56.988-2.598 2.525-2.598.578 0 .931.108 1.112.18l-.145.728c-.23-.096-.532-.168-.952-.168-1.03 0-1.673.645-1.673 1.823 0 1.126.669 1.802 1.639 1.802.365 0 .731-.061.952-.168l.145.769-.016.034ZM11.375 13.991c-1.51 0-2.595-1.162-2.595-2.542 0-1.515 1.13-2.598 2.655-2.598 1.526 0 2.595 1.147 2.595 2.542 0 1.515-1.086 2.598-2.655 2.598Zm.044-4.41c-.895 0-1.696.936-1.696 1.914 0 1.069.771 1.847 1.666 1.847.88 0 1.682-.825 1.682-1.899 0-1.055-.723-1.862-1.637-1.862h-.015ZM27.017 9.143v.775h-2.36v1.16h2.177v.771h-2.178v1.949h-.897V9.145h.897v-.002h.001Z"
                    fill="#000"
                  ></path>
                  <path
                    d="M27.017 13.798v-4.66h.896v4.66h-.896ZM30.948 11.174c.368-.427.574-.993.574-1.594 0-1.177-.698-2.395-2.672-2.395-.653 0-1.262.137-1.552.273v6.34h.896v-2.521h.213c.501 0 .758.302 1.29 1.204l.789 1.317h1.068l-.941-1.43c-.471-.706-.87-1.01-1.307-1.129l.01-.004c.898-.251 1.564-.934 1.564-1.99 0-1.177-.774-2.239-2.551-2.239-.668 0-1.291.137-1.58.273v6.324h.896v-2.521h.881c.501 0 .774.302 1.262 1.02l.986 1.501h1.08l-1.067-1.613c-.46-.693-.83-.962-1.234-1.067a1.847 1.847 0 0 0 1.395-1.75Zm-2.542.286v-3.52c.153-.034.395-.069.698-.069 1.021 0 1.673.622 1.673 1.777 0 1.14-.668 1.812-1.673 1.812h-.698Z"
                    fill="#000"
                  ></path>
                </svg>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <svg
                  viewBox="0 0 38 24"
                  className="h-6 w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"
                    fill="#000"
                    opacity=".07"
                  ></path>
                  <path
                    d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M10.3 7.1c1.2 0 2.3.6 2.9 1.6h3.4c-.8-2.1-2.9-3.6-5.3-3.6-3.2 0-5.7 2.6-5.7 5.7 0 3.2 2.6 5.7 5.7 5.7 2.5 0 4.6-1.6 5.4-3.7h-3.4c-.5 1-1.6 1.7-2.9 1.7-1.9 0-3.4-1.5-3.4-3.4.1-2.1 1.6-3.7 3.4-3.7h-.1ZM38 12v-1.1h-2.2v-2.2h-1.1v2.2h-2.2V12h2.2v2.2H36V12h2Z"
                    fill="#000"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CartPage;
