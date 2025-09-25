import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
 id: string;
 name: string;
 avatar: string;
 content: string;
 rating: number;
}

interface TestimonialsProps {
 title: string;
 testimonials: Testimonial[];
}

export function Testimonials({ title, testimonials }: TestimonialsProps) {
 return (
 <section className="py-16 bg-white">
 <div className="container mx-auto px-4">
 <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {testimonials.map((testimonial, index) => (
 <motion.div
 key={testimonial.id}
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:index *0.1 }}
 className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
 >
 <div className="flex items-center mb-4">
 <img
 src={testimonial.avatar}
 alt={testimonial.name}
 className="w-12 h-12 rounded-full mr-4 object-cover"
 />
 <div>
 <h3 className="font-semibold">{testimonial.name}</h3>
 <div className="flex">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
 />
 ))}
 </div>
 </div>
 </div>
 <p className="text-gray-600 italic">"{testimonial.content}"</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}