import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, ShieldCheck, Headphones, ChevronRight } from 'lucide-react';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { NewsletterSignup } from '@/components/NewsletterSignup';

interface Feature {
 icon: React.ReactNode;
 title: string;
 description: string;
}

const features: Feature[] = [
 {
 icon: <Truck className="h-8 w-8 text-indigo-600" />,
 title: 'Fast Delivery',
 description: 'Get your products delivered quickly with our efficient shipping system'
 },
 {
 icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />,
 title: 'Secure Payments',
 description: 'Shop with confidence using our secure payment gateway'
 },
 {
 icon: <Headphones className="h-8 w-8 text-indigo-600" />,
 title: '24/7 Support',
 description: 'Our customer support team is available around the clock'
 }
];

interface Testimonial {
 name: string;
 role: string;
 content: string;
 avatar: string;
 rating: number;
}

const testimonials: Testimonial[] = [
 {
 name: 'Sarah Johnson',
 role: 'Verified Buyer',
 content: 'I absolutely love the products I bought from ShopSavvy. The quality is amazing and the delivery was faster than expected. Highly recommended!',
 avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
 rating:5
 },
 {
 name: 'Michael Chen',
 role: 'Tech Enthusiast',
 content: 'As a tech enthusiast, I was impressed by the range of products available. The customer service was excellent and the products worked perfectly.',
 avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
 rating:4
 },
 {
 name: 'Emily Rodriguez',
 role: 'Fashion Lover',
 content: 'I found some amazing fashion items here that I didn't know existed. The prices are reasonable and the quality is top-notch. Will definitely shop here again.',
 avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
 rating:5
 }
];

const StarRating = ({ rating }: { rating: number }) => {
 const filledStars = Math.floor(rating);
 const hasHalfStar = rating %1 >=0.5;

 return (
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <span key={i} className="text-yellow-400 text-lg">
 {i < filledStars ? '★' : i === filledStars && hasHalfStar ? '★' : '☆'}
 </span>
 ))}
 </div>
 );
};

export function HomePage() {
 return (
 <div className="space-y-16">
 {/* Hero Section */}
 <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-32">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
 <motion.div
 initial={{ opacity:0, x:-50 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.5 }}
 className="space-y-6"
 >
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
 Discover Amazing Products at Great Prices
 </h1>
 <p className="text-xl md:text-2xl opacity-90">
 ShopSavvy offers the best selection of products with fast delivery and secure payments.
 </p>
 <div className="flex flex-col sm:flex-row gap-4">
 <Link
 to="/shop"
 className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
 >
 <ShoppingCart className="h-5 w-5 mr-2" />
 Shop Now
 </Link>
 <Link
 to="/products"
 className="inline-flex items-center justify-center px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
 >
 Learn More
 <ChevronRight className="h-5 w-5 ml-2" />
 </Link>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity:0, x:50 }}
 animate={{ opacity:1, x:0 }}
 transition={{ duration:0.5, delay:0.2 }}
 className="hidden md:block"
 >
 <img
 src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
 alt="Shopping"
 className="w-full h-auto rounded-xl shadow-2xl"
 />
 </motion.div>
 </div>
 </div>

 {/* Decorative elements */}
 <div className="absolute inset-0 overflow-hidden">
 <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
 <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
 </div>
 </section>

 {/* Features Section */}
 <section className="container mx-auto px-4">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {features.map((feature, index) => (
 <motion.div
 key={index}
 initial={{ opacity:0, y:20 }}
 whileInView={{ opacity:1, y:0 }}
 transition={{ duration:0.3, delay:index *0.1 }}
 viewport={{ once:true }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow"
 >
 <div className="flex justify-center mb-6">
 {feature.icon}
 </div>
 <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
 <p className="text-gray-600">{feature.description}</p>
 </motion.div>
 ))}
 </div>
 </section>

 {/* Featured Products */}
 <section className="container mx-auto px-4">
 <div className="flex justify-between items-center mb-8">
 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
 <Link
 to="/shop"
 className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
 >
 View All
 <ChevronRight className="h-4 w-4 ml-1" />
 </Link>
 </div>
 <FeaturedProducts />
 </section>

 {/* Categories Section */}
 <section className="bg-gray-50 py-16">
 <div className="container mx-auto px-4">
 <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">Shop by Category</h2>
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
 {[
 'Electronics',
 'Fashion',
 'Home & Garden',
 'Beauty',
 'Sports',
 'Toys'
 ].map((category, index) => (
 <motion.div
 key={index}
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
 >
 <div className="h-32 bg-gray-50 flex items-center justify-center">
 <img
 src={`https://source.unsplash.com/random/200x200/?${category}`}
 alt={category}
 className="h-full w-full object-cover"
 />
 </div>
 <div className="p-4 text-center">
 <h3 className="font-medium text-gray-800">{category}</h3>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Testimonials Section */}
 <section className="container mx-auto px-4">
 <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">What Our Customers Say</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {testimonials.map((testimonial, index) => (
 <motion.div
 key={index}
 initial={{ opacity:0, y:20 }}
 whileInView={{ opacity:1, y:0 }}
 transition={{ duration:0.3, delay:index *0.1 }}
 viewport={{ once:true }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
 >
 <div className="flex items-center mb-4">
 <StarRating rating={testimonial.rating} />
 </div>
 <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
 <div className="flex items-center">
 <img
 src={testimonial.avatar}
 alt={testimonial.name}
 className="h-12 w-12 rounded-full object-cover mr-4"
 />
 <div>
 <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
 <p className="text-sm text-gray-500">{testimonial.role}</p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* Newsletter Signup */}
 <NewsletterSignup />
 </div>
 );
}