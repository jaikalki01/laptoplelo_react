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
  Star,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp
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
import axios from 'axios';
import { useCart } from "../components/layout/cartprovider";
import { useWishlist } from "../components/layout/wishlistprovider";
import { BASE_URL } from "@/routes";

interface ProductImage {
  url: string;
  alt_text?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  type: "sale" | "rent";
  image: string;
  images: ProductImage[];
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
  const { addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rental_duration, setRentalDuration] = useState(30);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { fetchCartCount } = useCart();
  const { fetchWishlistCount } = useWishlist();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const imageRef = useRef<HTMLImageElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Process product images to ensure we have exactly 4
// Update your getProcessedImages function
// Update the getProcessedImages function
const getProcessedImages = (product: Product): ProductImage[] => {
  const images: ProductImage[] = [];
  const imageSet = new Set<string>();

  const getFullUrl = (imgPath: string) =>
    imgPath.startsWith("http") || imgPath.startsWith("/")
      ? `${BASE_URL}${imgPath.replace(BASE_URL, "")}`
      : `${BASE_URL}/static/uploaded_images/${imgPath}`;

  // Main image
  if (product.image) {
    const url = getFullUrl(product.image);
    if (!imageSet.has(url)) {
      images.push({ url, alt_text: `${product.name} - Main` });
      imageSet.add(url);
    }
  }

  // Additional images
  if (product.images && Array.isArray(product.images)) {
    for (let i = 0; i < product.images.length; i++) {
      const img = product.images[i];
      const imgUrl = typeof img === "string" ? img : img.url;
      const url = getFullUrl(imgUrl);

      if (!imageSet.has(url)) {
        images.push({
          url,
          alt_text: typeof img === "string"
            ? `${product.name} - Image ${i + 1}`
            : img.alt_text || `${product.name} - Image ${i + 1}`
        });
        imageSet.add(url);
      }

      if (images.length >= 4) break;
    }
  }

  // Fallback placeholder
  while (images.length < 4) {
    images.push({
      url: `${BASE_URL}/static/default-product-image.png`,
      alt_text: `${product.name} - Placeholder`
    });
  }

  return images;
};



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch wishlist
        const wishlistRes = await axios.get<{ wishlist: { id: string }[] }>(
          `${BASE_URL}/wishlist/wishlist`, 
          { headers }
        );
        setWishlist(wishlistRes.data.wishlist.map(p => p.id));

        // Fetch product
        const productRes = await fetch(`${BASE_URL}/products/${id}`);
        if (!productRes.ok) {
          throw new Error('Product not found');
        }
        const productData: Product = await productRes.json();
        setProduct(productData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current || !zoomContainerRef.current) return;
    
    const container = zoomContainerRef.current;
    const img = imageRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    const xPercent = (x / containerRect.width) * 100;
    const yPercent = (y / containerRect.height) * 100;
    
