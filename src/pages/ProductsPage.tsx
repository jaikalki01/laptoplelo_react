
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { products as fetchProducts } from '../data/products';

const ProductsPage = () => {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const { products, searchProducts, filterProductsByType } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 200000,
  });
  const [productList, setProductList] = useState<Product[]>([]);
  // Get unique brands from products
  const brands = [...new Set(productList.map((product) => product.brand))];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts(); // Get all products
        setProductList(fetchedProducts);

        if (type === 'sale' || type === 'rent') {
          // Filter based on type from URL
          const filtered = fetchedProducts.filter(product => product.type === type);
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(fetchedProducts); // Show all if type not defined
        }
      } catch (error) {
        // Handle error
      }
    };

    loadProducts();
  }, [type]); // Run this effect whenever the URL param changes

  useEffect(() => {
    // Apply type filter first
    let filtered = productList;
    if (type && (type === "sale" || type === "rent")) {
      filtered = productList.filter((product) => product.type === type);
    }

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    // Apply brand filter
    if (filterBrands.length > 0) {
      filtered = filtered.filter((product) =>
        filterBrands.includes(product.brand)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, type, searchQuery, sortBy, filterBrands, priceRange]);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled in useEffect
  };

  const handleBrandToggle = (brand: string) => {
    setFilterBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleTypeChange = (newType: string | null) => {
    if (newType === null || newType === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${newType}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("featured");
    setFilterBrands([]);
    setPriceRange({ min: 0, max: 200000 });
    navigate('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {type
              ? type === "sale"
                ? "Buy Laptops"
                : "Rent Laptops"
              : "All Laptops"}
          </h1>
          <p className="text-gray-600">
            {type
              ? type === "sale"
                ? "Find the perfect laptop to buy for your needs"
                : "Rent high-quality laptops for your short-term needs"
              : "Browse our complete collection of laptops"}
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="w-full md:w-1/2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search laptops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Product Type</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="type-all-mobile"
                              checked={!type}
                              onCheckedChange={() => handleTypeChange('all')}
                            />
                            <label
                              htmlFor="type-all-mobile"
                              className="text-sm cursor-pointer"
                            >
                              All
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="type-sale-mobile"
                              checked={type === "sale"}
                              onCheckedChange={() => handleTypeChange('sale')}
                            />
                            <label
                              htmlFor="type-sale-mobile"
                              className="text-sm cursor-pointer"
                            >
                              For Sale
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="type-rent-mobile"
                              checked={type === "rent"}
                              onCheckedChange={() => handleTypeChange('rent')}
                            />
                            <label
                              htmlFor="type-rent-mobile"
                              className="text-sm cursor-pointer"
                            >
                              For Rent
                            </label>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Brand</h3>
                        <div className="space-y-2">
                          {brands.map((brand) => (
                            <div
                              key={brand}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`brand-${brand}-mobile`}
                                checked={filterBrands.includes(brand)}
                                onCheckedChange={() => handleBrandToggle(brand)}
                              />
                              <label
                                htmlFor={`brand-${brand}-mobile`}
                                className="text-sm cursor-pointer"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 space-y-6">
            <div>
              <h3 className="font-medium mb-4">Product Type</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-all"
                    checked={!type}
                    onCheckedChange={() => handleTypeChange('all')}
                  />
                  <label
                    htmlFor="type-all"
                    className="text-sm cursor-pointer"
                  >
                    All
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-sale"
                    checked={type === "sale"}
                    onCheckedChange={() => handleTypeChange('sale')}
                  />
                  <label
                    htmlFor="type-sale"
                    className="text-sm cursor-pointer"
                  >
                    For Sale
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-rent"
                    checked={type === "rent"}
                    onCheckedChange={() => handleTypeChange('rent')}
                  />
                  <label
                    htmlFor="type-rent"
                    className="text-sm cursor-pointer"
                  >
                    For Rent
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-4">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center gap-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filterBrands.includes(brand)}
                      onCheckedChange={() => handleBrandToggle(brand)}
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-gray-500">
                Showing {filteredProducts.length} products
              </p>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">
                  No products found matching your criteria
                </p>
                <Button
                  variant="link"
                  className="mt-4 text-primary"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
