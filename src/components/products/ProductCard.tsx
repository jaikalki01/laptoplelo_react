import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useWishlist } from "../layout/wishlistprovider";
import { BASE_URL } from "@/routes";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "../layout/cartprovider";

interface ProductCardProps {
  product: Product;
}

type ProductType = "rent" | "sale" | "both";

const ProductCard = ({ product }: ProductCardProps) => {
  const { fetchWishlistCount } = useWishlist();
  const { fetchCart } = useCart();  // Updated
  const { addToCart } = useApp();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showRentPrice, setShowRentPrice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = product.image 
      ? `${BASE_URL}/static/uploaded_images/${product.image}`
      : "/default-product.png";
    setImageUrl(url);
  }, [product.image]);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/wishlist/wishlist`, {
          headers: getAuthHeaders()
        });
        const productIds = response.data.wishlist.map((p: any) => Number(p.id));
        setWishlist(productIds);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [getAuthHeaders]);

  const isInWishlist = useCallback((id: number) => {
    return wishlist.includes(id);
  }, [wishlist]);

  const toggleWishlist = async (product: Product) => {
    const productId = Number(product.id);
    const url = `${BASE_URL}/wishlist/wishlist/${productId}`;

    try {
      setIsLoading(true);
      if (isInWishlist(productId)) {
        await axios.delete(url, { headers: getAuthHeaders() });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(url, null, { headers: getAuthHeaders() });
        setWishlist(prev => [...prev, productId]);
      }
      await fetchWishlistCount();
    } catch (error: any) {
      console.error("Error updating wishlist:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const productTypeConfig = {
    rent: { color: "bg-blue-600", text: "For Rent" },
    sale: { color: "bg-green-600", text: "For Sale" },
    both: { color: "bg-purple-600", text: "Buy or Rent" },
    default: { color: "bg-gray-600", text: "" }
  };

  const getBadgeConfig = (type: ProductType) => {
    return productTypeConfig[type] || productTypeConfig.default;
  };

  const togglePriceDisplay = () => {
    if (product.type === "both") {
      setShowRentPrice(!showRentPrice);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const type: ProductType = product.type === "both" 
        ? (showRentPrice ? "rent" : "sale") 
        : product.type as ProductType;
      
      const rental_duration = type === "rent" ? 30 : 0;
      const price = type === "rent" ? product.rental_price : product.price;

      const payload = {
        product_id: product.id,
        quantity: 1,
        rental_duration,
        type,
        price
      };

      await axios.post(`${BASE_URL}/cart/`, payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      addToCart({
        ...product,
        type,
        rental_duration,
        price
      });

      await fetchCart();  // Updated

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (product.type) {
      case "rent": return "Rent Now";
      case "sale": return "Add to Cart";
      case "both": return showRentPrice ? "Rent Now" : "Add to Cart";
      default: return "Add to Cart";
    }
  };

  const { color: badgeColor, text: badgeText } = getBadgeConfig(product.type as ProductType);

  return (
    <Card
      className="overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/default-product.png";
              }}
              loading="lazy"
            />
          </div>
        </Link>
        <Badge className={`absolute top-2 left-2 ${badgeColor}`}>
          {badgeText}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          disabled={isLoading}
        >
          <Heart
            className={`h-5 w-5 ${
              isInWishlist(Number(product.id)) ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4 flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        <p className="text-sm line-clamp-2 text-gray-600 mb-4">
          {product.description}
        </p>
        <div 
          className={`flex justify-between items-center ${product.type === "both" ? "cursor-pointer" : ""}`}
          onClick={togglePriceDisplay}
        >
          {renderPriceDisplay()}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );

  function renderPriceDisplay() {
    switch (product.type) {
      case "sale":
        return <p className="font-bold text-lg">₹{product.price.toLocaleString()}</p>;
      case "rent":
        return (
          <div>
            <p className="font-bold text-lg">
              ₹{product.rental_price?.toLocaleString()}/month
            </p>
            <p className="text-xs text-gray-500">
              ₹{product.price.toLocaleString()} outright
            </p>
          </div>
        );
      case "both":
        return (
          <div>
            {showRentPrice ? (
              <>
                <p className="font-bold text-lg">
                  ₹{product.rental_price?.toLocaleString()}/month
                </p>
                <p className="text-xs text-gray-500">
                  Click to see purchase price
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-lg">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Click to see rental price
                </p>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  }
};

export default ProductCard;
