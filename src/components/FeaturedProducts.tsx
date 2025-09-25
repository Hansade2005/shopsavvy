import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';

interface Product {
 id: string;
 name: string;
 description: string;
 price: number;
 imageUrl: string;
 category: string;
 rating: number;
 stock: number;
}

interface FeaturedProductsProps {
 title: string;
 products: Product[];
}

export function FeaturedProducts({ title, products }: FeaturedProductsProps) {
 return (
 <section className="py-16 bg-gray-50">
 <div className="container mx-auto px-4">
 <div className="flex justify-between items-center mb-10">
 <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
 <Link
 to="/products"
 className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
 >
 View All
 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="002424" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M915"></path>
 </svg>
 </Link>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {products.map((product, index) => (
 <motion.div
 key={product.id}
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:index *0.1 }}
 >
 <ProductCard product={product} />
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}