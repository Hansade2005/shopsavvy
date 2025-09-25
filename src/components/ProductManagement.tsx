import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 description: string;
 price: number;
 imageUrl: string;
 category: string;
 stock: number;
 created_at: string;
}

export function ProductManagement() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading,Loading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [editingProduct, setEditingProduct] = useState<Product | null>(null);
 const [showAddForm, setShowAddForm] = useState(false);

 useEffect(() => {
 fetchProducts();
 }, []);

 const fetchProducts = async () => {
 setLoading(true);
 const { data, error } = await supabase
 .from('products')
 .select('*')
 .order('created_at', { ascending: false });

 if (error) {
 console.error('Error fetching products:', error);
 } else {
 setProducts(data || []);
 }
 setLoading(false);
 };

 const handleAddProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
 const { data, error } = await supabase
 .from('products')
 .insert([product])
 .select()
 .single();

 if (error) {
 console.error('Error adding product:', error);
 } else {
 setProducts([data, ...products]);
 setShowAddForm(false);
 }
 };

 const handleUpdateProduct = async (product: Product) => {
 const { data, error } = await supabase
 .from('products')
 .update(product)
 .eq('id', product.id)
 .select()
 .single();

 if (error) {
 console.error('Error updating product:', error);
 } else {
 setProducts(products.map(p => p.id === product.id ? data : p));
 setEditingProduct(null);
 }
 };

 const handleDeleteProduct = async (id: string) => {
 const { error } = await supabase
 .from('products')
 .delete()
 .eq('id', id);

 if (error) {
 console.error('Error deleting product:', error);
 } else {
 setProducts(products.filter(p => p.id !== id));
 }
 };

 const filteredProducts = products.filter(product =>
 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 product.description.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
 <div className="container mx-auto px-4 py-8">
 <div className="flex justify-between items-center mb-6">
 <h1 className="text-3xl font-bold">Product Management</h1>
 <button
 onClick={() => setShowAddForm(true)}
 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
 >
 <Plus className="h-5 w-5 mr-2" />
 Add Product
 </button>
 </div>

 <div className="mb-6">
 <div className="relative">
 <input
 type="text"
 placeholder="Search products..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
 </div>
 </div>

 {loading ? (
 <div className="flex justify-center items-center py-12">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
 </div>
 ) : (
 <div className="overflow-x-auto bg-white rounded-lg shadow">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {filteredProducts.map((product) => (
 <motion.tr
 key={product.id}
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 transition={{ duration:0.3 }}
 >
 <td className="px-6 py-4 whitespace-nowrap">
 <img
 src={product.imageUrl}
 alt={product.name}
 className="h-12 w-12 object-contain rounded-md"
 />
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="text-sm font-medium text-gray-900">{product.name}</div>
 <div className="text-sm text-gray-500">{product.description}</div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 {product.category}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 ${product.price.toFixed(2)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 {product.stock}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <button
 onClick={() => setEditingProduct(product)}
 className="text-indigo-600 hover:text-indigo-900 mr-4"
 >
 <Edit2 className="h-5 w-5" />
 </button>
 <button
 onClick={() => handleDeleteProduct(product.id)}
 className="text-red-600 hover:text-red-900"
 >
 <Trash2 className="h-5 w-5" />
 </button>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {/* Add Product Modal */}
 {showAddForm && (
 <ProductForm
 onSubmit={handleAddProduct}
 onClose={() => setShowAddForm(false)}
 />
 )}

 {/* Edit Product Modal */}
 {editingProduct && (
 <ProductForm
 product={editingProduct}
 onSubmit={handleUpdateProduct}
 onClose={() => setEditingProduct(null)}
 />
 )}
 </div>
 );
}

interface ProductFormProps {
 product?: Product;
 onSubmit: (product: Omit<Product, 'id' | 'created_at'>) => void;
 onClose: () => void;
}

function ProductForm({ product, onSubmit, onClose }: ProductFormProps) {
 const [formData, setFormData] = useState({
 name: product?.name || '',
 description: product?.description || '',
 price: product?.price ||0,
 imageUrl: product?.imageUrl || '',
 category: product?.category || '',
 stock: product?.stock ||0,
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 onSubmit(formData);
 };

 return (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
 <motion.div
 initial={{ opacity:0, scale:0.9 }}
 animate={{ opacity:1, scale:1 }}
 exit={{ opacity:0, scale:0.9 }}
 className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
 >
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold">
 {product ? 'Edit Product' : 'Add New Product'}
 </h2>
 <button
 onClick={onClose}
 className="text-gray-500 hover:text-gray-700"
 >
 <X className="h-6 w-6" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
 Product Name
 </label>
 <input
 id="name"
 name="name"
 type="text"
 value={formData.name}
 onChange={handleChange}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
 Description
 </label>
 <textarea
 id="description"
 name="description"
 value={formData.description}
 onChange={handleChange}
 required
 rows={3}
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
 Price
 </label>
 <input
 id="price"
 name="price"
 type="number"
 value={formData.price}
 onChange={handleChange}
 required
 min="0"
 step="0.01"
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
 Category
 </label>
 <input
 id="category"
 name="category"
 type="text"
 value={formData.category}
 onChange={handleChange}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
 Stock
 </label>
 <input
 id="stock"
 name="stock"
 type="number"
 value={formData.stock}
 onChange={handleChange}
 required
 min="0"
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>

 <div>
 <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
 Image URL
 </label>
 <input
 id="imageUrl"
 name="imageUrl"
 type="text"
 value={formData.imageUrl}
 onChange={handleChange}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="flex justify-end space-x-3">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
 >
 {product ? 'Update Product' : 'Add Product'}
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 );
}