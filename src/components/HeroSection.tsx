import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
 title?: string;
 subtitle?: string;
 ctaText?: string;
 ctaLink?: string;
 imageUrl?: string;
}

export function HeroSection({
 title = 'Discover Amazing Products',
 subtitle = 'Shop the latest trends and find what you need at unbeatable prices',
 ctaText = 'Shop Now',
 ctaLink = '/products',
 imageUrl = 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}: HeroSectionProps) {
 return (
 <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden">
 <div className="container mx-auto px-4 py-20 lg:py-32">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <motion.div
 initial={{ opacity:0, x:-50 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.8 }}
 className="space-y-6"
 >
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
 {title}
 </h1>
 <p className="text-xl md:text-2xl text-indigo-100 max-w-xl">
 {subtitle}
 </p>
 <div className="flex flex-col sm:flex-row gap-4">
 <Link
 to={ctaLink}
 className="flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors group"
 >
 <span>{ctaText}</span>
 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link
 to="/categories"
 className="flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
 >
 <ShoppingCart className="mr-2 h-5 w-5" />
 <span>Browse Categories</span>
 </Link>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity:0, x:50 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.8, delay:0.2 }}
 className="relative"
 >
 <div className="absolute inset-0 bg-indigo-700 rounded-3xl transform rotate-6 -z-10"></div>
 <img
 src={imageUrl}
 alt="Hero product"
 className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
 />
 </motion.div>
 </div>
 </div>

 {/* Decorative elements */}
 <div className="absolute bottom-0 left-0 w-full h-20 bg-white/10 backdrop-blur-sm"></div>
 <div className="absolute top-1/4 right-10 w-24 h-24 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
 <div className="absolute top-1/3 left-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
 </section>
 );
}