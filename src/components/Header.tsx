import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, User, Menu, X, Home, ShoppingBag, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Cart } from './Cart';

interface NavItem {
 label: string;
 path: string;
 icon: React.ReactNode;
}

const navItems: NavItem[] = [
 { label: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
 { label: 'Shop', path: '/products', icon: <ShoppingBag className="h-5 w-5" /> },
 { label: 'Categories', path: '/categories', icon: <ShoppingBag className="h-5 w-5" /> },
 { label: 'Wishlist', path: '/wishlist', icon: <Heart className="h-5 w-5" /> },
];

interface MobileMenuProps {
 isOpen: boolean;
 onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
 const { user, signOut } = useAuth();
 const location = useLocation();

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity:0, x:'100%' }}
 animate={{ opacity:1, x:0 }}
 exit={{ opacity:0, x:'100%' }}
 transition={{ type:'spring', damping:25, stiffness:300 }}
 className="fixed inset-0 bg-white z-50 flex flex-col p-6"
 >
 <div className="flex justify-between items-center mb-8">
 <Link to="/" className="text-2xl font-bold text-indigo-600" onClick={onClose}>
 ShopSavvy
 </Link>
 <button
 onClick={onClose}
 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
 >
 <X className="h-6 w-6" />
 </button>
 </div>

 <nav className="flex-1">
 <ul className="space-y-4">
 {navItems.map((item) => (
 <li key={item.path}>
 <Link
 to={item.path}
 onClick={onClose}
 className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}
 >
 {item.icon}
 <span className="ml-3">{item.label}</span>
 </Link>
 </li>
 ))}

 {user ? (
 <li>
 <button
 onClick={() => {
 signOut();
 onClose();
 }}
 className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
 >
 <LogOut className="h-5 w-5" />
 <span className="ml-3">Sign Out</span>
 </button>
 </li>
 ) : (
 <li>
 <Link
 to="/auth/login"
 onClick={onClose}
 className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
 >
 <UserIcon className="h-5 w-5" />
 <span className="ml-3">Sign In</span>
 </Link>
 </li>
 )}
 </ul>
 </nav>

 <div className="mt-8">
 <div className="relative">
 <input
 type="text"
 placeholder="Search products..."
 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 />
 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}

interface UserMenuProps {
 isOpen: boolean;
 onClose: () => void;
}

function UserMenu({ isOpen, onClose }: UserMenuProps) {
 const { user, signOut } = useAuth();

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity:0, scale:0.95 }}
 animate={{ opacity:1, scale:1 }}
 exit={{ opacity:0, scale:0.95 }}
 transition={{ duration:0.2 }}
 className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 py-2 border border-gray-100"
 >
 {user ? (
 <div className="px-4 py-3 border-b border-gray-100">
 <p className="text-sm font-medium text-gray-900">{user.email}</p>
 </div>
 ) : null}

 <div className="py-1">
 {user ? (
 <button
 onClick={() => {
 signOut();
 onClose();
 }}
 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
 >
 Sign Out
 </button>
 ) : (
 <Link
 to="/auth/login"
 onClick={onClose}
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
 >
 Sign In
 </Link>
 )}

 <Link
 to="/profile"
 onClick={onClose}
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
 >
 Profile
 </Link>

 <Link
 to="/orders"
 onClick={onClose}
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
 >
 Orders
 </Link>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}

export function Header() {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
 const [isScrolled, setIsScrolled] = useState(false);
 const location = useLocation();
 const { user } = useAuth();

 useEffect(() => {
 const handleScroll = () => {
 setIsScrolled(window.scrollY >10);
 };

 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return (
 <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
 <div className="container mx-auto px-4">
 <div className="flex items-center justify-between h-16">
 {/* Desktop Navigation */}
div className="hidden md:flex items-center space-x-8">
 <Link to="/" className="text-2xl font-bold text-indigo-600">
 ShopSavvy
 </Link>

 <nav>
 <ul className="flex space-x-6">
 {navItems.map((item) => (
 <li key={item.path}>
 <Link
 to={item.path}
 className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
 >
 {item.icon}
 <span className="ml-2">{item.label}</span>
 </Link>
 </li>
 ))}
 </ul>
 </nav>
 </div>

 {/* Mobile Navigation */}
 <div className="md:hidden flex items-center">
 <button
 onClick={() => setIsMobileMenuOpen(true)}
 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
 >
 <Menu className="h-6 w-6" />
 </button>
 </div>

 {/* Logo for mobile */}
 <div className="md:hidden">
 <Link to="/" className="text-xl font-bold text-indigo-600">
 ShopSavvy
 </Link>
 </div>

 {/* Search and Cart */}
 <div className="hidden md:flex items-center space-x-4">
 <div className="relative">
 <input
 type="text"
 placeholder="Search products..."
 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
 />
 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
 </div>

 <Cart />

 {/* User Profile */}
 <div className="relative">
 <button
 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
 >
 {user ? (
 <img
 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=random`}
 alt="User"
 className="h-8 w-8 rounded-full object-cover"
 />
 ) : (
 <User className="h-6 w-6" />
 )}
 </button>

 <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
 </div>
 </div>

 {/* Mobile Cart and User */}
 <div className="md:hidden flex items-center space-x-4">
 <Cart />

 <div className="relative">
 <button
 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
 >
 {user ? (
 <img
 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=random`}
 alt="User"
 className="h-8 w-8 rounded-full object-cover"
 />
 ) : (
 <User className="h-6 w-6" />
 )}
 </button>

 <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
 </div>
 </div>
 </div>

 {/* Bottom Tab Navigator for Mobile */}
 <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
 <div className="flex justify-around items-center h-16">
 {navItems.map((item) => (
 <Link
 key={item.path}
 to={item.path}
 className={`flex flex-col items-center justify-center flex-1 ${location.pathname === item.path ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
 >
 {item.icon}
 <span className="text-xs mt-1">{item.label}</span>
 </Link>
 ))}
 </div>
 </div>

 {/* Mobile Menu */}
 <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
 </div>
 </header>
 );
}