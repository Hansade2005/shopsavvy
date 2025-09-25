import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Category {
 id: string;
 name: string;
 imageUrl: string;
}

interface CategorySectionProps {
 title: string;
 categories: Category[];
}

export function CategorySection({ title, categories }: CategorySectionProps) {
 return (
 <section className="py-12">
 <div className="container mx-auto px-4">
 <div className="flex justify-between items-center mb-8">
 <h2 className="text-2xl font-bold">{title}</h2>
 <Link
 to="/categories"
 className="text-indigo-600 hover:text-indigo-800 font-medium"
 >
 View All
 </Link>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {categories.map((category) => (
 <motion.div
 key={category.id}
 whileHover={{ scale:1.05 }}
 whileTap={{ scale:0.95 }}
 className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
 >
 <Link to={`/category/${category.id}`} className="block">
 <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
 <img
 src={category.imageUrl}
 alt={category.name}
 className="object-contain h-full w-full p-4"
 />
 </div>
 <div className="p-4 text-center">
 <h3 className="font-semibold text-lg">{category.name}</h3>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}