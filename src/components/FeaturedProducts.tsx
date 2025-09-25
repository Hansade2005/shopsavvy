import React from 'react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

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

interface ProductCardProps {
 product: Product;
 onQuickView: (product: Product) => void;
 onAddToCart: (product: Product) => void;
 onAddToWishlist: (product: Product) => void;
}

interface FeaturedProductsProps {
 title: string;
 products: Product[];
}

const featuredProducts: Product[] = [
 {
 id: '1',
 name: 'Wireless Headphones',
 description: 'Premium noise-cancelling wireless headphones with30-hour battery life',
 price:299.99,
 imageUrl: 'https://source.unsplash.com/random/400x400/?headphones',
 category: 'Electronics',
 rating:4.5,
 stock:25
 },
 {
 id: '2',
 name: 'Smart Watch',
 description: 'Advanced smartwatch with health tracking and fitness features',
 price:199.99,
 imageUrl: 'https://source.unsplash.com/random/400x400/?smartwatch',
 category: 'Electronics',
 rating:4.2,
 stock:18
 },
 {
 id: '3',
 name: 'Bluetooth Speaker',
 description: 'Portable wireless speaker with20W output and12-hour battery',
 price:89.99,
 imageUrl: 'https://source.unsplash.com/random/400x400/?speaker',
 category: 'Electronics',
 rating:4.7,
 stock:32
 },
 {
 id: '4',
 name: 'Wireless Earbuds',
 description: 'Compact wireless earbuds with touch controls and6-hour battery',
 price:129.99,
 imageUrl: 'https://source.unsplash.com/random/400x400/?earbuds',
 category: 'Electronics',
 rating:4.3,
 stock:45
 }
];

export function FeaturedProducts({ title = 'Featured Products', products = featuredProducts }: Partial<FeaturedProductsProps>) {
 const handleQuickView = (product: Product) => {
 console.log('Quick view:', product.name);
 };

 const handleAddToCart = (product: Product) => {
 console.log('Add to cart:', product.name);
 };

 const handleAddToWishlist = (product: Product) => {
 console.log('Add to wishlist:', product.name);
 };

 return (
 <div className="space-y-8">
 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {products.map((product) => (
 <motion.div
 key={product.id}
 initial={{ opacity:0, y:20 }}
 whileInView={{ opacity:1, y:0 }}
 transition={{ duration:0.3 }}
 viewport={{ once:true }}
 >
 <ProductCard
 product={product}
 onQuickView={handleQuickView}
 onAddToCart={handleAddToCart}
 onAddToWishlist={handleAddToWishlist}
 />
 </motion.div>
 ))}
 </div>
 </div>
 );
}