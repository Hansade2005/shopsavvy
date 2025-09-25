import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Hardcoded admin credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
 email: 'admin@shopsavvy.com',
 password: 'Admin@1234'
};

export function AdminAuth() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const { signIn, isSupabaseConfigured } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 // Simple validation
 if (!email || !password) {
 setError('Please enter both email and password');
 setLoading(false);
 return;
 }

 try {
 if (isSupabaseConfigured) {
 // Use Supabase authentication
 const { error } = await signIn(email, password);

 if (error) throw error;

 // In a real app, you would check if the user is an admin
 // For this example, we'll just check the email
 if (email === ADMIN_CREDENTIALS.email) {
 localStorage.setItem('isAdmin', 'true');
 navigate('/admin/dashboard');
 } else {
 setError('You do not have admin privileges');
 }
 } else {
 // Use fallback authentication
 if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
 localStorage.setItem('isAdmin', 'true');
 navigate('/admin/dashboard');
 } else {
 setError('Invalid email or password');
 }
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : 'An error occurred during sign in');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
 >
 <div className="p-8">
 <div className="flex flex-col items-center mb-8">
 <div className="bg-indigo-100 p-3 rounded-full mb-4">
 <Lock className="h-8 w-8 text-indigo-600" />
 </div>
 <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
 <p className="text-gray-500 mt-1">Secure access to ShopSavvy admin panel</p>
 {!isSupabaseConfigured && (
 <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
 <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
 <span className="text-yellow-700 text-sm">Using fallback authentication - Supabase not configured</span>
 </div>
 )}
 </div>

 {error && (
 <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
 <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
 <span className="text-red-700">{error}</span>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-6">
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
 Email Address
 </label>
 <div className="relative">
 <input
 id="email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 />
 <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
 </div>
 </div>

 <div>
 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
 Password
 </label>
 <div className="relative">
 <input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 />
 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="002424">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M412a880018-8V0C5.373005.373012h4zm25.291A7.9627.962001412H0c03.0421.1355.82437.938l3-2.647z"></path>
 </svg>
 ) : (
 'Sign In'
 )}
 </button>
 </form>

 <div className="mt-6 text-center">
 <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
 Forgot password?
 </a>
 </div>
 </div>
 </motion.div>
 </div>
 );
}