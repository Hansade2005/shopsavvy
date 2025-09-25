import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
 id: string;
 name: string;
 price: number;
 quantity: number;
 imageUrl: string;
}

export function Cart() {
 const [isOpen, setIsOpen] = useState(false);
 const [cartItems, setCartItems] = useState<CartItem[]>([]);

 useEffect(() => {
 const savedCart = localStorage.getItem('cart');
 if (savedCart) {
 setCartItems(JSON.parse(savedCart));
 }
 }, []);

 useEffect(() => {
 localStorage.setItem('cart', JSON.stringify(cartItems));
 }, [cartItems]);

 const addToCart = (item: Omit<CartItem, 'quantity'>) => {
 setCartItems(prevItems => {
 const existingItem = prevItems.find(i => i.id === item.id);
 if (existingItem) {
 return prevItems.map(i =>
 i.id === item.id ? { ...i, quantity: i.quantity +1 } : i
 );
 }
 return [...prevItems, { ...item, quantity:1 }];
 });
 };

 const removeFromCart = (itemId: string) => {
 setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
 };

 const updateQuantity = (itemId: string, newQuantity: number) => {
 if (newQuantity <1) return;
 setCartItems(prevItems =>
 prevItems.map(item =>
 item.id === itemId ? { ...item, quantity: newQuantity } : item
 )
 );
 };

 const totalItems = cartItems.reduce((sum, item) => sum + item.quantity,0);
 const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity,0);

 return (
 <div className="relative">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
 >
 <ShoppingCart className="h-6 w-6" />
 {totalItems >0 && (
 <motion.span
 initial={{ scale:0 }}
 animate={{ scale:1 }}
 className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
 >
 {totalItems}
 </motion.span>
 )}
 </button>

 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity:0, y: -20 }}
 animate={{ opacity:1, y:0 }}
 exit={{ opacity:0, y: -20 }}
 className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden"
 >
 <div className="p-4 border-b border-gray-200 flex justify-between items-center">
 <h3 className="font-semibold text-lg">Shopping Cart</h3>
 <button
 onClick={() => setIsOpen(false)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {cartItems.length ===0 ? (
 <div className="p-6 text-center text-gray-500">
 Your cart is empty
 </div>
 ) : (
 <div className="max-h-96 overflow-y-auto">
 {cartItems.map(item => (
 <motion.div
 key={item.id}
 initial={{ opacity:0, x: -20 }}
 animate={{ opacity:1, x:0 }}
 exit={{ opacity:0, x:20 }}
 className="p-4 border-b border-gray-100 last:border-b-0 flex items-center"
 >
 <img
 src={item.imageUrl}
 alt={item.name}
 className="w-16 h-16 object-contain rounded-md mr-4"
 />
 <div className="flex-1">
 <h4 className="font-medium">{item.name}</h4>
 <div className="flex items-center mt-1">
 <button
 onClick={() => updateQuantity(item.id, item.quantity -1)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <Minus className="h-4 w-4" />
 </button>
 <span className="mx-2 w-6 text-center">{item.quantity}</span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity +1)}
 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <Plus className="h-4 w-4" />
 </button>
 </div>
 </div>
 <div className="text-right">
 <p className="font-medium">
 ${(item.price * item.quantity).toFixed(2)}
 </p>
 <button
 onClick={() => removeFromCart(item.id)}
 className="mt-1 text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
 >
 <Trash2 className="h-4 w-4 mr-1" />
 Remove
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 {cartItems.length >0 && (
 <div className="p-4 border-t border-gray-200">
 <div className="flex justify-between items-center mb-4">
 <span className="font-medium">Total:</span>
 <span className="font-bold text-lg">
 ${totalPrice.toFixed(2)}
 </span>
 </div>
 <div className="flex gap-2">
 <Link
 to="/cart"
 onClick={() => setIsOpen(false)}
 className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
 >
 View Cart
 </Link>
 <Link
 to="/checkout"
 onClick={() => setIsOpen(false)}
 className="flex-1 text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
 >
 Checkout
 </Link>
 </div>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}