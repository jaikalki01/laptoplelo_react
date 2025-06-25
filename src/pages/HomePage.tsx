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
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "@/components/products/ProductCard";
import { products as fetchProducts } from '../data/products';
import { Product } from '../types/index'; 

const HomePage = () => {
  const { products } = useApp();
  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProductList(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = activeTab === "all"
      ? productList 
      : activeTab === "both"
      ? productList.filter(p => p.type === "both")
      : productList.filter(p => p.type === activeTab);
    
    setFilteredProducts(filtered);
  }, [activeTab, productList]);
  

  const features = [
    {
      icon: <Laptop className="h-10 w-10 text-primary" />,
      title: "Wide Selection",
      description: "Choose from a variety of laptops for all your needs",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      title: "Buy or Rent",
      description: "Flexible options to purchase or rent laptops",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Quick Delivery",
      description: "Get your laptop delivered at your doorstep quickly",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Quality Assurance",
      description: "All laptops are quality checked and certified",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Easy Payments",
      description: "Multiple payment options for your convenience",
    },
    {
      icon: <Phone className="h-10 w-10 text-primary" />,
      title: "24/7 Support",
      description: "Our support team is always available to help you",
    },
  ];

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
                Buy or rent high-quality laptops with flexible options. Get the
                technology you need without the hassle.
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
            <p className="text-gray-600">
              Explore our collection of premium laptops
            </p>
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

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sale" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rent" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="both" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View All Products <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Why Choose Us</h2>
            <p className="text-gray-600">
              We offer the best laptop buying and renting experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
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
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">
              Don't just take our word for it, hear from our satisfied customers
            </p>
          </div>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                {
                  quote:
                    "LaptopLelo made it so easy for me to rent a high-performance laptop for my project. Their service was prompt and the laptop was in excellent condition.",
                  author: "Rahul Sharma",
                  role: "Freelance Developer",
                },
                {
                  quote:
                    "I purchased a MacBook from LaptopLelo and the experience was seamless. The price was competitive and delivery was quick.",
                  author: "Priya Patel",
                  role: "Graphic Designer",
                },
                {
                  quote:
                    "Their rental options saved me a lot of money for my startup. I could get premium laptops for my team without a huge upfront investment.",
                  author: "Vikram Singh",
                  role: "Startup Founder",
                },
              ].map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-6 bg-white rounded-lg shadow text-center mx-2">
                    <div className="mb-4">
                      <svg
                        className="h-8 w-8 text-primary mx-auto"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
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
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Laptop?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Whether you want to buy or rent, we have the perfect laptop for your
            needs. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="secondary">Shop Now</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
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