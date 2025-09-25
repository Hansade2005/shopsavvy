import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
 label: string;
 path: string;
}

const footerLinks: FooterLink[] = [
 { label: 'About Us', path: '/about' },
 { label: 'Contact', path: '/contact' },
 { label: 'FAQ', path: '/faq' },
 { label: 'Shipping', path: '/shipping' },
 { label: 'Returns', path: '/returns' },
 { label: 'Privacy Policy', path: '/privacy' },
 { label: 'Terms of Service', path: '/terms' },
];

interface SocialLink {
 icon: React.ReactNode;
 url: string;
 label: string;
}

const socialLinks: SocialLink[] = [
 {
 icon: <Facebook className="h-5 w-5" />,
 url: 'https://facebook.com',
 label: 'Facebook'
 },
 {
 icon: <Twitter className="h-5 w-5" />,
 url: 'https://twitter.com',
 label: 'Twitter'
 },
 {
 icon: <Instagram className="h-5 w-5" />,
 url: 'https://instagram.com',
 label: 'Instagram'
 },
 {
 icon: <Linkedin className="h-5 w-5" />,
 url: 'https://linkedin.com',
 label: 'LinkedIn'
 },
];

export function Footer() {
 return (
 <footer className="bg-gray-900 text-white">
 <div className="container mx-auto px-4 py-12">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
 {/* About Section */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.1 }}
 className="space-y-4"
 >
 <h3 className="text-xl font-bold text-indigo-400">ShopSavvy</h3>
 <p className="text-gray-300">
 Discover amazing products at unbeatable prices. ShopSavvy brings you the best selection of products from around the world, delivered to your doorstep.
 </p>

 <div className="flex space-x-4">
 {socialLinks.map((link, index) => (
 <motion.a
 key={link.url}
 href={link.url}
 target="_blank"
 rel="noopener noreferrer"
 initial={{ opacity:0, y:10 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.3, delay:index *0.1 }}
 className="p-2 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors"
 >
 {link.icon}
 </motion.a>
 ))}
 </div>
 </motion.div>

 {/* Quick Links */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.2 }}
 className="space-y-4"
 >
 <h3 className="text-xl font-bold text-indigo-400">Quick Links</h3>
 <ul className="space-y-2">
 {footerLinks.map((link) => (
 <li key={link.path}>
 <Link
 to={link.path}
 className="text-gray-300 hover:text-white transition-colors flex items-center"
 >
 <span className="mr-2">•</span>
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </motion.div>

 {/* Contact Info */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.3 }}
 className="space-y-4"
 >
 <h3 className="text-xl font-bold text-indigo-400">Contact Us</h3>
 <div className="space-y-3">
 <div className="flex items-start">
 <MapPin className="h-5 w-5 mr-3 mt-1 text-indigo-400" />
 <p className="text-gray-300">123 Commerce Street, Business City, BC12345</p>
 </div>

 <div className="flex items-center">
 <Phone className="h-5 w-5 mr-3 text-indigo-400" />
 <p className="text-gray-300">+1 (555)123-4567</p>
 </div>

 <div className="flex items-center">
 <Mail className="h-5 w-5 mr-3 text-indigo-400" />
 <p className="text-gray-300">support@shopsavvy.com</p>
 </div>
 </div>
 </motion.div>

 {/* Newsletter */}
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.4 }}
 className="space-y-4"
 >
 <h3 className="text-xl font-bold text-indigo-400">Newsletter</h3>
 <p className="text-gray-300">Subscribe to our newsletter for the latest updates and exclusive offers.</p>

 <form className="flex">
 <input
 type="email"
 placeholder="Your email address"
 className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
 />
 <button
 type="submit"
 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors"
 >
 Subscribe
 </button>
 </form>
 </motion.div>
 </div>

 <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
 <p className="text-gray-400 text-sm mb-4 md:mb-0">
 © {new Date().getFullYear()} ShopSavvy. All rights reserved.
 </p>

 <div className="flex space-x-6">
 <img
 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg"
 alt="Visa"
 className="h-8 w-auto"
 />
 <img
 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg"
 alt="Mastercard"
 className="h-8 w-auto"
 />
 <img
 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg"
 alt="PayPal"
 className="h-8 w-auto"
 />
 <img
 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
 alt="Apple Pay"
 className="h-8 w-auto"
 />
 <img
 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
 alt="Google Pay"
 className="h-8 w-auto"
 />
 </div>
 </div>
 </div>
 </footer>
 );
}