    setZoomPosition({
      x: (imgRect.width - containerRect.width) * (xPercent / 100),
      y: (imgRect.height - containerRect.height) * (yPercent / 100)
    });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      setZoomPosition({ x: 0, y: 0 });
    }
  };

  const handleAddToCart = (productType: "sale" | "rent" = product?.type || "sale") => {
    if (!product) return;

    const payload = {
      product_id: product.id,
      quantity,
      rental_duration: productType === "sale" ? 0 : rental_duration,
      type: productType
    };

    fetch(`${BASE_URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add to cart');
        return res.json();
      })
      .then(() => {
        addToCart(product);
        toast({
          title: productType === "rent" 
            ? "Added to cart for rent" 
            : "Added to cart for purchase"
        });
        fetchCartCount();
      })
      .catch((error) => {
        toast({
          title: "Error adding to cart",
          description: error.message,
          variant: "destructive"
        });
      });
  };

  const toggleWishlist = async () => {
    if (!product) return;
    
    const productId = product.id;
    const url = `${BASE_URL}/wishlist/wishlist/${productId}`;

    try {
      if (isInWishlist(productId)) {
        await axios.delete(url, { headers });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(url, null, { headers });
        setWishlist(prev => [...prev, productId]);
      }
      fetchWishlistCount();
    } catch (error) {
      toast({
        title: "Error updating wishlist",
        variant: "destructive"
      });
    }
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">{error || "The product could not be loaded."}</p>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  const processedImages = getProcessedImages(product);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail Navigation */}
          <div className="hidden md:flex md:flex-col gap-2 w-20">
            {processedImages.map((img, index) => (
              <button
                key={index}
                className={`w-full aspect-square border rounded-md overflow-hidden transition-all ${
                  activeSlideIndex === index 
                    ? 'border-primary ring-2 ring-primary' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveSlideIndex(index);
                  setIsZoomed(false);
                }}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${BASE_URL}/static/uploaded_images/${product.image}`;
                  }}
                />
              </button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div 
            ref={zoomContainerRef}
            className={`flex-1 relative ${isZoomed ? 'cursor-zoom-out overflow-hidden' : 'cursor-zoom-in'}`}
            onClick={toggleZoom}
            onMouseMove={handleMouseMove}
            aria-label="Product image zoom area"
          >
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img
                ref={imageRef}
                src={processedImages[activeSlideIndex].url}
                alt={processedImages[activeSlideIndex].alt_text}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  transform: isZoomed 
                    ? `scale(${zoomLevel}) translate(-${zoomPosition.x/zoomLevel}px, -${zoomPosition.y/zoomLevel}px)` 
                    : 'none'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${BASE_URL}/static/uploaded_images/${product.image}`;
                }}
              />
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? (
                  <ZoomOut className="h-4 w-4" />
                ) : (
                  <ZoomIn className="h-4 w-4" />
                )}
              </Button>
              {isZoomed && (
                <div className="bg-white/90 backdrop-blur-sm rounded-md flex">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(Math.max(1.5, zoomLevel - 0.5));
                    }}
                    aria-label="Decrease zoom level"
                  >
                    -
                  </Button>
                  <span className="px-2 flex items-center text-sm">
                    {zoomLevel}x
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(Math.min(4, zoomLevel + 0.5));
                    }}
                    aria-label="Increase zoom level"
                  >
                    +
                  </Button>
                </div>
              )}
            </div>

            {/* Image Navigation for Mobile */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
              {processedImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeSlideIndex === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex(index);
                    setIsZoomed(false);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            {processedImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {`${activeSlideIndex + 1}/${processedImages.length}`}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                1,234 ratings
              </span>
            </div>
            
            <div className="mb-4">
              {product.type === "sale" ? (
                <div className="text-2xl font-bold">
                  ₹{product.price.toLocaleString()}
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold">
                    ₹{product.rental_price?.toLocaleString()}/month
                  </div>
                  <p className="text-sm text-gray-500">
                    ₹{product.price.toLocaleString()} outright purchase
                  </p>
                </div>
              )}
              <p className="text-sm text-green-600 mt-1">Inclusive of all taxes</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">About this item</h3>
              <div className={`text-gray-700 ${expandedDescription ? '' : 'line-clamp-3'}`}>
                {product.description}
              </div>
              <button 
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="text-blue-600 text-sm hover:text-blue-800 flex items-center mt-1"
                aria-label={expandedDescription ? "Show less description" : "Read more description"}
              >
                {expandedDescription ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

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
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 6, 12].map((months) => (
                    <Button
                      key={months}
                      variant={rental_duration === months * 30 ? "default" : "outline"}
                      onClick={() => setRentalDuration(months * 30)}
                      className="flex-1 min-w-[80px]"
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
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-primary hover:bg-primary/90 flex-1 py-6"
                onClick={() => handleAddToCart("sale")}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>

              {product.type === "rent" && (
                <Button
                  className="bg-secondary hover:bg-secondary/90 flex-1 py-6"
                  onClick={() => handleAddToCart("rent")}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Rent Now
                </Button>
              )}

              <Button
                variant="outline"
                className={`flex-1 py-6 ${
                  isInWishlist(product.id) ? "text-red-500 border-red-500" : ""
                }`}
                onClick={toggleWishlist}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${
                    isInWishlist(product.id) ? "fill-red-500" : ""
                  }`}
                />
                {isInWishlist(product.id) ? "Remove" : "Wishlist"}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="py-6"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied to clipboard",
                    });
                  }
                }}
                aria-label="Share product"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">Delivery in 2-4 days</p>
              </div>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">1 Year Warranty</p>
                <p className="text-xs text-gray-500">Brand warranty</p>
              </div>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">7-Day Returns</p>
                <p className="text-xs text-gray-500">Easy return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Highlights Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Product Highlights</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">{product.specs.processor}</span> processor for powerful performance
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">{product.specs.memory}</span> RAM for smooth multitasking
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">{product.specs.storage}</span> storage for all your files
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">{product.specs.display}</span> display for stunning visuals
            </span>
          </li>
        </ul>
      </div>

      {/* Technical Specifications Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Technical Details</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50 w-1/3">Brand</td>
                <td className="py-3 px-4">{product.brand}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50">Model Name</td>
                <td className="py-3 px-4">{product.name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50">Processor</td>
                <td className="py-3 px-4">{product.specs.processor}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50">RAM</td>
                <td className="py-3 px-4">{product.specs.memory}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50">Storage</td>
                <td className="py-3 px-4">{product.specs.storage}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 bg-gray-50">Display</td>
                <td className="py-3 px-4">{product.specs.display}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600 bg-gray-50">Graphics</td>
                <td className="py-3 px-4">{product.specs.graphics}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
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
              <p className="text-gray-700 mb-4">
                This {product.brand} {product.name} is available for
                {product.type === "rent" ? " rent" : " purchase"} and comes with a standard 1-year warranty.
                All our laptops are thoroughly tested and certified for quality assurance.
              </p>
              <div>
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
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">High Performance</p>
                <p className="text-gray-600">
                  Powered by {product.specs.processor} for exceptional performance and multitasking.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Crystal Clear Display</p>
                <p className="text-gray-600">
                  Enjoy vivid colors and sharp details with {product.specs.display}.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Ample Storage</p>
                <p className="text-gray-600">
                  Store all your files and applications with {product.specs.storage}.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Smooth Graphics</p>
                <p className="text-gray-600">
                  Experience smooth visuals with {product.specs.graphics}.
                </p>
              </div>
            </li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;