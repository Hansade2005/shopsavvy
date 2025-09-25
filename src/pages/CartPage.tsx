import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 price: number;
 imageUrl: string;
 stock: number;
}

interface CartItem {
 id: string;
 product_id: string;
 quantity: number;
 product: Product;
}

export function CartPage() {
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchCartItems = async () => {
 try {
 setLoading(true);

 // In a real app, you would fetch from Supabase
 // For this example, we'll use mock data
 const mockCartItems: CartItem[] = [
 {
 id: 'cart-item-1',
 product_id: 'prod-1',
 quantity:2,
 product: {
 id: 'prod-1',
 name: 'Premium Wireless Headphones',
 price:199.99,
 imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
 stock:15
 }
 },
 {
 id: 'cart-item-2',
 product_id: 'prod-2',
 quantity:1,
 product: {
 id: 'prod-2',
 name: 'Smart Watch Pro',
 price:299.99,
 imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
 stock:8
 }
 },
 {
 id: 'cart-item-3',
 product_id: 'prod-3',
 quantity:3,
 product: {
 id: 'prod-3',
 name: 'Bluetooth Speaker',
 price:89.99,
 imageUrl: 'https://images.unsplash.com/photo-1587202372775-e9b6270af684?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
 stock:22
 }
 }
 ];

 setCartItems(mockCartItems);
 } catch (error) {
 console.error('Error fetching cart items:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchCartItems();
 }, []);

 const updateQuantity = (itemId: string, newQuantity: number) => {
 setCartItems(prevItems =>
 prevItems.map(item =>
 item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
 )
 );
 };

 const removeItem = (itemId: string) => {
 setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
 };

 const calculateSubtotal = () => {
 return cartItems.reduce((total, item) => total + (item.product.price * item.quantity),0);
 };

 const calculateShipping = () => {
 const subtotal = calculateSubtotal();
 return subtotal >100 ?0 :9.99;
 };

 const calculateTotal = () => {
 return calculateSubtotal() + calculateShipping();
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center h-screen">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
 </div>
 );
 }

 if (cartItems.length ===0) {
 return (
 <div className="container mx-auto px-4 py-16 text-center">
 <div className="max-w-md mx-auto">
 <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
 <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
 <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
 <Link
 to="/shop"
 className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 <ArrowLeft className="h-5 w-5 mr-2" />
 Continue Shopping
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Cart Items */}
 <div className="lg:col-span-2 space-y-6">
 {cartItems.map((item) => (
 <motion.div
 key={item.id}
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.3 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
 >
 <div className="flex flex-col md:flex-row">
 <div className="md:w-32 h-32 flex-shrink-0 bg-gray-50">
 <img
 src={item.product.imageUrl}
 alt={item.product.name}
 className="w-full h-full object-contain p-4"
 />
 </div>

 <div className="flex-1 p-6">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-lg font-medium text-gray-800">{item.product.name}</h3>
 <p className="text-gray-600 mt-1">In Stock</p>
 </div>
 <button
 onClick={() => removeItem(item.id)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <Trash2 className="h-5 w-5 text-gray-500" />
 </button>
 </div>

 <div className="mt-4 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <span className="text-lg font-bold text-indigo-600">
 ${(item.product.price * item.quantity).toFixed(2)}
 </span>
 <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
 <button
 onClick={() => updateQuantity(item.id, item.quantity -1)}
 className="px-3 py-2 hover:bg-gray-50 transition-colors"
 >
 <Minus className="h-4 w-4" />
 </button>
 <span className="px-4 py-2 border-l border-r border-gray-300">{item.quantity}</span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity +1)}
 className="px-3 py-2 hover:bg-gray-50 transition-colors"
 >
 <Plus className="h-4 w-4" />
 </button>
 </div>
 </div>

 <span className="text-gray-600">${item.product.price.toFixed(2)} each</span>
 </div>
 </div>
 </div>
 </motion.div>
 ))}

 <div className="flex justify-between items-center pt-6">
 <Link
 to="/shop"
 className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
 >
 <ArrowLeft className="h-5 w-5 mr-2" />
 Continue Shopping
 </Link>
 <button
 onClick={() => setCartItems([])}
 className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
 >
 Clear Cart
 </button>
 </div>
 </div>

 {/* Order Summary */}
 <div className="space-y-6">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

 <div className="space-y-4">
 <div className="flex justify-between">
 <span className="text-gray-600">Subtotal</span>
 <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
 </div>

 <div className="flex justify-between">
 <span className="text-gray-600">Shipping</span>
 <span className="font-medium">
 {calculateShipping() ===0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
 </span>
 </div>

 <div className="border-t border-gray-200 pt-4 mt-2">
 <div className="flex justify-between">
 <span className="text-lg font-bold text-gray-800">Total</span>
 <span className="text-lg font-bold text-indigo-00">${calculateTotal().toFixed(2)}</span>
 </div>
 </div>

 <Link
 to="/checkout"
 className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 Proceed to Checkout
 </Link>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h3 className="text-lg font-medium text-gray-800 mb-4">Need Help?</h3>
 <p className="text-gray-600 mb-4">Call us at (123)456-7890 or email support@shopsavvy.com</p>
 <p className="text-gray-600">We're available24/7 to assist you with your purchase.</p>
 </div>
 </div>
 </div>

 {/* You May Also Like */}
 <div className="mt-16">
 <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
 <p className="text-lg font-bold text-indigo-600">$29.99</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 );
}