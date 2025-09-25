import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 description: string;
 price: number;
 category_id: string;
 stock_quantity: number;
 sku: string;
 images: string[];
 is_active: boolean;
 created_at: string;
}

interface Category {
 id: string;
 name: string;
}

interface Review {
 id: string;
 user_id: string;
 rating: number;
 comment: string;
 created_at: string;
}

interface User {
 id: string;
 email: string;
 name?: string;
 avatarUrl?: string;
}

export function ProductPage() {
 const { id } = useParams<{ id: string }>();
 const [product, setProduct] = useState<Product | null>(null);
 const [category, setCategory] = useState<Category | null>(null);
 const [reviews, setReviews] = useState<Review[]>([]);
 const [users, setUsers] = useState<User[]>([]);
 const [loading, setLoading] = useState(true);
 const [currentImageIndex, setCurrentImageIndex] = useState(0);
 const [quantity, setQuantity] = useState(1);

 useEffect(() => {
 const fetchData = async () => {
 try {
 setLoading(true);

 // Fetch product
 const { data: productData } = await supabase
 .from('products')
 .select('*')
 .eq('id', id)
 .single();

 // Fetch category
 const { data: categoryData } = await supabase
 .from('categories')
 .select('id, name')
 .eq('id', productData?.category_id)
 .single();

 // Fetch reviews
 const { data: reviewsData } = await supabase
 .from('reviews')
 .select('*')
 .eq('product_id', id);

 // Fetch users for reviews
 const userIds = reviewsData?.map(review => review.user_id) || [];
 const { data: usersData } = await supabase
 .from('users')
 .select('id, email, name, avatarUrl')
 .in('id', userIds);

 setProduct(productData || null);
 setCategory(categoryData || null);
 setReviews(reviewsData || []);
 setUsers(usersData || []);
 } catch (error) {
 console.error('Error fetching product data:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, [id]);

 const handleNextImage = () => {
 if (product && product.images.length >0) {
 setCurrentImageIndex((prevIndex) =>
 (prevIndex +1) % product.images.length
 );
 }
 };

 const handlePrevImage = () => {
 if (product && product.images.length >0) {
 setCurrentImageIndex((prevIndex) =>
 (prevIndex -1 + product.images.length) % product.images.length
 );
 }
 };

 const handleAddToCart = () => {
 // Implement add to cart functionality
 console.log('Adding to cart:', product?.id, quantity);
 };

 const handleAddToWishlist = () => {
 // Implement add to wishlist functionality
 console.log('Adding to wishlist:', product?.id);
 };

 const getUserForReview = (userId: string) => {
 return users.find(user => user.id === userId);
 };

 const calculateAverageRating = () => {
 if (reviews.length ===0) return0;
 const total = reviews.reduce((sum,) => sum + review.rating,0);
 return total / reviews.length;
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center h-screen">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
 </div>
 );
 }

 if (!product) {
 return (
 <div className="container mx-auto px-4 py-8 text-center">
 <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
 <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 {/* Product Images */}
 <div className="space-y-6">
 <div className="relative aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
 {product.images.length >0 ? (
 <motion.img
 key={currentImageIndex}
 src={product.images[currentImageIndex]}
 alt={`Product image ${currentImageIndex +1}`}
 initial={{ opacity:0 }}
 animate={{ opacity:1 }}
 transition={{ duration:0.3 }}
 className="w-full h-full object-contain p-8"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-gray-50">
 <ShoppingCart className="h-12 w-12 text-gray-400" />
 </div>
 )}

 {/* Image Navigation */}
 {product.images.length >1 && (
 <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
 {product.images.map((_, index) => (
 <button
 key={index}
 onClick={() => setCurrentImageIndex(index)}
 className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
 ></button>
 ))}
 </div>
 )}

 {/* Image Controls */}
 {product.images.length >1 && (
 <>
 <button
 onClick={handlePrevImage}
 className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
 >
 <ChevronLeft className="h-5 w-5 text-gray-800" />
 </button>
 <button
 onClick={handleNextImage}
 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
 >
 <ChevronRight className="h-5 w-5 text-gray-800" />
 </button>
 </>
 )}
 </div>

 {/* Thumbnail Images */}
 {product.images.length >1 && (
 <div className="grid grid-cols-4 gap-4">
 {product.images.map((image, index) => (
 <button
 key={index}
 onClick={() => setCurrentImageIndex(index)}
 className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${currentImageIndex === index ? 'border-indigo-600' : 'border-transparent hover:border-gray-200'} transition-all`}
 >
 <img
 src={image}
 alt={`Thumbnail ${index +1}`}
 className="w-full h-full object-contain p-2"
 />
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Product Details */}
 <div className="space-y-6">
 <div>
 <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
 <ol className="list-none p-0 inline-flex">
 <li className="flex items-center">
 <a href="/" className="hover:text-indigo-600">Home</a>
 <span className="mx-2">/</span>
 </li>
 <li className="flex items-center">
 <a href="/shop" className="hover:text-indigo-600">Shop</a>
 <span className="mx-2">/</span>
 </li>
 <li className="flex items-center">
 <span className="text-gray-900" aria-current="page">{product.name}</span>
 </li>
 </ol>
 </nav>
 <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
 <div className="flex items-center space-x-2">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-5 w-5 ${i < Math.floor(calculateAverageRating()) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 <span className="text-sm text-gray-600 ml-2">({reviews.length} reviews)</span>
 </div>
 </div>

 <div className="text-3xl font-bold text-indigo-600">
 ${product.price.toFixed(2)}
 </div>

 <div className="border-t border-b border-gray-200 py-4">
 <p className="text-gray-700 leading-relaxed">{product.description}</p>
 </div>

 <div className="space-y-4">
 <div className="flex items-center space-x-4">
 <span className="text-gray-700 font-medium">Quantity:</span>
 <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
 <button
 onClick={() => setQuantity(prev => Math.max(prev -1,1))}
 className="px-3 py-2 hover:bg-gray-50 transition-colors"
 >
 -
 </button>
 <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
 <button
 onClick={() => setQuantity(prev => prev +1)}
 className="px-3 py-2 hover:bg-gray-50 transition-colors"
 >
 +
 </button>
 </div>
 </div>

 <div className="flex space-x-4">
 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 onClick={handleAddToCart}
 disabled={product.stock_quantity ===0}
 className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${product.stock_quantity >0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
 >
 <ShoppingCart className="h-5 w-5 mr-2" />
 {product.stock_quantity >0 ? 'Add to Cart' : 'Out of Stock'}
 </motion.button>
 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 onClick={handleAddToWishlist}
 className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
 >
 <Heart className="h-5 w-5 text-gray-600" />
 </motion.button>
 </div>

 <div className="space-y-2">
 <div className="flex justify-between">
 <span className="text-gray-600">Category:</span>
 <span className="font-medium">{category?.name || 'Uncategorized'}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">SKU:</span>
 <span className="font-medium">{product.sku}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">Availability:</span>
 <span className={`font-medium ${product.stock_quantity >0 ? 'text-green-600' : 'text-red-600'}`}>
 {product.stock_quantity >0 ? 'In Stock' : 'Out of Stock'}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Product Reviews */}
 <div className="mt-12">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-5 w-5 ${i < Math.floor(calculateAverageRating()) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 <span className="ml-2 text-sm text-gray-600">({reviews.length} reviews)</span>
 </div>
 </div>

 {reviews.length ===0 ? (
 <div className="text-center py-8 bg-white rounded-xl shadow-sm">
 <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
 </div>
 ) : (
 <div className="space-y-6">
 {reviews.map((review) => {
 const user = getUserForReview(review.user_id);
 return (
 <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
 <div className="flex items-start space-x-4">
 <div className="flex-shrink-0">
 <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
 {user?.avatarUrl ? (
 <img
 src={user.avatarUrl}
 alt={user.name || 'User'}
 className="h-full w-full rounded-full object-cover"
 />
 ) : (
 <span className="text-gray-600 font-medium">{user?.name?.charAt(0) || 'U'}</span>
 )}
 </div>
 </div>

 <div className="flex-1">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="font-medium text-gray-800">{user?.name || 'Anonymous'}</h3>
 <div className="flex items-center mt-1">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 </div>
 </div>
 <span className="text-sm text-gray-500">
 {new Date(review.created_at).toLocaleDateString()}
 </span>
 </div>

 <p className="mt-3 text-gray-700">{review.comment}</p>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Related Products */}
 <div className="mt-16">
 <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {/* Placeholder for related products */}
 {[...Array(4)].map((_, index) => (
 <motion.div
 key={index}
 whileHover={{ scale:1.03 }}
 className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
 >
 <div className="h-48 bg-gray-50 flex items-center justify-center">
 <ShoppingCart className="h-10 w-10 text-gray-400" />
 </div>
 <div className="p-4">
 <h3 className="font-medium text-gray-800 mb-1">Related Product</h3>
 <div className="flex items-center mb-2">
 {[...Array(5)].map((_, i) => (
 <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
 ))}
 </div>
 <p className="text-lg font-bold text-indigo-600">$29.99</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 );
}