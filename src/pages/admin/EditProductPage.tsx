import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: 0,
    rental_price: 0,
    type: "",
    brand: "",
    processor: "",
    memory: "",
    storage: "",
    display: "",
    graphics: "",
    available: false,
    featured: false,
    images: [] as File[],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${BASE_URL}/products/${productId}`);
      const productData = await response.json();
      setFormData({
        ...formData,
        ...productData,
        processor: productData.specs?.processor || "",
        memory: productData.specs?.memory || "",
        storage: productData.specs?.storage || "",
        display: productData.specs?.display || "",
        graphics: productData.specs?.graphics || "",
        images: [], // Reset to empty File[] for upload
      });
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const specs = {
      processor: formData.processor,
      memory: formData.memory,
      storage: formData.storage,
      display: formData.display,
      graphics: formData.graphics
    };
  
    const payload = {
      ...formData,
      specs, // nest specs
    };
  
    // remove images from JSON (handled separately)
    delete payload.images;
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        navigate("/admin/products");
      } else {
        throw new Error("Failed to update the product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!productId) return <div>Product not found</div>;

  return (
    <AdminDashboard>
      <div className="form-container">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="rental_price">Rental Price</label>
            <input id="rental_price" name="rental_price" type="number" value={formData.rental_price} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input id="type" name="type" value={formData.type} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="processor">Processor</label>
            <input id="processor" name="processor" value={formData.processor} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="memory">Memory</label>
            <input id="memory" name="memory" value={formData.memory} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="storage">Storage</label>
            <input id="storage" name="storage" value={formData.storage} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="display">Display</label>
            <input id="display" name="display" value={formData.display} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="graphics">Graphics</label>
            <input id="graphics" name="graphics" value={formData.graphics} onChange={handleInputChange} required />
          </div>

          <div className="form-group checkbox-group">
            <label>
              Available:
              <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} />
            </label>
            <label>
              Featured:
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="images">Product Images</label>
            <input type="file" id="images" multiple accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">Update Product</button>
          </div>
        </form>
      </div>
    </AdminDashboard>
  );
};

export default EditProductPage;
