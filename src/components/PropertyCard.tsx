import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Bath, BedDouble, MapPin, Heart } from 'lucide-react';

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

export function PropertyCard({ property }: { property: Property }) {
 const [saved, setSaved] = React.useState(property.isSaved || false);

 const handleSave = () => {
 setSaved(!saved);
 // In a real app, you would call an API to save/unsave the property
 };

 return (
 <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
 <div className="relative">
 <img
 src={property.imageUrl}
 alt={property.title}
 className="w-full h-48 object-cover"
 />
 {property.isFeatured && (
 <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
 Featured
 </Badge>
 )}
 <Button
 variant="ghost"
 size="icon"
 className="absolute top-2 left-2 text-white hover:text-red-500 hover:bg-white/20"
 onClick={handleSave}
 >
 <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
 </Button>
 </div>
 <CardHeader>
 <CardTitle className="text-lg font-semibold">{property.title}</CardTitle>
 <div className="flex items-center text-sm text-gray-500">
 <MapPin className="w-4 h-4 mr-1" />
 <span>{property.address}</span>
 </div>
 </CardHeader>
 <CardContent>
 <div className="flex justify-between items-center mb-4">
 <span className="text-2xl font-bold text-primary">
 ${property.price.toLocaleString()}
 </span>
 <div className="flex space-x-4">
 <div className="flex items-center">
 <BedDouble className="w-5 h-5 mr-1 text-gray-500" />
 <span>{property.bedrooms}</span>
 </div>
 <div className="flex items-center">
 <Bath className="w-5 h-5 mr-1 text-gray-500" />
 <span>{property.bathrooms}</span>
 </div>
 <div className="flex items-center">
 <Home className="w-5 h-5 mr-1 text-gray-500" />
 <span>{property.squareFeet.toLocaleString()} sqft</span>
 </div>
 </div>
 </div>
 </CardContent>
 <CardFooter>
 <Button className="w-full">View Details</Button>
 </CardFooter>
 </Card>
 );
}