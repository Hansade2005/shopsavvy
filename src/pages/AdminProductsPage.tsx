import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Search, Loader2, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

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

export function AdminProductsPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [categories, setCategories] = useState<Category[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 const [sortField, setSortField] = useState<'name' | 'price' | 'stock_quantity'>('name');
 const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
 const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage, setItemsPerPage] = useState(10);

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

 const filteredProducts = products.filter(product => {
 const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 product.description.toLowerCase().includes(searchTerm.toLowerCase());

 const matchesCategory = !selectedCategory || product.category_id === selectedCategory;

 return matchesSearch && matchesCategory;
 });

 const sortedProducts = [...filteredProducts].sort((a, b) => {
 if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 :1;
 if (a[sortField] > b[sortField]) return sortDirection === 'asc' ?1 : -1;
 return0;
 });

 const paginatedProducts = sortedProducts.slice(
 (currentPage -1) * itemsPerPage,
 currentPage * itemsPerPage
 );

 const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

 const handleSort = (field: 'name' | 'price' | 'stock_quantity') => {
 if (sortField === field) {
 setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
 } else {
 setSortField(field);
 setSortDirection('asc');
 }
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

 const getCategoryName = (categoryId: string) => {
 const category = categories.find(c => c.id === categoryId);
 return category ? category.name : 'Uncategorized';
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center h-full">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Page Header */}
 <div className="flex justify-between items-center">
 <h1 className="text-2xl font-bold text-gray-800">Products</h1>
 <Link
 to="/admin/products/add"
 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 <Plus className="h-4 w-4 mr-2" />
 Add Product
 </Link>
 </div>

 {/* Filters and Search */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="relative">
 <input
 type="text"
 placeholder="Search products..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
 </div>

 <div className="relative">
 <select
 value={selectedCategory || ''}
 onChange={(e) => setSelectedCategory(e.target.value || null)}
 className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
 >
 <option value="">All Categories</option>
 {categories.map(category => (
 <option key={category.id} value={category.id}>{category.name}</option>
 ))}
 </select>
 <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
 </div>

 <div className="relative">
 <select
 value={itemsPerPage}
 onChange={(e) => {
 setItemsPerPage(Number(e.target.value));
 setCurrentPage(1);
 }}
 className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
 >
 <option value="5">5 per page</option>
 <option value="10">10 per page</option>
 <option value="20">20 per page</option>
 <option value="50">50 per page</option>
 </select>
 <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
 </div>
 </div>

 {/* Products Table */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 <button
 onClick={() => handleSort('name')}
 className="flex items-center focus:outline-none"
 >
 Product
 {sortField === 'name' && (
 <span className="ml-1">
 {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
 </span>
 )}
 </button>
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 <button
 onClick={() => handleSort('price')}
 className="flex items-center focus:outline-none"
 >
 Price
 {sortField === 'price' && (
 <span className="ml-1">
 {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
 </span>
 )}
 </button>
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 <button
 onClick={() => handleSort('stock_quantity')}
 className="flex items-center focus:outline-none"
 >
 Stock
 {sortField === 'stock_quantity' && (
 <span className="ml-1">
 {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
 </span>
 )}
 </button>
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {paginatedProducts.length ===0 ? (
 <tr>
 <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
 No products found
 </td>
 </tr>
 ) : (
 paginatedProducts.map((product) => (
 <motion.tr
 key={product.id}
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 transition={{ duration:0.3 }}
 className="hover:bg-gray-50"
 >
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center">
 <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
 <ShoppingBag className="h-5 w-5 text-gray-400" />
 </div>
 <div className="ml-4">
 <div className="text-sm font-medium text-gray-900">{product.name}</div>
 <div className="text-sm text-gray-500">SKU: {product.sku}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 {getCategoryName(product.category_id)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 ${product.price.toFixed(2)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity <10 ? 'bg-red-100 text-red-800' : product.stock_quantity <50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
 {product.stock_quantity}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
 {product.is_active ? 'Active' : 'Inactive'}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <Link
 to={`/admin/products/edit/${product.id}`}
 className="text-indigo-600 hover:text-indigo-900 mr-4"
 >
 <Edit2 className="h-4 w-4" />
 </Link>
 <button
 onClick={() => handleDelete(product.id)}
 className="text-red-600 hover:text-red-900"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </td>
 </motion.tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
 <div className="flex-1 flex justify-between sm:hidden">
 <button
 onClick={() => setCurrentPage(prev => Math.max(prev -1,1))}
 disabled={currentPage ===1}
 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
 >
 Previous
 </button>
 <button
 onClick={() => setCurrentPage(prev => Math.min(prev +1, totalPages))}
 disabled={currentPage === totalPages}
 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
 >
 Next
 </button>
 </div>
 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
 <div>
 <p className="text-sm text-gray-700">
 Showing
 <span className="font-medium">{(currentPage -1) * itemsPerPage +1}</span>
 to
 <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedProducts.length)}</span>
 of
 <span className="font-medium">{sortedProducts.length}</span>
 results
 </p>
 </div>
 <div>
 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
 <button
 onClick={() => setCurrentPage(prev => Math.max(prev -1,1))}
 disabled={currentPage ===1}
 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
 >
 <span className="sr-only">Previous</span>
 <ChevronUp className="h-5 w-5" aria-hidden="true" />
 </button>
 {[...Array(totalPages)].map((_, index) => (
 <button
 key={index}
 onClick={() => setCurrentPage(index +1)}
 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index +1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
 >
 {index +1}
 </button>
 ))}
 <button
 onClick={() => setCurrentPage(prev => Math.min(prev +1, totalPages))}
 disabled={currentPage === totalPages}
 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
 >
 <span className="sr-only">Next</span>
 <ChevronDown className="h-5 w-5" aria-hidden="true" />
 </button>
 </nav>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}