import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Laptop,
  ShoppingBag,
  Clock,
  ShieldCheck,
  CreditCard,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "@/components/products/ProductCard";
import { BASE_URL } from "@/routes";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
   type: 'sale' | 'rent' | 'both'; 
  image: string;
  brand: string;
   rental_duration?: number;  // <-- optional now
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


const HomePage = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid response format");
        }

        const data = await response.json();
        
        // Handle different response structures
        const products = Array.isArray(data) ? data : 
                         Array.isArray(data?.products) ? data.products : [];
        
        setProductList(products);
        setFilteredProducts(products);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load products. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = activeTab === "all" 
      ? productList 
      : productList.filter(p => p.type === activeTab);
    
    setFilteredProducts(filtered);
  }, [activeTab, productList]);

  const features = [
    { icon: <Laptop className="h-10 w-10 text-primary" />, title: "Wide Selection", description: "Choose from various laptops" },
    { icon: <ShoppingBag className="h-10 w-10 text-primary" />, title: "Buy or Rent", description: "Flexible purchase options" },
    { icon: <Clock className="h-10 w-10 text-primary" />, title: "Quick Delivery", description: "Fast shipping available" },
    { icon: <ShieldCheck className="h-10 w-10 text-primary" />, title: "Quality Assurance", description: "Certified products" },
    { icon: <CreditCard className="h-10 w-10 text-primary" />, title: "Easy Payments", description: "Multiple payment methods" },
    { icon: <Phone className="h-10 w-10 text-primary" />, title: "24/7 Support", description: "Always available to help" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect Laptop
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Buy or rent high-quality laptops with flexible options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/products/rent">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Rent a Laptop
                  </Button>
                </Link>
                <Link to="/products/both">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Buy & Rent Options
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Laptop Showcase"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Explore our premium laptops</p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-4 w-full max-w-lg">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sale">For Sale</TabsTrigger>
                <TabsTrigger value="rent">For Rent</TabsTrigger>
                <TabsTrigger value="both">Both</TabsTrigger>
              </TabsList>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sale" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter(p => p.type === "sale")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="rent" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter(p => p.type === "rent")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="both" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter(p => p.type === "both")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No products available
              </div>
            )}

            <div className="text-center mt-8">
              <Link to="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View All Products <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Why Choose Us</h2>
            <p className="text-gray-600">Best laptop buying experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
            <p className="text-gray-600">Hear from our customers</p>
          </div>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                {
                  quote: "Great service and quality products!",
                  author: "Rahul Sharma",
                  role: "Developer"
                },
                {
                  quote: "Perfect laptop for my needs",
                  author: "Priya Patel",
                  role: "Designer"
                }
              ].map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-6 bg-white rounded-lg shadow text-center mx-2">
                    <div className="mb-4">
                      <svg className="h-8 w-8 text-primary mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Laptop?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Get started with our flexible options today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="secondary">Shop Now</Button>
            </Link>
            <Link to="/contact">
               <Button variant="secondary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;