import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 price: number;
 imageUrl: string;
 rating: number;
 stock: number;
}

interface ProductCardProps {
 product: Product;
 onQuickView: (productId: string) => void;
 onAddToCart: (productId: string) => void;
 onAddToWishlist: (productId: string) => void;
}

export function ProductCard({
 product,
 onQuickView,
 onAddToCart,
 onAddToWishlist
}: ProductCardProps) {
 return (
 <motion.div
 whileHover={{ scale:1.02 }}
 whileTap={{ scale:0.98 }}
 className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-md"
 >
 <div className="relative group">
 <div className="h-48 w-full bg-gray-50 flex items-center justify-center">
 <img
 src={product.imageUrl}
 alt={product.name}
 className="object-contain h-full w-full p-4 transition-transform duration-300 group-hover:scale-105"
 />
 </div>

 {/* Quick Actions */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 whileHover={{ opacity:1, y:0 }}
 transition={{ duration:0.2 }}
 className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center space-x-2 opacity-0"
 >
 <button
 onClick={() => onQuickView(product.id)}
 className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
 >
 <Eye className="h-5 w-5 text-gray-800" />
 </button>
 <button
 onClick={() => onAddToCart(product.id)}
 className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
 >
 <ShoppingCart className="h-5 w-5 text-gray-800" />
 </button>
 <button
 onClick={() => onAddToWishlist(product.id)}
 className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
 >
 <Heart className="h-5 w-5 text-gray-800" />
 </button>
 </motion.div>
 </div>

 <div className="p-4">
 <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
 <div className="flex items-center mb-2">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 <span className="ml-1 text-sm text-gray-600">({product.rating.toFixed(1)})</span>
 </div>

 <div className="flex justify-between items-center">
 <p className="text-xl font-bold text-indigo-600">
 ${product.price.toFixed(2)}
 </p>
 {product.stock >0 ? (
 <span className="text-sm text-green-600">In Stock</span>
 ) : (
 <span className="text-sm text-red-600">Out of Stock</span>
 )}
 </div>

 <motion.button
 whileHover={{ scale:1.05 }}
 whileTap={{ scale:0.95 }}
 onClick={() => onAddToCart(product.id)}
 disabled={product.stock ===0}
 className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${product.stock >0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
 >
 <div className="flex items-center justify-center">
 <ShoppingCart className="h-4 w-4 mr-2" />
 <span>{product.stock >0 ? 'Add to Cart' : 'Out of Stock'}</span>
 </div>
 </motion.button>
 </div>
 </motion.div>
 );
}