import React from 'react';
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

interface ProductListProps {
 products: Product[];
 onQuickView: (productId: string) => void;
 onAddToCart: (productId: string) => void;
 onAddToWishlist: (productId: string) => void;
}

export function ProductList({
 products,
 onQuickView,
 onAddToCart,
 onAddToWishlist
}: ProductListProps) {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {products.map((product) => (
 <ProductCard
 key={product.id}
 product={product}
 onQuickView={onQuickView}
 onAddToCart={onAddToCart}
 onAddToWishlist={onAddToWishlist}
 />
 ))}
 </div>
 );
}