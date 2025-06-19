
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useWishlist  } from "../layout/wishlistprovider";
import { BASE_URL } from "@/routes";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { fetchWishlistCount } = useWishlist();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    const loadImage = () => {
      const extensions = ["jpg", "jpeg", "png"];
      let found = false;

      extensions.forEach(ext => {
        const url = `${BASE_URL}/static/uploaded_images/product_image_1_${product.id}.${ext}`;
        const img = new Image();
        img.src = url;

        img.onload = () => {
          if (!found) {
            found = true;
            setImageUrl(url);
          }
        };

        img.onerror = () => {
          // Try next extension silently
        };
      });
    };

    loadImage();
  }, [product.id]);



  const token = localStorage.getItem("token"); // or use context if needed
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    // Fetch wishlist on component mount
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
      fetchWishlistCount();
    } catch (error) {
      console.error("Error updating wishlist:", error.response?.data || error.message);
    }
  };


  // Optionally handle the case when imageUrl is null
  // if (!imageUrl) {
  //   console.log('Image URL not available');
  // }
  const { addToCart, addToWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"
                }`}
            />
          </div>
        </Link>
        <Badge
          className={`absolute top-2 left-2 ${product.type === "rent" ? "bg-primary" : "bg-green-600"
            }`}
        >
          {product.type === "rent" ? "For Rent" : "For Sale"}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={() => toggleWishlist(product)}
        >
          <Heart
            className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
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
        <div className="flex justify-between items-center">
          {product.type === "sale" ? (
            <p className="font-bold text-lg">₹{product.price.toLocaleString()}</p>
          ) : (
            <div>
              <p className="font-bold text-lg">
                ₹{product.rental_price?.toLocaleString()}/month
              </p>
              <p className="text-xs text-gray-500">
                ₹{product.price.toLocaleString()} outright
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link className="product-card-button" to={`/product/${product.id}`}>
          <Button
            onClick={() => addToCart(product)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.type === "rent" ? "Rent Now" : "Add to Cart"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
