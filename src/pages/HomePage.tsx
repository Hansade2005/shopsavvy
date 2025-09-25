import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Testimonials } from '@/components/Testimonials';
import { NewsletterSignup } from '@/components/NewsletterSignup';

interface Product {
 id: string;
 name: string;
 price: number;
 imageUrl: string;
 rating?: number;
}

interface Category {
 id: string;
 name: string;
 imageUrl: string;
}

interface Testimonial {
 id: string;
 name: string;
 avatar: string;
 content: string;
 rating: number;
}

export function HomePage() {
 const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
 const [categories, setCategories] = useState<Category[]>([]);
 const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [productsRes, categoriesRes, testimonialsRes] = await Promise.all([
 supabase.from('products').select('*').eq('featured', true).limit(8),
 supabase.from('categories').select('*').limit(8),
 supabase.from('testimonials').select('*').limit(4)
 ]);

 setFeaturedProducts(productsRes.data || []);
 setCategories(categoriesRes.data || []);
 setTestimonials(testimonialsRes.data || []);
 } catch (error) {
 console.error('Error fetching data:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, []);

 if (loading) {
 return (
 <div className="flex justify-center items-center h-screen">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
 </div>
 );
 }

 return (
 <div className="min-h-screen">
 <HeroSection />

 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.2 }}
 >
 <CategorySection title="Shop by Category" categories={categories} />
 </motion.div>

 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.4 }}
 >
 <FeaturedProducts title="Featured Products" products={featuredProducts} />
 </motion.div>

 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.6 }}
 >
 <Testimonials title="What Our Customers Say" testimonials={testimonials} />
 </motion.div>

 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.8 }}
 >
 <NewsletterSignup />
 </motion.div>
 </div>
 );
}