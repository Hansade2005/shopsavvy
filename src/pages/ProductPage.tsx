import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

interface Review {
 id: string;
 userId: string;
 productId: string;
 rating: number;
 comment: string;
 createdAt: string;
 userName: string;
 userAvatar: string;
}

export function ProductPage() {
 const { id } = useParams<{ id: string }>();
 const [product, setProduct] = useState<Product | null>(null);
 const [reviews, setReviews] = useState<Review[]>([]);
 const [loading, setLoading] = useState(true);
 const [quantity, setQuantity] = useState(1);
 const [selectedImage, setSelectedImage] = useState('');

 useEffect(() => {
 const fetchProduct = async () => {
 try {
 setLoading(true);

 // Fetch product
 const { data: productData, error: productError } = await supabase
 .from('products')
 .select('*')
 .eq('id', id)
 .single();

 if (productError) throw productError;

 // Fetch reviews
 const { data: reviewsData, error: reviewsError } = await supabase
 .from('reviews')
 .select('*, users(name, avatar_url)')
 .eq('product_id', id);

 if (reviewsError) throw reviewsError;

 // Format reviews data
 const formattedReviews = reviewsData.map(review => ({
 ...review,
 userName: review.users?.name || 'Anonymous',
 userAvatar: review.users?.avatar_url || 'https://randomuser.me/api/portraits/blank.jpg'
 }));

 setProduct(productData);
 setReviews(formattedReviews);
 setSelectedImage(productData.imageUrl);
 } catch (error) {
 console.error('Error fetching product:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchProduct();
 }, [id]);

 const handleAddToCart = () => {
 console.log(`Added ${quantity} of ${product?.name} to cart`);
 };

 const handleAddToWishlist = () => {
 console.log(`Added ${product?.name} to wishlist`);
 };

 const handleQuantityChange = (newQuantity: number) => {
 if (newQuantity >=1 && newQuantity <= (product?.stock ||0)) {
 setQuantity(newQuantity);
 }
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center h-screen">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
 </div>
 );
 }

 if (!product) {
 return (
 <div className="flex justify-center items-center h-screen">
 <div className="text-center">
 <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
 <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
 <Link
 to="/"
 className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
 >
 <ChevronLeft className="h-5 w-5 mr-2" />
 Back to Home
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 <div className="flex flex-col lg:flex-row gap-12">
 {/* Product Images */}
 <div className="w-full lg:w-1/2">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="mb-6">
 <img
 src={selectedImage}
 alt={product.name}
 className="w-full h-auto rounded-lg object-cover aspect-square"
 />
 </div>

 <div className="grid grid-cols-4 gap-4">
 {[product.imageUrl, ...Array(3).fill('https://source.unsplash.com/random/200x200/?product')].map((img, index) => (
 <button
 key={index}
 onClick={() => setSelectedImage(img)}
 className={`rounded-lg overflow-hidden border-2 ${selectedImage === img ? 'border-indigo-500' : 'border-transparent hover:border-gray-200'} transition-all`}
 >
 <img
 src={img}
 alt={`Thumbnail ${index +1}`}
 className="w-full h-20 object-cover"
 />
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Product Details */}
 <div className="w-full lg:w-1/2">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
 <div className="flex items-center mb-4">
 <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{product.category}</span>
 </div>

 <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

 <div className="flex items-center mb-6">
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 </div>
 <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
 </div>

 <div className="text-3xl font-bold text-indigo-600 mb-6">
 ${product.price.toFixed(2)}
 </div>

 <p className="text-gray-600 mb-8">{product.description}</p>

 <div className="flex items-center mb-8">
 <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
 <button
 onClick={() => handleQuantityChange(quantity -1)}
 className="px-4 py-2 hover:bg-gray-50 transition-colors"
 >
 <ChevronLeft className="h-4 w-4" />
 </button>
 <span className="px-6 py-2 border-l border-r border-gray-200">{quantity}</span>
 <button
 onClick={() => handleQuantityChange(quantity +1)}
 className="px-4 py-2 hover:bg-gray-50 transition-colors"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>
 <span className="ml-4 text-gray-500">
 {product.stock >0 ? `${product.stock} in stock` : 'Out of stock'}
 </span>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 mb-8">
 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 onClick={handleAddToCart}
 disabled={product.stock ===0}
 className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${product.stock >0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
 >
 <ShoppingCart className="h-5 w-5 mr-2" />
 Add to Cart
 </motion.button>

 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 onClick={handleAddToWishlist}
 className="flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transitionors"
 >
 <Heart className="h-5 w-5 mr-2" />
 Wishlist
 </motion.button>
 </div>

 <div className="border-t border-gray-200 pt-8">
 <h3 className="text-lg font-medium text-gray-800 mb-4">Product Details</h3>
 <ul className="space-y-2">
 <li className="flex items-center">
 <Truck className="h-5 w-5 text-indigo-500 mr-3" />
 <span className="text-gray-600">Free shipping on orders over $50</span>
 </li>
 <li className="flex items-center">
 <ShieldCheck className="h-5 w-5 text-indigo-500 mr-3" />
 <span className="text-gray-600">30-day return policy</span>
 </li>
 <li className="flex items-center">
 <RefreshCw className="h-5 w-5 text-indigo-500 mr-3" />
 <span className="text-gray-600">2-year warranty</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>

 {/* Product Reviews */}
 <div className="mt-16">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
 <div className="flex justify-between items-center mb-8">
 <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
 <button className="text-indigo-600 hover:text-indigo-800 font-medium">Write a Review</button>
 </div>

 {reviews.length ===0 ? (
 <div className="text-center py-12">
 <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
 </div>
 ) : (
 <div className="space-y-8">
 {reviews.map((review) => (
 <div key={review.id} className="border-b border-gray-100 pb-8 last:border-b-0">
 <div className="flex items-start">
 <img
 src={review.userAvatar}
 alt={review.userName}
 className="h-12 w-12 rounded-full object-cover mr-4"
 />
 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <div>
 <h4 className="font-medium text-gray-800">{review.userName}</h4>
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
 {new Date(review.createdAt).toLocaleDateString()}
 </span>
 </div>
 <p className="text-gray-600">{review.comment}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}