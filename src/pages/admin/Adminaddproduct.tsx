import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import './ProductForm.css'; // Importing styles
import { BASE_URL } from '@/routes';

const Adminaddproduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        rental_price: 0,
        type: 'sale',
        brand: '',
        specs: {
          processor: '',
          memory: '',
          storage: '',
          display: '',
          graphics: ''
        },
        available: true,
        featured: false
      });
    
      const [images, setImages] = useState([]);
      const [isSubmitting, setIsSubmitting] = useState(false);
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (name.startsWith('specs.')) {
          const specKey = name.split('.')[1];
          setFormData((prev) => ({
            ...prev,
            specs: {
              ...prev.specs,
              [specKey]: value
            }
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
          }));
        }
      };
    
      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length !== 4) {
          alert('Please select exactly 4 images.');
          return;
        }
        setImages(files);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (images.length !== 4) {
          alert('Please upload exactly 4 images');
          return;
        }
    
        setIsSubmitting(true);
    
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price.toString());
        data.append('rental_price', formData.rental_price.toString());
        data.append('type', formData.type);
        data.append('brand', formData.brand);
        data.append('processor', formData.specs.processor);
        data.append('memory', formData.specs.memory);
        data.append('storage', formData.specs.storage);
        data.append('display', formData.specs.display);
        data.append('graphics', formData.specs.graphics);
        data.append('available', formData.available.toString());
        data.append('featured', formData.featured.toString());
    
        images.forEach((img) => {
          data.append('images', img);
        });
    
        try {
          const token = localStorage.getItem('token');
    
          const response = await fetch(`${BASE_URL}/products/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: data
          });
    
          if (!response.ok) throw new Error('Failed to submit');
    
          alert('Product submitted successfully!');
          // Optionally reset form
          setFormData({
            name: '',
            description: '',
            price: 0,
            rental_price: 0,
            type: 'sale',
            brand: '',
            specs: {
              processor: '',
              memory: '',
              storage: '',
              display: '',
              graphics: ''
            },
            available: true,
            featured: false
          });
          setImages([]);
        } catch (err) {
          alert('Error submitting product');
          console.error(err);
        } finally {
          setIsSubmitting(false);
        }
      };
    

    return (
        <>
            <AdminDashboard>
                <form className="product-form" onSubmit={handleSubmit}>
                    <h2>Add Product</h2>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Rental Price</label>
                        <input type="number" name="rental_price" value={formData.rental_price} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Upload Images (4 max)</label>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                    </div>


                    <div className="form-group">
                        <label>Brand</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                    </div>

                    <h4>Specifications</h4>
                    {['processor', 'memory', 'storage', 'display', 'graphics'].map((spec) => (
                        <div className="form-group" key={spec}>
                            <label>{spec}</label>
                            <input
                                type="text"
                                name={`specs.${spec}`}
                                value={formData.specs[spec]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    <div className="form-check">
                        <label>
                            <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                            Available
                        </label>
                    </div>

                    <div className="form-check">
                        <label>
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                            Featured
                        </label>
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </AdminDashboard>
        </>
    );
};

export default Adminaddproduct;
