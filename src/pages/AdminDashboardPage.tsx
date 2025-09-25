import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface StatsCardProps {
 title: string;
 value: string | number;
 change?: number;
 icon: React.ReactNode;
 color: string;
}

function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
 return (
 <motion.div
 whileHover={{ scale:1.03 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
 >
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-gray-500">{title}</p>
 <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
 {change !== undefined && (
 <div className={`flex items-center mt-2 ${change >=0 ? 'text-green-600' : 'text-red-600'}`}>
 {change >=0 ? (
 <TrendingUp className="h-4 w-4 mr-1" />
 ) : (
 <TrendingDown className="h-4 w-4 mr-1" />
 )}
 <span className="text-sm font-medium">{Math.abs(change)}%</span>
 </div>
 )}
 </div>
 <div className={`p-3 rounded-lg ${color}`}>
 {icon}
 </div>
 </div>
 </motion.div>
 );
}

interface Order {
 id: string;
 order_number: string;
 status: string;
 total_amount: number;
 created_at: string;
}

interface Product {
 id: string;
 name: string;
 price: number;
 stock_quantity: number;
}

export function AdminDashboardPage() {
 const [stats, setStats] = useState({
 totalProducts:0,
 totalOrders:0,
 totalRevenue:0,
 totalCustomers:0,
 revenueChange:0,
 ordersChange:0
 });
 const [recentOrders, setRecentOrders] = useState<Order[]>([]);
 const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchData = async () => {
 try {
 setLoading(true);

 // Fetch statistics
 const [productsRes, ordersRes, customersRes, revenueRes] = await Promise.all([
 supabase.from('products').select('id', { count: 'exact' }),
 supabase.from('orders').select('id', { count: 'exact' }),
 supabase.from('users').select('id', { count: 'exact' }),
 supabase.from('orders').select('total_amount').eq('status', 'completed')
 ]);

 // Calculate total revenue
 const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + order.total_amount,0) ||0;

 // Fetch recent orders
 const { data: ordersData } = await supabase
 .from('orders')
 .select('id, order_number, status, total_amount, created_at')
 .order('created_at', { ascending: false })
 .limit(5);

 // Fetch low stock products
 const { data: productsData } = await supabase
 .from('products')
 .select('id, name, price, stock_quantity')
 .filter('stock_quantity', 'lt',10)
 .order('stock_quantity', { ascending: true })
 .limit(5);

 setStats({
 totalProducts: productsRes.count ||0,
 totalOrders: ordersRes.count ||0,
 totalRevenue,
 totalCustomers: customersRes.count ||0,
 revenueChange:12.5,
 ordersChange:8.2
 });

 setRecentOrders(ordersData || []);
 setLowStockProducts(productsData || []);
 } catch (error) {
 console.error('Error fetching dashboard data:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, []);

 if (loading) {
 return (
 <div className="flex justify-center items-center h-full">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
 </div>
 );
 }

 return (
 <div className="space-y-8">
 {/* Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatsCard
 title="Total Products"
 value={stats.totalProducts}
 icon={<ShoppingBag className="h-6 w-6 text-white" />}
 color="bg-indigo-500"
 />
 <StatsCard
 title="Total Orders"
 value={stats.totalOrders}
 change={stats.ordersChange}
 icon={<Package className="h-6 w-6 text-white" />}
 color="bg-blue-500"
 />
 <StatsCard
 title="Total Revenue"
 value={`$${stats.totalRevenue.toLocaleString()}`}
 change={stats.revenueChange}
 icon={<DollarSign className="h-6 w-6 text-white" />}
 color="bg-green-500"
 />
 <StatsCard
 title="Total Customers"
 value={stats.totalCustomers}
 icon={<Users className="h-6 w-6 text-white" />}
 color="bg-purple-500"
 />
 </div>

 {/* Recent Orders */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
 <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
 </div>

 {recentOrders.length ===0 ? (
 <div className="text-center py-12">
 <p className="text-gray-500">No recent orders found</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {recentOrders.map((order) => (
 <tr key={order.id}>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
 {order.order_number}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 {new Date(order.created_at).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
 {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 ${order.total_amount.toFixed(2)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
 <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Low Stock Products */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-semibold text-gray-800">Low Stock Products</h2>
 <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
 </div>

 {lowStockProducts.length ===0 ? (
 <div className="text-center py-12">
 <p className="text-gray-500">No low stock products found</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {lowStockProducts.map((product) => (
 <tr key={product.id}>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center">
 <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
 <ShoppingBag className="h-5 w-5 text-gray-400" />
 </div>
 <div className="ml-4">
 <div className="text-sm font-medium text-gray-900">{product.name}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
 ${product.price.toFixed(2)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity <5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
 {product.stock_quantity}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
 <button className="text-indigo-600 hover:text-indigo-900">Restock</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Quick Actions */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left"
 >
 <div className="flex items-center">
 <div className="p-3 rounded-lg bg-indigo-500">
 <ShoppingBag className="h-6 w-6 text-white" />
 </div>
 <div className="ml-4">
 <h3 className="text-lg font-medium text-gray-800">Add Product</h3>
 <p className="text-sm text-gray-500 mt-1">Add new product to inventory</p>
 </div>
 </div>
 </motion.button>

 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left"
 >
 <div className="flex items-center">
 <div className="p-3 rounded-lg bg-blue-500">
 <Package className="h-6 w-6 text-white" />
 </div>
 <div className="ml-4">
 <h3 className="text-lg font-medium text-gray-800">Process Orders</h3>
 <p className="text-sm text-gray-500 mt-1">Manage pending orders</p>
 </div>
 </div>
 </motion.button>

 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left"
 >
 <div className="flex items-center">
 <div className="p-3 rounded-lg bg-green-500">
 <DollarSign className="h-6 w-6 text-white" />
 </div>
 <div className="ml-4">
 <h3 className="text-lg font-medium text-gray-800">View Reports</h3>
 <p className="text-sm text-gray-500 mt-1">Generate sales reports</p>
 </div>
 </div>
 </motion.button>

 <motion.button
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.98 }}
 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left"
 >
 <div className="flex items-center">
 <div className="p-3 rounded-lg bg-purple-500">
 <Settings className="h-6 w-6 text-white" />
 </div>
 <div className="ml-4">
 <h3 className="text-lg font-medium text-gray-800">Store Settings</h3>
 <p className="text-sm text-gray-500 mt-1">Configure store settings</p>
 </div>
 </div>
 </motion.button>
 </div>
 </div>
 );
}