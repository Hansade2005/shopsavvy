import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Lock, User, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface AuthFormProps {
 type: 'login' | 'register';
}

function AuthForm({ type }: AuthFormProps) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name, setName] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const { signIn, signUp, isSupabaseConfigured } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 if (type === 'login') {
 const { error } = await signIn(email, password);
 if (error) throw error;
 navigate('/');
 } else {
 const { error } = await signUp(email, password);
 if (error) throw error;
 navigate('/');
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : 'An error occurred during authentication');
 } finally {
 setLoading(false);
 }
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-6">
 {!isSupabaseConfigured && (
 <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
 <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
 <span className="text-yellow-700 text-sm">Using fallback authentication - Supabase not configured</span>
 </div>
 )}

 {error && (
 <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
 <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
 <span className="text-red-700">{error}</span>
 </div>
 )}

 {type === 'register' && (
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
 Full Name
 </label>
 <div className="relative">
 <input
 id="name"
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 required
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
 </div>
 </div>
 )}

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
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 type === 'login' ? 'Sign In' : 'Create Account'
 )}
 </button>
 </form>
 );
}

export function AuthPage() {
 const { type } = useParams<{ type: 'login' | 'register' }>();
 const navigate = useNavigate();

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
 <h1 className="text-2xl font-bold text-gray-800">
 {type === 'login' ? 'Sign In' : 'Create Account'}
 </h1>
 <p className="text-gray-500 mt-1">
 {type === 'login' ? 'Welcome back! Please enter your details.' : 'Join us today! Create your account.'}
 </p>
 </div>

 <AuthForm type={type || 'login'} />

 <div className="mt-6 text-center">
 {type === 'login' ? (
 <p className="text-sm text-gray-600">
 Don't have an account?
 <button
 onClick={() => navigate('/auth/register')}
 className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium"
 >
 Sign up
 </button>
 </p>
 ) : (
 <p className="text-sm text-gray-600">
 Already have an account?
 <button
 onClick={() => navigate('/auth/login')}
 className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium"
 >
 Sign in
 </button>
 </p>
 )}
 </div>

 <div className="mt-4 text-center">
 <button className="text-sm text-gray-500 hover:text-gray-700">
 Forgot password?
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 );
}