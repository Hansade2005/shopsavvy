import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

interface NavItem {
 label: string;
 path: string;
 icon: React.ReactNode;
 subItems?: NavItem[];
}

const navItems: NavItem[] = [
 {
 label: 'Dashboard',
 path: '/admin/dashboard',
 icon: <LayoutDashboard className="h-5 w-5" />
 },
 {
 label: 'Products',
 path: '/admin/products',
 icon: <ShoppingBag className="h-5 w-5" />,
 subItems: [
 { label: 'All Products', path: '/admin/products' },
 { label: 'Add Product', path: '/admin/products/add' },
 { label: 'Categories', path: '/admin/products/categories' }
 ]
 },
 {
 label: 'Orders',
 path: '/admin/orders',
 icon: <Package className="h-5 w-5" />,
 subItems: [
 { label: 'All Orders', path: '/admin/orders' },
 { label: 'Pending Orders', path: '/admin/orders/pending' },
 { label: 'Completed Orders', path: '/admin/orders/completed' }
 ]
 },
 {
 label: 'Customers',
 path: '/admin/customers',
 icon: <Users className="h-5 w-5" />
 },
 {
 label: 'Settings',
 path: '/admin/settings',
 icon: <Settings className="h-5 w-5" />
 }
];

export function AdminLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [expandedItems, setExpandedItems] = useState<string[]>([]);
 const navigate = useNavigate();

 useEffect(() => {
 // Check if user is admin
 const isAdmin = localStorage.getItem('isAdmin');
 if (!isAdmin) {
 navigate('/admin/login');
 }
 }, [navigate]);

 const toggleExpand = (path: string) => {
 setExpandedItems(prev =>
 prev.includes(path)
 ? prev.filter(item => item !== path)
 : [...prev, path]
 );
 };

 const handleLogout = () => {
 localStorage.removeItem('isAdmin');
 navigate('/admin/login');
 };

 return (
 <div className="flex h-screen bg-gray-50">
 {/* Sidebar */}
 <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
 <div className="flex flex-col h-full">
 {/* Sidebar Header */}
 <div className="flex items-center justify-between p-4 border-b border-gray-200">
 <Link to="/admin/dashboard" className="text-xl font-bold text-indigo-600">
 ShopSavvy Admin
 </Link>
 <button
 onClick={() => setSidebarOpen(false)}
 className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Navigation */}
 <nav className="flex-1 overflow-y-auto py-4 px-2">
 <ul className="space-y-1">
 {navItems.map((item) => (
 <li key={item.path}>
 {item.subItems ? (
 <div>
 <button
 onClick={() => toggleExpand(item.path)}
 className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${expandedItems.includes(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
 >
 <div className="flex items-center">
 {item.icon}
 <span className="ml-3">{item.label}</span>
 </div>
 {expandedItems.includes(item.path) ? (
 <ChevronUp className="h-4 w-4" />
 ) : (
 <ChevronDown className="h-4 w-4" />
 )}
 </button>

 {expandedItems.includes(item.path) && (
 <ul className="ml-6 mt-1 space-y-1">
 {item.subItems.map((subItem) => (
 <li key={subItem.path}>
 <Link
 to={subItem.path}
 className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
 >
 <span className="ml-3">{subItem.label}</span>
 </Link>
 </li>
 ))}
 </ul>
 )}
 </div>
 ) : (
 <Link
 to={item.path}
 className={`flex items-center px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
 >
 {item.icon}
 <span className="ml-3">{item.label}</span>
 </Link>
 )}
 </li>
 ))}
 </ul>
 </nav>

 {/* Logout Button */}
 <div className="p-4 border-t border-gray-200">
 <button
 onClick={handleLogout}
 className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
 >
 <LogOut className="h-5 w-5 mr-2" />
 Logout
 </button>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 flex flex-col overflow-hidden">
 {/* Top Bar */}
 <div className="bg-white shadow-sm border-b border-gray-200">
 <div className="flex items-center justify-between p-4">
 <button
 onClick={() => setSidebarOpen(true)}
 className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
 >
 <Menu className="h-6 w-6" />
 </button>
 <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
 <div className="flex items-center space-x-4">
 <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
 <span className="text-sm font-medium text-gray-600">A</span>
 </div>
 </div>
 </div>
 </div>

 {/* Page Content */}
 <main className="flex-1 overflow-y-auto p-6">
 <Outlet />
 </main>
 </div>
 </div>
 );
}