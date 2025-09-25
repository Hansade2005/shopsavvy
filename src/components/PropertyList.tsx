import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Property {
 id: string;
 title: string;
 price: number;
 bedrooms: number;
 bathrooms: number;
 squareFeet: number;
 address: string;
 imageUrl: string;
 isFeatured?: boolean;
 isSaved?: boolean;
}

export function PropertyList({ properties }: { properties: Property[] }) {
 const [sortBy, setSortBy] = React.useState<'price-asc' | 'price-desc' | 'date-asc' | 'date-desc'>('price-asc');

 const sortedProperties = React.useMemo(() => {
 const sorted = [...properties];

 switch (sortBy) {
 case 'price-asc':
 return sorted.sort((a, b) => a.price - b.price);
 case 'price-desc':
 return sorted.sort((a, b) => b.price - a.price);
 case 'date-asc':
 return sorted.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
 case 'date-desc':
 return sorted.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
 default:
 return sorted;
 }
 }, [properties, sortBy]);

 return (
 <div>
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-semibold">Available Properties</h2>
 <div className="flex items-center space-x-2">
 <span className="text-sm text-gray-500">Sort by:</span>
 <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
 <SelectTrigger className="w-[180px]">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="price-asc">Price: Low to High</SelectItem>
 <SelectItem value="price-desc">Price: High to Low</SelectItem>
 <SelectItem value="date-asc">Newest First</SelectItem>
 <SelectItem value="date-desc">Oldest First</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {sortedProperties.map((property) => (
 <PropertyCard key={property.id} property={property} />
 ))}
 </div>
 </div>
 );
}