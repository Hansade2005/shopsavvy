import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

interface CartItem {
 id: string;
 name: string;
 price: number;
 quantity: number;
}

interface CheckoutFormProps {
 cartItems: CartItem[];
}

export function CheckoutForm({ cartItems }: CheckoutFormProps) {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [address, setAddress] = useState('');
 const [city, setCity] = useState('');
 const [postalCode, setPostalCode] = useState('');
 const [country, setCountry] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 // Create order in Supabase
 const { data: { user } } = await supabase.auth.getUser();

 const { data: order, error: orderError } = await supabase
 .from('orders')
 .insert([{
 user_id: user?.id,
 items: cartItems,
 total: cartItems.reduce((sum, item) => sum + item.price * item.quantity,0),
 status: 'pending',
 shipping_address: {
 name,
 email,
 address,
 city,
 postalCode,
 country
 }
 }])
 .select()
 .single();

 if (orderError) throw orderError;

 // Create Stripe checkout session
 const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

 const { data: session, error: sessionError } = await supabase
 .from('stripe_checkout_sessions')
 .insert([{
 order_id: order.id,
 user_id: user?.id
 }])
 .select()
 .single();

 if (sessionError) throw sessionError;

 const result = await stripe?.redirectToCheckout({
 sessionId: session.id
 });

 if (result?.error) throw result.error;
 } catch (err) {
 setError(err instanceof Error ? err.message : 'An error occurred during checkout');
 } finally {
 setLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
 >
 <div className="flex items-center mb-6">
 <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
 <h2 className="text-2xl font-bold">Secure Checkout</h2>
 </div>

 {error && (
 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
 <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
 <span className="text-red-700">{error}</span>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
 Full Name
 </label>
 <input
 id="name"
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
 Email Address
 </label>
 <input
 id="email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
 value={address}
 onChange={(e) => setAddress(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
 value={city}
 onChange={(e) => setCity(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
 Postal Code
 </label>
 <input
 id="postalCode"
 type="text"
 value={postalCode}
 onChange={(e) => setPostalCode(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <div>
 <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
 Country
 </label>
 <input
 id="country"
 type="text"
 value={country}
 onChange={(e) => setCountry(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>
 </div>

 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
 <div className="flex items-center">
 <Lock className="h-5 w-5 text-gray-500 mr-2" />
 <span className="text-sm text-gray-700">Secure Payment</span>
 </div>
 <span className="text-sm font-medium text-gray-900">
 Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity,0).toFixed(2)}
 </span>
 </div>

 <button
 type="submit"
 disabled={loading}
 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="002424">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M412a880018-8V0C5.373005.373012h4zm25.291A7.9627.962001412H0c03.0421.1355.82437.938l3-2.647z"></path>
 </svg>
 ) : (
 'Complete Purchase'
 )}
 </button>
 </form>
 </motion.div>
 );
}