
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWishlist } from "@/components/layout/wishlistprovider";


const WishlistPage = () => {
  const { fetchWishlistCount } = useWishlist();
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8001/wishlist/wishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if you're using a different auth method
        },
      });
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8001/wishlist/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      fetchWishlistCount()
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="mb-6">
          Save your favorite laptops to your wishlist for later.
        </p>
        <Link to="/products">
          <Button className="bg-primary hover:bg-primary/90">
            <ShoppingBag className="mr-2 h-4 w-4" /> Browse Laptops
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

      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative">
              <Link to={`/product/${item.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8001/static/uploaded_images/product_image_1_${item.id}.jpg`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = () => {
                        target.onerror = null;
                        target.src = `http://127.0.0.1:8001/static/uploaded_images/product_image_${item.id}.jpeg`;
                      };
                      target.src = `http://127.0.0.1:8001/static/uploaded_images/product_image_${item.id}.png`;
                    }}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full text-red-500 hover:text-red-700"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-4 flex-grow">
              <Link to={`/product/${item.id}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
              <p className="text-sm line-clamp-2 text-gray-600 mb-4">{item.description}</p>
              <div>
                {item.type === "sale" ? (
                  <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                ) : (
                  <div>
                    <p className="font-bold text-lg">₹{item.rental_price?.toLocaleString()}/mo</p>
                    <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} outright</p>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Link to={`/product/${item.id}`}>
                <Button
                  onClick={() => addToCart(item)} // Assuming you have `addToCart` in context or props
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.type === "rent" ? "Rent Now" : "Add to Cart"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
