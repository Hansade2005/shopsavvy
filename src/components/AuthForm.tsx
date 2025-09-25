import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthFormProps {
 type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState<string | null>(null);
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);
 setSuccess(null);

 try {
 if (type === 'signup') {
 const { error } = await supabase.auth.signUp({
 email,
 password,
 options: {
 emailRedirectTo: `${window.location.origin}/auth/callback`
 }
 });
 if (error) throw error;
 setSuccess('Check your email for the confirmation link!');
 } else {
 const { error } = await supabase.auth.signInWithPassword({
 email,
 password,
 });
 if (error) throw error;
 navigate('/');
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : 'An error occurred');
 } finally {
 setLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
 >
 <h2 className="text-2xl font-bold text-center mb-6">
 {type === 'signup' ? 'Create Account' : 'Sign In'}
 </h2>

 {error && (
 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
 <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
 <span className="text-red-700">{error}</span>
 </div>
 )}

 {success && (
 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
 <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
 <span className="text-green-700">{success}</span>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
 Email
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

 <div>
 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
 Password
 </label>
 <input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="002424">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M412a880018-8V0C5.373005.373012h4zm25.291A7.9627.962001412H0c03.0421.1355.82437.938l3-2.647z"></path>
 </svg>
 ) : (
 type === 'signup' ? 'Sign Up' : 'Sign In'
 )}
 </button>
 </form>

 <div className="mt-4 text-center text-sm">
 {type === 'signup' ? (
 <p>
 Already have an account?{' '}
 <button
 onClick={() => navigate('/auth/login')}
 className="font-medium text-indigo-600 hover:text-indigo-500"
 >
 Sign in
 </button>
 </p>
 ) : (
 <p>
 Don't have an account?{' '}
 <button
 onClick={() => navigate('/auth/signup')}
 className="font-medium text-indigo-600 hover:text-indigo-500"
 >
 Sign up
 </button>
 </p>
 )}
 </div>
 </motion.div>
 );
}