import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";
import { useToast } from "@/components/ui/use-toast";

interface ProductSpecs {
  processor: string;
  memory: string;
  storage: string;
  display: string;
  graphics: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  type: string;
  brand: string;
  specs: ProductSpecs;
  available: boolean;
  featured: boolean;
  image: string;
}

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'image'> & { images: File[] }>({
    name: "",
    description: "",
    price: 0,
    rental_price: 0,
    type: "sale",
    brand: "",
    specs: {
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
    },
    available: false,
    featured: false,
    images: [],
  });
  const [currentImage, setCurrentImage] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData: Product = await response.json();
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          rental_price: productData.rental_price,
          type: productData.type,
          brand: productData.brand,
          specs: {
            processor: productData.specs.processor,
            memory: productData.specs.memory,
            storage: productData.specs.storage,
            display: productData.specs.display,
            graphics: productData.specs.graphics,
          },
          available: productData.available,
          featured: productData.featured,
          images: [],
        });
        setCurrentImage(`${BASE_URL}/static/uploaded_images/${productData.image}`);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("specs.")) {
      const specField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files as FileList) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const formDataToSend = new FormData();

      // Append all product data
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("rental_price", formData.rental_price.toString());
      formDataToSend.append("type", formData.type);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("processor", formData.specs.processor);
      formDataToSend.append("ram", formData.specs.memory);
      formDataToSend.append("storage", formData.specs.storage);
      formDataToSend.append("display", formData.specs.display);
      formDataToSend.append("graphics", formData.specs.graphics);
      formDataToSend.append("availability", formData.available.toString());
      formDataToSend.append("isFeatured", formData.featured.toString());

      // Append new images if any
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminDashboard>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AdminDashboard>
    );
  }

  if (!productId) {
    return (
      <AdminDashboard>
        <div className="text-center py-8 text-red-500">Product not found</div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Image Preview */}
          <div>
            <label className="block mb-2">Current Image</label>
            {currentImage && (
              <img
                src={currentImage}
                alt="Current product"
                className="w-32 h-32 object-cover rounded mb-4"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/default-product.png";
                }}
              />
            )}
          </div>

          {/* New Images Upload */}
          <div>
            <label className="block mb-2">Upload New Images (Max 4)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {formData.images.length} image(s) selected
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-2">Product Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="brand" className="block mb-2">Brand</label>
              <input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          {/* Pricing */}
        {/* Pricing */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label htmlFor="type" className="block mb-2">Type</label>
    <select
      id="type"
      name="type"
      value={formData.type}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md"
      required
    >
      <option value="sale">For Sale</option>
      <option value="rent">For Rent</option>
      <option value="both">Both</option>
    </select>
  </div>
  <div>
    <label htmlFor="price" className="block mb-2">
      {formData.type === 'rent' ? 'Purchase Price' : 'Sale Price'}
    </label>
    <input
      id="price"
      name="price"
      type="number"
      value={formData.price}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md"
      min="0"
      step="0.01"
      required={formData.type !== 'rent'}
      disabled={formData.type === 'rent'}
    />
  </div>
  <div>
    <label htmlFor="rental_price" className="block mb-2">
      {formData.type === 'sale' ? 'Rental Price' : 
       formData.type === 'rent' ? 'Daily Rental Price' : 'Rental Price'}
    </label>
    <input
      id="rental_price"
      name="rental_price"
      type="number"
      value={formData.rental_price}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md"
      min="0"
      step="0.01"
      required={formData.type !== 'sale'}
      disabled={formData.type === 'sale'}
    />
  </div>
</div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="processor" className="block mb-2">Processor</label>
              <input
                id="processor"
                name="specs.processor"
                value={formData.specs.processor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="memory" className="block mb-2">Memory (RAM)</label>
              <input
                id="memory"
                name="specs.memory"
                value={formData.specs.memory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="storage" className="block mb-2">Storage</label>
              <input
                id="storage"
                name="specs.storage"
                value={formData.specs.storage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="display" className="block mb-2">Display</label>
              <input
                id="display"
                name="specs.display"
                value={formData.specs.display}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="graphics" className="block mb-2">Graphics</label>
              <input
                id="graphics"
                name="specs.graphics"
                value={formData.specs.graphics}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>Available</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>Featured</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </AdminDashboard>
  );
};

export default EditProductPage;