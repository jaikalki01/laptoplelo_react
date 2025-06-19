import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Check,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import axios from 'axios';
import { useCart } from "../components/layout/cartprovider"
import { useWishlist } from "../components/layout/wishlistprovider";
import { BASE_URL } from "@/routes";


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  type: "sale" | "rent";
  image: string;
  brand: string;
  specs: {
    processor: string;
    memory: string;
    storage: string;
    display: string;
    graphics: string;
  };
  available: boolean;
  featured: boolean;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addToCart, addToWishlist } = useApp();
  const [type, setType] = useState("sale"); // or "sale
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rental_duration, setRentalDuration] = useState(30); // Default to 30 days
  const [wishlist, setWishlist] = useState([]);
  const { fetchCartCount } = useCart()
  const { fetchWishlistCount } = useWishlist();

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/wishlist/wishlist`, { headers })
      .then((res) => {
        const productIds = res.data.wishlist.map((p) => p.id);
        setWishlist(productIds);
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
      });
  }, []);

  const isInWishlist = (id) => wishlist.includes(id);

  const toggleWishlist = async (product) => {
    const productId = product.id;
    const url = `${BASE_URL}/wishlist/wishlist/${productId}`;

    try {
      if (isInWishlist(productId)) {
        await axios.delete(url, { headers });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(url, null, { headers });
        setWishlist((prev) => [...prev, productId]);
      }
      fetchWishlistCount()
    } catch (error) {
      console.error("Error updating wishlist:", error.response?.data || error.message);
    }
  };


  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`${BASE_URL}/products/${id}`) // 🔗 Your FastAPI endpoint
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
        })
        .catch((error) => {
          //console.error("Error fetching product:", error);
          toast({
            title: "Failed to load product",
            variant: "destructive",
          });
        });
    }
  }, [id]);


  useEffect(() => {
    if (!product) return;

    const possibleUrls = [
      `.jpg`, `.png`, `.jpeg`
    ].flatMap(ext =>
      [1, 2, 3, 4].map(i =>
        `${BASE_URL}/static/uploaded_images/product_image_${i}_${product.id}${ext}`
      )
    );

    const checkImage = url =>
      new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });

    Promise.all(possibleUrls.map(checkImage)).then(urls => {
      setImageUrls(urls.filter(Boolean));
    });
  }, [product]);

  const fetchCartAndProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      if (!product || !product.id) {
        console.warn('Product is not loaded yet.');
        return;
      }

      const cartResponse = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!cartResponse.ok) throw new Error('Failed to fetch cart');

      const cartData = await cartResponse.json();
      console.log('Raw cart data:', cartData);

      const productId = product.id;
      const cartItem = cartData.find(item => item.product_id === productId);

      setQuantity(cartItem ? Math.max(1, cartItem.quantity || 0) : 1);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };


  useEffect(() => {
    if (product?.id) {
      fetchCartAndProducts();
    }
  }, [product]);


  // Optionally handle the case when imageUrl is null
  // if (!imageUrl) {
  //   console.log('Image URL not available');
  // }

  const handleAddToCart = () => {
    if (!product) return;

    const payload = {
      product_id: product.id,
      quantity,
      rental_duration: product.type === "sale" ? 0 : rental_duration,
      type: product.type,
      user_id: 1
    };

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        addToCart(product);
        toast({ title: "Added to cart" });
        console.log(data.type);
        fetchCartCount();
      })
      .catch((error) => {
        toast({
          title: "Error adding to cart",
          description: error.message,
          variant: "destructive",
        });
      });

    console.log(payload);
  };

  const handleRemoveFromCart = () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/cart/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
       },
      body: JSON.stringify({
        product_id: product.id,
        user_id: 1, // replace with actual logged-in user ID
        type: product.type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({ title: "Removed from cart" });
        console.log("Removed:", data);
        fetchCartCount();
      })
      .catch((error) => {
        toast({
          title: "Error removing from cart",
          description: error.message,
          variant: "destructive",
        });
      });
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: "Shared successfully",
          });
        })
        .catch((error) => {
          toast({
            title: "Error sharing",
            description: error.message,
            variant: "destructive",
          });
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
      });
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="w-full h-full max-h-[400px]">
          {imageUrls.length > 0 ? (
            <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-full">
              {imageUrls.map((url, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`product-image-${index + 1}`}
                      className="w-full h-full object-fill"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No images available</p>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.brand}</p>

            {product.type === "sale" ? (
              <div className="text-2xl font-bold mb-4">
                ₹{product.price.toLocaleString()}
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-2xl font-bold">
                  ₹{product.rental_price?.toLocaleString()}/month
                </div>
                <p className="text-sm text-gray-500">
                  ₹{product.price.toLocaleString()} outright purchase
                </p>
              </div>
            )}

            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="flex items-center text-green-600 mb-6">
              <Check className="h-5 w-5 mr-2" />
              <span>In Stock</span>
            </div>
          </div>

          <div className="space-y-6">
            {product.type === "rent" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rental Duration
                </label>
                <div className="flex space-x-4">
                  {[1, 3, 6, 12].map((months) => (
                    <Button
                      key={months}
                      variant={rental_duration === months * 30 ? "default" : "outline"}
                      className={rental_duration === months * 30 ? "bg-primary" : ""}
                      onClick={() => setRentalDuration(months * 30)}
                    >
                      {months} {months === 1 ? "Month" : "Months"}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
                <Button variant="destructive" onClick={handleRemoveFromCart}>
                  Remove from Cart
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.type === "rent" ? "Rent Now" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className={`w-full sm:w-auto ${isInWishlist(product.id) ? "text-red-500 border-red-500" : ""
                  }`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500" : ""
                    }`}
                />
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">Free Delivery</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">1 Year Warranty</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mt-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
        </TabsList>
        <TabsContent value="specifications" className="p-6 border rounded-b-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Technical Specifications</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Processor</td>
                    <td className="py-2 font-medium">{product.specs.processor}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Memory</td>
                    <td className="py-2 font-medium">{product.specs.memory}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Storage</td>
                    <td className="py-2 font-medium">{product.specs.storage}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Display</td>
                    <td className="py-2 font-medium">{product.specs.display}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Graphics</td>
                    <td className="py-2 font-medium">{product.specs.graphics}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <p className="text-gray-700">
                This {product.brand} {product.name} is available for
                {product.type === "rent" ? " rent" : " purchase"} and comes with a standard 1-year warranty.
                All our laptops are thoroughly tested and certified for quality assurance.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Package Includes:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{product.name} Laptop</li>
                  <li>Power Adapter</li>
                  <li>User Manual</li>
                  <li>Warranty Card</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="features" className="p-6 border rounded-b-md">
          <h3 className="font-semibold mb-4">Key Features</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">High Performance</p>
                <p className="text-gray-600">
                  Powered by {product.specs.processor} for exceptional performance and multitasking.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Crystal Clear Display</p>
                <p className="text-gray-600">
                  Enjoy vivid colors and sharp details with {product.specs.display}.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Ample Storage</p>
                <p className="text-gray-600">
                  Store all your files and applications with {product.specs.storage}.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Smooth Graphics</p>
                <p className="text-gray-600">
                  Experience smooth visuals with {product.specs.graphics}.
                </p>
              </div>
            </li>
          </ul>
        </TabsContent>
        {/* <TabsContent value="reviews" className="p-6 border rounded-b-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Customer Reviews</h3>
            <Button>Write a Review</Button>
          </div>
          <div className="space-y-6">
            {/* Sample reviews */}
        {/* <div className="border-b pb-6">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Amit Kumar</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">1 month ago</span>
              </div>
              <p className="text-gray-700">
                Great laptop for my work needs. Fast performance and excellent battery life.
              </p>
            </div>
            <div className="border-b pb-6">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Priya Singh</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < 5 ? "text-yellow-400" : "text-gray-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">2 weeks ago</span>
              </div>
              <p className="text-gray-700">
                I rented this laptop for a project and it exceeded my expectations.
                The display quality is amazing and it handled all my tasks without any lag.
              </p>
            </div>
          </div> */}
        {/* </TabsContent> */}
      </Tabs>
    </div >
  );
};

export default ProductDetailPage;
