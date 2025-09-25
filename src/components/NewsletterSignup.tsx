import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle2 } from 'lucide-react';

export function NewsletterSignup() {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);

 try {
 const { error } = await supabase
 .from('newsletter_subscribers')
 .insert([{ email }]);

 if (error) throw error;
 setSuccess(true);
 setEmail('');
 } catch (error) {
 console.error('Error subscribing to newsletter:', error);
 } finally {
 setLoading(false);
 }
 };

 return (
 <section className="py-16 bg-indigo-600 text-white">
 <div className="container mx-auto px-4">
 <div className="max-w-3xl mx-auto text-center">
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="flex justify-center mb-6"
 >
 <Mail className="h-12 w-12" />
 </motion.div>

 <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
 <p className="text-indigo-100 mb-8">Get the latest updates, exclusive offers, and product news delivered to your inbox.</p>

 {success ? (
 <motion.div
 initial={{ opacity:0, scale:0.9 }}
 animate={{ opacity:1, scale:1 }}
 className="bg-white text-indigo-600 p-6 rounded-lg shadow-lg flex flex-col items-center"
 >
 <CheckCircle2 className="h-12 w-12 mb-4" />
 <h3 className="text-xl font-bold mb-2">Thank You!</h3>
 <p className="text-center">You've successfully subscribed to our newsletter.</p>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
 <input
 type="email"
 placeholder="Your email address"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
 />
 <button
 type="submit"
 disabled={loading}
 className={`px-6 py-3 rounded-lg font-semibold transition-colors ${loading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="002424">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M412a880018-8V0C5.373005.373012h4zm25.291A7.9627.962001412H0c03.0421.1355.82437.938l3-2.647z"></path>
 </svg>
 ) : (
 'Subscribe'
 )}
 </button>
 </form>
 )}
 </div>
 </div>
 </section>
 );
}