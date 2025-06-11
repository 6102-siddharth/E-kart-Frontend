import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Adjust path

// Helper to get Auth token
const getAuthToken = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        return await currentUser.getIdToken();
    }
    return null;
};

// Modal Component (simplified)
const ProductModal = ({ product, onClose, onSave, isNew }) => {
    const [formData, setFormData] = useState(
        product || { name: '', description: '', category: '', imageUrl: '', price: '', stock: '' }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isNew ? 'Add New' : 'Edit'} Product</h2>
                <form onSubmit={handleSubmit}>
                    {/* Basic form fields, add more as needed with proper input types */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">Image URL</label>
                        <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Save Product
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null for new, product object for edit

    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cameras`;

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            setError('');
        } catch (err) {
            setError("Failed to load products. " + (err.response?.data?.message || err.message));
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        setEditingProduct(null); // For new product
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        
        const token = await getAuthToken();
        if (!token) {
            setError("Authentication required.");
            return;
        }

        try {
            await axios.delete(`${API_URL}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts(); // Refresh list
        } catch (err) {
            setError("Failed to delete product. " + (err.response?.data?.message || err.message));
            console.error("Error deleting product:", err);
        }
    };

    const handleSaveProduct = async (productData) => {
        const token = await getAuthToken();
        if (!token) {
            setError("Authentication required.");
            setShowModal(false);
            return;
        }

        const method = editingProduct ? 'put' : 'post';
        const url = editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL;
        
        // Ensure price and stock are numbers
        const dataToSave = {
            ...productData,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock, 10),
        };


        try {
            await axios[method](url, dataToSave, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchProducts(); // Refresh list
        } catch (err) {
            setError(`Failed to save product. ` + (err.response?.data?.message || err.message));
            console.error("Error saving product:", err);
            // Keep modal open on error to allow correction
        }
    };


    if (isLoading) return <p className="text-gray-600">Loading products...</p>;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
                <button
                    onClick={handleAddProduct}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New Product
                </button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveProduct}
                    isNew={!editingProduct}
                />
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded"/>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <p className="text-gray-900 whitespace-no-wrap">${parseFloat(product.price).toFixed(2)}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <p className="text-gray-900 whitespace-no-wrap">{product.stock}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProducts;