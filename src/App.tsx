import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { AdminLayout } from './components/AdminLayout';
import { AdminAuth } from './components/AdminAuth';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { ShopPage } from './pages/ShopPage';
import { ThemeProvider } from '@/hooks/useTheme';

function App() {
 return (
 <ThemeProvider>
 <Router>
 <div className="flex flex-col min-h-screen">
 <Routes>
 {/* Public Routes */}
 <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
 <Route path="/products/:id" element={<><Header /><ProductPage /><Footer /></>} />
 <Route path="/cart" element={<><Header /><CartPage /><Footer /></>} />
 <Route path="/checkout" element={<><Header /><CheckoutPage /><Footer /></>} />
 <Route path="/auth/:type" element={<><Header /><AuthPage /><Footer /></>} />
 <Route path="/shop" element={<><Header /><ShopPage /><Footer /></>} />

 {/* Admin Routes */}
 <Route path="/admin/login" element={<AdminAuth />} />
 <Route path="/admin" element={<AdminLayout />}>
 <Route index element={<AdminDashboardPage />} />
 <Route path="dashboard" element={<AdminDashboardPage />} />
 <Route path="products" element={<AdminProductsPage />} />
 {/* Add more admin routes as needed */}
 </Route>
 </Routes>
 </div>
 </Router>
 </ThemeProvider>
 );
}

export default App;