import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, CreditCard, Truck, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

interface Product {
 id: string;
 name: string;
 price: number;
 imageUrl: string;
}

interface CartItem {
 id: string;
 product_id: string;
 quantity: number;
 product: Product;
}

export function CheckoutPage() {
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [step, setStep] = useState(1);
 const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal' | 'apple'>('credit');
 const [orderPlaced, setOrderPlaced] = useState(false);
 const [orderNumber, setOrderNumber] = useState('');

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
 imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
 imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
 imageUrl: 'https://images.unsplash.com/photo-1587202372775-e9b6270af684?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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

 const handlePlaceOrder = async () => {
 setLoading(true);

 // Simulate order processing
 setTimeout(() => {
 setOrderNumber(`ORD-${Math.floor(Math.random() *1000000)}`);
 setOrderPlaced(true);
 setLoading(false);
 },2000);
 };

 if (loading && !orderPlaced) {
 return (
 <div className="flex justify-center items-center h-screen">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
 </div>
 );
 }

 if (orderPlaced) {
 return (
 <div className="container mx-auto px-4 py-16 text-center">
 <div className="max-w-md mx-auto">
 <motion.div
 initial={{ scale:0.5 }}
 animate={{ scale:1 }}
 transition={{ type:'spring', damping:10, stiffness:200 }}
 className="bg-green-50 rounded-full p-4 inline-block mb-6"
 >
 <CheckCircle className="h-16 w-16 text-green-500" />
 </motion.div>
 <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
 <p className="text-gray-600 mb-8">Thank you for your purchase. Your order number is <span className="font-medium text-indigo-600">{orderNumber}</span>.</p>
 <p className="text-gray-600 mb-8">You will receive an email confirmation shortly.</p>
 <Link
 to="/"
 className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 <ArrowLeft className="h-5 w-5 mr-2" />
 Return to Home
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 <div className="flex justify-center mb-8">
 <div className="inline-flex items-center space-x-8">
 {[1,2,3].map((item) => (
 <div key={item} className="flex flex-col items-center">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= item ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
 {step > item ? <CheckCircle className="h-5 w-5" /> : item}
 </div>
 <span className={`mt-2 text-sm font-medium ${step >= item ? 'text-indigo-600' : 'text-gray-500'}`}>
 {item ===1 ? 'Cart' : item ===2 ? 'Information' : 'Payment'}
 </span>
 </div>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Checkout Form */}
 <div className="lg:col-span-2 space-y-6">
 {step ===1 && (
 <motion.div
 initial={{ opacity:0, x:-20 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.3 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
 >
 <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>

 <form className="space-y-6">
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
 Email Address
 </label>
 <input
 id="email"
 type="email"
 placeholder="Enter your email"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="flex items-center">
 <input
 id="newsletter"
 type="checkbox"
 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
 />
 <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
 Keep me updated with news and offers
 </label>
 </div>

 <button
 type="button"
 onClick={() => setStep(2)}
 className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 Continue to Shipping
 </button>
 </form>
 </motion.div>
 )}

 {step ===2 && (
 <motion.div
 initial={{ opacity:0, x:-20 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.3 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
 >
 <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>

 <form className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
 First Name
 </label>
 <input
 id="firstName"
 type="text"
 placeholder="First Name"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
 Last Name
 </label>
 <input
 id="lastName"
 type="text"
 placeholder="Last Name"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>

 <div>
 <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
 Address
 </label>
 <input
 id="address"
 type="text"
 placeholder="Street Address"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div>
 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
 City
 </label>
 <input
 id="city"
 type="text"
 placeholder="City"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
 State/Province
 </label>
 <input
 id="state"
 type="text"
 placeholder="State"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
 ZIP/Postal Code
 </label>
 <input
 id="zip"
 type="text"
 placeholder="ZIP/Postal Code"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>

 <div>
 <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
 Country
 </label>
 <select
 id="country"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 >
 <option value="">Select Country</option>
 <option value="US">United States</option>
 <option value="CA">Canada</option>
 <option value="UK">United Kingdom</option>
 <option value="AU">Australia</option>
 </select>
 </div>

 <div className="flex items-center">
 <input
 id="saveInfo"
 type="checkbox"
 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
 />
 <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
 Save this information for next time
 </label>
 </div>

 <div className="flex justify-between mt-6">
 <button
 type="button"
 onClick={() => setStep(1)}
 className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
 >
 Return to Information
 </button>
 <button
 type="button"
 onClick={() => setStep(3)}
 className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 >
 Continue to Payment
 </button>
 </div>
 </form>
 </motion.div>
 )}

 {step ===3 && (
 <motion.div
 initial={{ opacity:0, x:-20 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.3 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
 >
 <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>

 <div className="space-y-4 mb-8">
 <div
 onClick={() => setPaymentMethod('credit')}
 className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'credit' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center">
 <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
 <span className="text-sm font-medium text-gray-700">Credit Card</span>
 </div>
 {paymentMethod === 'credit' && (
 <CheckCircle className="h-5 w-5 text-indigo-600" />
 )}
 </div>
 </div>

 <div
 onClick={() => setPaymentMethod('paypal')}
 className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center">
 <img
 src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
 alt="PayPal"
 className="h-6 mr-3"
 />
 <span className="text-sm font-medium text-gray-700">PayPal</span>
 </div>
 {paymentMethod === 'paypal' && (
 <CheckCircle className="h-5 w-5 text-indigo-600" />
 )}
 </div>
 </div>

 <div
 onClick={() => setPaymentMethod('apple')}
 className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'apple' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center">
 <img
 src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
 alt="Apple Pay"
 className="h-6 mr-3"
 />
 <span className="text-sm font-medium text-gray-700">Apple Pay</span>
 </div>
 {paymentMethod === 'apple' && (
 <CheckCircle className="h-5 w-5 text-indigo-600" />
 )}
 </div>
 </div>
 </div>

 <form className="space-y-6">
 {paymentMethod === 'credit' && (
 <div className="space-y-4">
 <div>
 <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
 Card Number
 </label>
 <input
 id="cardNumber"
 type="text"
 placeholder="1234123412341234"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
 Expiration Date
 </label>
 <input
 id="expiry"
 type="text"
 placeholder="MM/YY"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
 CVV
 </label>
 <input
 id="cvv"
 type="text"
 placeholder="123"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>

 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
 Name on Card
 </label>
 <input
 id="name"
 type="text"
 placeholder="Full Name"
 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>
 )}

 <div className="flex items-center">
 <input
 id="saveCard"
 type="checkbox"
 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
 />
 <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
 Save this card for future purchases
 </label>
 </div>

 <div className="flex justify-between mt-6">
 <button
 type="button"
 onClick={() => setStep(2)}
 className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
 >
 Return to Shipping
 </button>
 <button
 type="button"
 onClick={handlePlaceOrder}
 disabled={loading}
 className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <svg
  className="animate-spin h-5 w-5 mx-auto text-white"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  ></circle>
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  ></path>
</svg>

 ) : (
 'Place Order'
 )}
 </button>
 </div>
 </form>
 </motion.div>
 )}
 </div>

 {/* Order Summary */}
 <div className="space-y-6">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

 <div className="space-y-4">
 {cartItems.map((item) => (
 <div key={item.id} className="flex items-center">
 <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
 <img
 src={item.product.imageUrl}
 alt={item.product.name}
 className="w-full h-full object-contain p-1"
 />
 </div>
 <div className="ml-4 flex-1">
 <h3 className="text-sm font-medium text-gray-800">{item.product.name}</h3>
 <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
 </div>
 <div className="text-sm font-medium text-gray-800">
 ${(item.product.price * item.quantity).toFixed(2)}
 </div>
 </div>
 ))}

 <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
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

 <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
 <span className="text-lg font-bold text-gray-800">Total</span>
 <span className="text-lg font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h3 className="text-lg font-medium text-gray-800 mb-4">Need Help?</h3>
 <p className="text-gray-60 mb-4">Call us at (123)456-7890 or email support@shopsavvy.com</p>
 <p className="text-gray-600">We're available24/7 to assist you with your purchase.</p>
 </div>
 </div>
 </div>
 </div>
 );
}