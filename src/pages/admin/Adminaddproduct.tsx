import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { BASE_URL } from '@/routes';

const Adminaddproduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        rental_price: 0,
        type: 'both',
        brand: '',
        specs: {
            processor: '',
            ram: '',
            storage: '',
            display: '',
            graphics: ''
        },
        availability: true,
        isFeatured: false
    });
    
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('No authentication token found');
                    }

                    const response = await fetch(`${BASE_URL}/products/${productId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const product = await response.json();
                    
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        rental_price: product.rental_price,
                        type: product.type,
                        brand: product.brand,
                        specs: {
                            processor: product.specs?.processor || '',
                            ram: product.specs?.ram || '',
                            storage: product.specs?.storage || '',
                            display: product.specs?.display || '',
                            graphics: product.specs?.graphics || ''
                        },
                        availability: product.availability,
                        isFeatured: product.isFeatured
                    });

                    if (product.images) {
                        setExistingImages(product.images);
                    }
                } catch (err) {
                    console.error('Error fetching product:', err);
                    alert(`Failed to load product data: ${err.message}`);
                    navigate('/admin/products');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProduct();
        }
    }, [productId, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.startsWith('specs.')) {
            const specKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specs: {
                    ...prev.specs,
                    [specKey]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length > 4) {
                alert('Maximum 4 images allowed');
                return;
            }
            setImages(files);
        }
    };

    const removeExistingImage = (imageId: string) => {
        setExistingImages(prev => prev.filter(img => img._id !== imageId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0 && existingImages.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price.toString());
            formDataToSend.append('rental_price', formData.rental_price.toString());
            formDataToSend.append('type', formData.type);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('processor', formData.specs.processor);
            formDataToSend.append('ram', formData.specs.ram);
            formDataToSend.append('storage', formData.specs.storage);
            formDataToSend.append('display', formData.specs.display);
            formDataToSend.append('graphics', formData.specs.graphics);
            formDataToSend.append('availability', formData.availability.toString());
            formDataToSend.append('isFeatured', formData.isFeatured.toString());

            // Append new images
            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            // Append existing image IDs to keep
            existingImages.forEach(image => {
                formDataToSend.append('existingImages', image._id);
            });

            const method = productId ? 'PUT' : 'POST';
            const url = productId ? `${BASE_URL}/products/${productId}` : `${BASE_URL}/products`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }

            alert(`Product ${productId ? 'updated' : 'added'} successfully!`);
            navigate('/admin/products');
        } catch (err) {
            console.error('Error submitting product:', err);
            alert(err.message || 'Error submitting product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showPrice = formData.type === 'both' || formData.type === 'sale';
    const showRentalPrice = formData.type === 'both' || formData.type === 'rent';

    if (isLoading) {
        return (
            <AdminDashboard>
                <div className="loading">Loading product data...</div>
            </AdminDashboard>
        );
    }

    return (
        <AdminDashboard>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">{productId ? 'Edit Product' : 'Add Product'}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block mb-2">Product Name*</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="brand" className="block mb-2">Brand*</label>
                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-2">Description*</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="type" className="block mb-2">Type*</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="both">Both Sale and Rent</option>
                                <option value="sale">For Sale Only</option>
                                <option value="rent">For Rent Only</option>
                            </select>
                        </div>
                        {showPrice && (
                            <div>
                                <label htmlFor="price" className="block mb-2">Price (Sale)*</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                    step="0.01"
                                    required={showPrice}
                                />
                            </div>
                        )}
                        {showRentalPrice && (
                            <div>
                                <label htmlFor="rental_price" className="block mb-2">Rental Price*</label>
                                <input
                                    id="rental_price"
                                    name="rental_price"
                                    type="number"
                                    value={formData.rental_price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                    step="0.01"
                                    required={showRentalPrice}
                                />
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block mb-2">Images* (Max 4)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                        {images.length > 0 && (
                            <div className="mt-2 text-sm text-gray-500">
                                {images.length} new image(s) selected
                            </div>
                        )}
                        
                        {existingImages.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-medium mb-2">Existing Images:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingImages.map(img => (
                                        <div key={img._id} className="relative">
                                            <img 
                                                src={img.url} 
                                                alt="Product" 
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img._id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="processor" className="block mb-2">Processor*</label>
                            <input
                                id="processor"
                                name="specs.processor"
                                type="text"
                                value={formData.specs.processor}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="ram" className="block mb-2">RAM*</label>
                            <input
                                id="ram"
                                name="specs.ram"
                                type="text"
                                value={formData.specs.ram}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="storage" className="block mb-2">Storage*</label>
                            <input
                                id="storage"
                                name="specs.storage"
                                type="text"
                                value={formData.specs.storage}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="display" className="block mb-2">Display</label>
                            <input
                                id="display"
                                name="specs.display"
                                type="text"
                                value={formData.specs.display}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="graphics" className="block mb-2">Graphics</label>
                            <input
                                id="graphics"
                                name="specs.graphics"
                                type="text"
                                value={formData.specs.graphics}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="availability"
                                checked={formData.availability}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span>Available</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span>Featured Product</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : (productId ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminDashboard>
    );
};

export default Adminaddproduct;