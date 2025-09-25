import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, X, ChevronDown, Star, ShoppingCart, Heart, Eye, Grid, List } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 description: string;
 price: number;
 imageUrl: string;
 category: string;
 rating: number;
 stock: number;
}

interface FilterOption {
 id: string;
 label: string;
 value: string;
 count?: number;
}

interface FilterCategory {
 id: string;
 label: string;
 options: FilterOption[];
}

export function ShopPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
 const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

 const filterCategories: FilterCategory[] = [
 {
 id: 'category',
 label: 'Category',
 options: [
 { id: 'electronics', label: 'Electronics', value: 'electronics' },
 { id: 'clothing', label: 'Clothing', value: 'clothing' },
 { id: 'home', label: 'Home & Garden', value: 'home' },
 { id: 'books', label: 'Books', value: 'books' },
 { id: 'sports', label: 'Sports & Outdoors', value: 'sports' }
 ]
 },
 {
 id: 'price',
 label: 'Price Range',
 options: [
 { id: 'under-25', label: 'Under $25', value: '0-25' },
 { id: '25-50', label: '$25 - $50', value: '25-50' },
 { id: '50-100', label: '$50 - $100', value: '50-100' },
 { id: 'over-100', label: 'Over $100', value: '100-' }
 ]
 },
 {
 id: 'rating',
 label: 'Customer Rating',
 options: [
 { id: '4-up', label: '4 Stars & Up', value: '4' },
 { id: '3-up', label: '3 Stars & Up', value: '3' },
 { id: '2-up', label: '2 Stars & Up', value: '2' }
 ]
 }
 ];

 useEffect(() => {
 const fetchProducts = async () => {
 setLoading(true);
 try {
 const { data, error } = await supabase
 .from('products')
 .select('*')
 .order('created_at', { ascending: false });

 if (error) throw error;
 setProducts(data || []);
 } catch (error) {
 console.error('Error fetching products:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchProducts();
 }, []);

 const filteredProducts = products.filter(product => {
 // Search filter
 const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 product.description.toLowerCase().includes(searchTerm.toLowerCase());

 // Category filter
 const matchesCategory = !activeFilters.category ||
 activeFilters.category.includes(product.category);

 // Price filter
 const matchesPrice = !activeFilters.price ||
 activeFilters.price.some(range => {
 const [min, max] = range.split('-').map(Number);
 return (isNaN(min) || product.price >= min) &&
 (isNaN(max) || product.price <= max);
 });

 // Rating filter
 const matchesRating = !activeFilters.rating ||
 activeFilters.rating.some(rating => product.rating >= Number(rating));

 return matchesSearch && matchesCategory && matchesPrice && matchesRating;
 });

 const toggleFilter = (categoryId: string, optionValue: string) => {
 setActiveFilters(prev => {
 const currentFilters = prev[categoryId] || [];
 const newFilters = currentFilters.includes(optionValue)
 ? currentFilters.filter(v => v !== optionValue)
 : [...currentFilters, optionValue];

 return {
 ...prev,
 [categoryId]: newFilters.length >0 ? newFilters : undefined
 };
 });
 };

 const clearFilters = () => {
 setActiveFilters({});
 };

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
 setSearchTerm(e.target.value);
 };

 const handleQuickView = (productId: string) => {
 // Implement quick view functionality
 console.log('Quick view:', productId);
 };

 const handleAddToCart = (productId: string) => {
 // Implement add to cart functionality
 console.log('Add to cart:', productId);
 };

 const handleAddToWishlist = (productId: string) => {
 // Implement add to wishlist functionality
 console.log('Add to wishlist:', productId);
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
 {/* Hero Section */}
 <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 md:py-24">
 <div className="container mx-auto px-4">
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="max-w-3xl mx-auto text-center"
 >
 <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Products</h1>
 <p className="text-xl md:text-2xl opacity-90">Find exactly what you need from our curated selection</p>
 </motion.div>

 {/* Search Bar */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.2 }}
 className="mt-10 max-w-2xl mx-auto"
 >
 <div className="relative">
 <input
 type="text"
 placeholder="Search for products..."
 value={searchTerm}
 onChange={handleSearch}
 className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
 />
 <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
 </div>
 </motion.div>

 {/* Stats */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.4 }}
 className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
 >
 {[{
 label: 'Products',
 value: '1,250+'
 }, {
 label: 'Categories',
 value: '50+'
 }, {
 label: 'Brands',
 value: '150+'
 }, {
 label: 'Happy Customers',
 value: '50K+'
 }].map((stat, index) => (
 <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
 <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
 <div className="text-sm opacity-90">{stat.label}</div>
 </div>
 ))}
 </motion.div>
 </div>

 {/* Decorative elements */}
 <div className="absolute inset-0 overflow-hidden">
 <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
 <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
 </div>
 </section>

 {/* Main Content */}
 <div className="container mx-auto px-4 py-8">
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Filters Sidebar (Desktop) */}
 <div className="hidden lg:block w-72 flex-shrink-0">
 <motion.div
 initial={{ opacity:0, x:-20 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.5, delay:0.6 }}
 className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 sticky top-8"
 >
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold text-gray-800">Filters</h2>
 {Object.keys(activeFilters).length >0 && (
 <button
 onClick={clearFilters}
 className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
 >
 Clear All
 </button>
 )}
 </div>

 <div className="space-y-6">
 {filterCategories.map(category => (
 <div key={category.id} className="border-b border-gray-100 pb-6 last:border-b-0">
 <div className="flex justify-between items-center mb-3">
 <h3 className="font-medium text-gray-700">{category.label}</h3>
 <ChevronDown className="h-4 w-4 text-gray-500" />
 </div>

 <div className="space-y-2">
 {category.options.map(option => (
 <label key={option.id} className="flex items-center">
 <input
 type="checkbox"
 checked={activeFilters[category.id]?.includes(option.value) || false}
 onChange={() => toggleFilter(category.id, option.value)}
 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
 />
 <span className="ml-2 text-gray-700">{option.label}</span>
 {option.count !== undefined && (
 <span className="ml-auto text-sm text-gray-500">{option.count}</span>
 )}
 </label>
 ))}
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 </div>

 {/* Products Grid */}
 <div className="flex-1">
 {/* Mobile Filters Button */}
 <div className="lg:hidden mb-4 flex justify-between items-center">
 <button
 onClick={() => setMobileFiltersOpen(true)}
 className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/20"
 >
 <Filter className="h-4 w-4 mr-2" />
 <span>Filters</span>
 </button>

 <div className="flex items-center space-x-2">
 <button
 onClick={() => setViewMode('grid')}
 className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
 >
 <Grid className="h-5 w-5" />
 </button>
 <button
 onClick={() => setViewMode('list')}
 className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
 >
 <List className="h-5 w-5" />
 </button>
 </div>
 </div>

 {/* Sorting and Results Info */}
 <div className="flex justify-between items-center mb-6">
 <div className="text-sm text-gray-600">
 Showing {filteredProducts.length} of {products.length} products
 </div>

 <div className="relative">
 <select
 className="appearance-none bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 <option>Sort by: Featured</option>
 <option>Price: Low to High</option>
 <option>Price: High to Low</option>
 <option>Rating: High to Low</option>
 <option>Newest</option>
 </select>
 <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
 </div>
 </div>

 {/* Products Grid/List */}
 {loading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[...Array(6)].map((_, index) => (
 <motion.div
 key={index}
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 transition={{ duration:0.3, delay:index *0.1 }}
 className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20 animate-pulse"
 >
 <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
 </motion.div>
 ))}
 </div>
 ) : (
 <AnimatePresence mode="wait">
 {viewMode === 'grid' ? (
 <motion.div
 key="grid"
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 exit={{ opacity:0 }}
 transition={{ duration:0.3 }}
 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
 >
 {filteredProducts.map((product) => (
 <ProductCard
 key={product.id}
 product={product}
 onQuickView={handleQuickView}
 onAddToCart={handleAddToCart}
 onAddToWishlist={handleAddToWishlist}
 />
 ))}
 </motion.div>
 ) : (
 <motion.div
 key="list"
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 exit={{ opacity:0 }}
 transition={{ duration:0.3 }}
 className="space-y-4"
 >
 {filteredProducts.map((product) => (
 <motion.div
 key={product.id}
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.3 }}
 className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden flex flex-col md:flex-row"
 >
 <div className="md:w-48 h-48 flex-shrink-0">
 <img
 src={product.imageUrl}
 alt={product.name}
 className="w-full h-full object-contain p-4"
 />
 </div>

 <div className="flex-1 p-6">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 <span className="ml-2 text-sm text-gray-600">({product.rating.toFixed(1)})</span>
 </div>
 </div>
 <div className="text-right">
 <p className="text-2xl font-bold text-indigo-600">
 ${product.price.toFixed(2)}
 </p>
 {product.stock >0 ? (
 <p className="text-sm text-green-600 mt-1">In Stock</p>
 ) : (
 <p className="text-sm text-red-600 mt-1">Out of Stock</p>
 )}
 </div>
 </div>

 <p className="mt-4 text-gray-600 line-clamp-3">{product.description}</p>

 <div className="mt-6 flex space-x-3">
 <button
 onClick={() => handleAddToCart(product.id)}
 className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 <ShoppingCart className="h-4 w-4 mr-2" />
 Add to Cart
 </button>
 <button
 onClick={() => handleAddToWishlist(product.id)}
 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
 >
 <Heart className="h-5 w-5 text-gray-600" />
 </button>
 <button
 onClick={() => handleQuickView(product.id)}
 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
 >
 <Eye className="h-5 w-5 text-gray-600" />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 )}

 {/* Mobile Filters Modal */}
 <AnimatePresence>
 {mobileFiltersOpen && (
 <motion.div
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 exit={{ opacity:0 }}
 className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
 onClick={() => setMobileFiltersOpen(false)}
 >
 <motion.div
 initial={{ x:'100%' }}
 animate={{ x:0 }}
 exit={{ x:'100%' }}
 transition={{ type:'spring', damping:30, stiffness:300 }}
 className="absolute right-0 top-0 bottom-0 w-80 bg-white/90 backdrop-blur-sm p-6 shadow-xl border-l border-white/20"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold text-gray-800">Filters</h2>
 <button
 onClick={() => setMobileFiltersOpen(false)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <div className="space-y-6">
 {filterCategories.map(category => (
 <div key={category.id} className="border-b border-gray-100 pb-6 last:border-b-0">
 <div className="flex justify-between items-center mb-3">
 <h3 className="font-medium text-gray-700">{category.label}</h3>
 <ChevronDown className="h-4 w-4 text-gray-500" />
 </div>

 <div className="space-y-2">
 {category.options.map(option => (
 <label key={option.id} className="flex items-center">
 <input
 type="checkbox"
 checked={activeFilters[category.id]?.includes(option.value) || false}
 onChange={() => toggleFilter(category.id, option.value)}
 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
 />
 <span className="ml-2 text-gray-700">{option.label}</span>
 {option.count !== undefined && (
 <span className="ml-auto text-sm text-gray-500">{option.count}</span>
 )}
 </label>
 ))}
 </div>
 </div>
 ))}
 </div>

 <div className="mt-6 flex space-x-3">
 <button
 onClick={clearFilters}
 className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
 >
 Clear All
 </button>
 <button
 onClick={() => setMobileFiltersOpen(false)}
 className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 Apply Filters
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </div>
 );
}