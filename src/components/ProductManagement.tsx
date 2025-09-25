import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 description: string;
 price: number;
 category_id: string;
 stock_quantity: number;
 sku: string;
 is_active: boolean;
 created_at: string;
}

interface Category {
 id: string;
 name: string;
}

export function ProductManagement() {
 const [products, setProducts] = useState<Product[]>([]);
 const [categories, setCategories] = useState<Category[]>([]);
 const [loading, setLoading] = useState(true);
 const [editingProduct, setEditingProduct] = useState<Product | null>(null);
 const [showForm, setShowForm] = useState(false);

 useEffect(() => {
 const fetchData = async () => {
 try {
 setLoading(true);

 // Fetch products
 const { data: productsData } = await supabase
 .from('products')
 .select('*');

 // Fetch categories
 const { data: categoriesData } = await supabase
 .from('categories')
 .select('id, name');

 setProducts(productsData || []);
 setCategories(categoriesData || []);
 } catch (error) {
 console.error('Error fetching data:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, []);

 const handleEdit = (product: Product) => {
 setEditingProduct(product);
 setShowForm(true);
 };

 const handleDelete = async (id: string) => {
 if (window.confirm('Are you sure you want to delete this product?')) {
 try {
 const { error } = await supabase
 .from('products')
 .delete()
 .eq('id', id);

 if (error) throw error;

 setProducts(products.filter(product => product.id !== id));
 } catch (error) {
 console.error('Error deleting product:', error);
 alert('Failed to delete product');
 }
 }
 };

 const handleSubmit = async (e: React.FormEvent, product: Product) => {
 e.preventDefault();
 setLoading(true);

 try {
 if (editingProduct) {
 // Update existing product
 const { error } = await supabase
 .from('products')
 .update(product)
 .eq('id', product.id);

 if (error) throw error;

 setProducts(products.map(p => p.id === product.id ? product : p));
 } else {
 // Create new product
 const { data, error } = await supabase
 .from('products')
 .insert([product])
 .select();

 if (error) throw error;

 if (data && data.length >0) {
 setProducts([...products, data[0]]);
 }
 }

 setShowForm(false);
 setEditingProduct(null);
 } catch (error) {
 console.error('Error saving product:', error);
 alert('Failed to save product');
 } finally {
 setLoading(false);
 }
 };

 const Loading = () => {
 return (
 <div className="flex justify-center items-center h-full">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
 </div>
 );
 };

 if (loading) {
 return <Loading />;
 }

 return (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
 <button
 onClick={() => {
 setEditingProduct(null);
 setShowForm(true);
 }}
 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 <Plus className="h-4 w-4 mr-2" />
 Add Product
 </button>
 </div>

 {/* Product Table */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {products.length ===0 ? (
 <tr>
 <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
 No products found
 </td>
 </tr>
 ) : (
 products.map((product) => (
 <tr key={product.id} className="hover:bg-gray-50">
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_quantity}</td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
 {product.is_active ? 'Active' : 'Inactive'}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <button
 onClick={() => handleEdit(product)}
 className="text-indigo-600 hover:text-indigo-900 mr-4"
 >
 <Edit2 className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleDelete(product.id)}
 className="text-red-600 hover:text-red-900"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Product Form Modal */}
 {showForm && (
 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
 <div className="flex justify-between items-center p-6 border-b border-gray-200">
 <h2 className="text-xl font-bold text-gray-800">
 {editingProduct ? 'Edit Product' : 'Add New Product'}
 </h2>
 <button
 onClick={() => setShowForm(false)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <form
 onSubmit={(e) => handleSubmit(e, editingProduct || {
 id: '',
 name: '',
 description: '',
 price:0,
 category_id: '',
 stock_quantity:0,
 sku: '',
 is_active: true,
 created_at: new Date().toISOString()n })} className="p-6 space-y-6"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
 Product Name
 </label>
 <input
 id="name"
 type="text"
 defaultValue={editingProduct?.name || ''}
 required
 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
 Category
 </label>
 <select
 id="category"
 defaultValue={editingProduct?.category_id || ''}
 required
 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 >
 <option value="">Select a category</option>
 {categories.map(category => (
 <option key={category.id} value={category.id}>{category.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
 Price
 </label>
 <input
 id="price"
 type="number"
 step="0.01"
 defaultValue={editingProduct?.price || ''}
 required
 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
 Stock Quantity
 </label>
 <input
 id="stock"
 type="number"
 defaultValue={editingProduct?.stock_quantity || ''}
 required
 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="md:col-span-2">
 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
 Description
 </label>
 <textarea
 id="description"
 rows={4}
 defaultValue={editingProduct?.description || ''}
 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 ></textarea>
 </div>

 <div className="md:col-span-2 flex items-center">
 <input
 id="is_active"
 type="checkbox"
 defaultChecked={editingProduct?.is_active || true}
 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
 />
 <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
 Active Product
 </label>
 </div>
 </div>

 <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
 <button
 type="button"
 onClick={() => setShowForm(false)}
 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={loading}
 className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="002424">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M412a880018-8V0C5.373005.373012h4zm25.291A7.9627.962001412H0c03.0421.1355.82437.938l3-2.647z"></path>
 </svg>
 ) : (
 editingProduct ? 'Update Product' : 'Add Product'
 )}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}