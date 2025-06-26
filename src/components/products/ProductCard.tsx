import { useState, useEffect } from "react";
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

const ProductCard = ({ product }: ProductCardProps) => {
  const { fetchWishlistCount } = useWishlist();
  const { fetchCartCount } = useCart();
  const { addToCart } = useApp();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showRentPrice, setShowRentPrice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (product.image) {
      setImageUrl(`${BASE_URL}/static/uploaded_images/${product.image}`);
    } else {
      setImageUrl("/default-product.png");
    }
  }, [product.id, product.image]);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/wishlist/wishlist`, { headers })
      .then((res) => {
        const productIds = res.data.wishlist.map((p: any) => Number(p.id));
        setWishlist(productIds);
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
      });
  }, []);

  const isInWishlist = (id: number) => wishlist.includes(id);

  const toggleWishlist = async (product: Product) => {
    const productId: number = Number(product.id);
    const url = `${BASE_URL}/wishlist/wishlist/${productId}`;

    try {
      if (isInWishlist(productId)) {
        await axios.delete(url, { headers });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(url, null, { headers });
        setWishlist((prev) => [...prev, productId]);
      }
      fetchWishlistCount();
    } catch (error: any) {
      console.error("Error updating wishlist:", error.response?.data || error.message);
    }
  };

  const getBadgeColor = () => {
    switch (product.type) {
      case "rent":
        return "bg-blue-600";
      case "sale":
        return "bg-green-600";
      case "both":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  const getBadgeText = () => {
    switch (product.type) {
      case "rent":
        return "For Rent";
      case "sale":
        return "For Sale";
      case "both":
        return "Buy or Rent";
      default:
        return product.type;
    }
  };

  const togglePriceDisplay = () => {
    if (product.type === "both") {
      setShowRentPrice(!showRentPrice);
    }
  };

  const handleAddToCart = async () => {
    try {
      const type = product.type === "both" ? (showRentPrice ? "rent" : "sale") : product.type;
      const rental_duration = type === "rent" ? 30 : 0;
      const price = type === "rent" ? product.rental_price : product.price;

      const payload = {
        product_id: product.id,
        quantity: 1,
        rental_duration,
        type,
        price
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        addToCart({
          ...product,
          type,
          rental_duration,
          price
        });
        
        fetchCartCount();
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      console.error("Error adding to cart:", error);
    }
  };

  const getButtonText = () => {
    if (product.type === "rent") return "Rent Now";
    if (product.type === "sale") return "Add to Cart";
    return showRentPrice ? "Rent Now" : "Add to Cart";
  };

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
            />
          </div>
        </Link>
        <Badge className={`absolute top-2 left-2 ${getBadgeColor()}`}>
          {getBadgeText()}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
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
          {product.type === "sale" ? (
            <p className="font-bold text-lg">₹{product.price.toLocaleString()}</p>
          ) : product.type === "rent" ? (
            <div>
              <p className="font-bold text-lg">
                ₹{product.rental_price?.toLocaleString()}/month
              </p>
              <p className="text-xs text-gray-500">
                ₹{product.price.toLocaleString()} outright
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;