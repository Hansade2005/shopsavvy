import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Calendar, DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface SearchFilters {
 location: string;
 minPrice: number;
 maxPrice: number;
 bedrooms: number;
 propertyType: string;
 moveInDate?: Date;
 amenities: string[];
}

export function PropertySearch({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
 const [filters, setFilters] = useState<SearchFilters>({
 location: '',
 minPrice:0,
 maxPrice:1000000,
 bedrooms:1,
 propertyType: 'all',
 amenities: []
 });

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 onSearch(filters);
 };

 const toggleAmenity = (amenity: string) => {
 setFilters(prev => ({
 ...prev,
 amenities: prev.amenities.includes(amenity)
 ? prev.amenities.filter(a => a !== amenity)
 : [...prev.amenities, amenity]
 }));
 };

 return (
 <div className="bg-white rounded-lg shadow-md p-6 mb-8">
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="relative">
 <Input
 placeholder="Enter city, neighborhood, or address"
 value={filters.location}
 onChange={(e) => setFilters({ ...filters, location: e.target.value })}
 className="pl-10"
 />
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
 </div>

 <Select
 value={filters.propertyType}
 onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
 >
 <SelectTrigger>
 <SelectValue placeholder="Property Type" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Types</SelectItem>
 <SelectItem value="house">House</SelectItem>
 <SelectItem value="apartment">Apartment</SelectItem>
 <SelectItem value="condo">Condo</SelectItem>
 <SelectItem value="land">Land</SelectItem>
 <SelectItem value="townhouse">Townhouse</SelectItem>
 <SelectItem value="duplex">Duplex</SelectItem>
 </SelectContent>
 </Select>

 <div className="flex items-center space-x-2">
 <Filter className="text-gray-400" />
 <span className="text-sm font-medium">Filters</span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Price Range
 </label>
 <div className="flex items-center space-x-4">
 <Input
 type="number"
 placeholder="Min"
 value={filters.minPrice}
 onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
 className="w-24"
 />
 <span className="text-gray-500">to</span>
 <Input
 type="number"
 placeholder="Max"
 value={filters.maxPrice}
 onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
 className="w-24"
 />
 </div>
 <Slider
 min={0}
 max={1000000}
 step={50000}
 value={[filters.minPrice, filters.maxPrice]}
 onValueChange={(value) => setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] })}
 className="mt-4"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Bedrooms
 </label>
 <div className="flex space-x-2">
 {[1,2,3,4,5].map((bed) => (
 <Button
 key={bed}
 type="button"
 variant={filters.bedrooms === bed ? 'default' : 'outline'}
 onClick={() => setFilters({ ...filters, bedrooms: bed })}
 className="w-10 h-10 rounded-full"
 >
 {bed}
 </Button>
 ))}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Move-in Date
 </label>
 <Popover>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 className={`w-full justify-start text-left font-normal ${!filters.moveInDate && 'text-muted-foreground'}`}
 >
 <Calendar className="mr-2 h-4 w-4" />
 {filters.moveInDate ? format(filters.moveInDate, 'PPP') : <span>Pick a date</span>}
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-auto p-0">
 <CalendarComponent
 mode="single"
 selected={filters.moveInDate}
 onSelect={(date) => setFilters({ ...filters, moveInDate: date })} initialFocus
 />
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Amenities
 </label>
 <div className="flex flex-wrap gap-2">
 {['Pool', 'Garage', 'Gym', 'WiFi', 'Parking', 'AC'].map((amenity) => (
 <Button
 key={amenity}
 type="button"
 variant={filters.amenities.includes(amenity) ? 'default' : 'outline'}
 size="sm"
 onClick={() => toggleAmenity(amenity)}
 >
 {amenity}
 </Button>
 ))}
 </div>
 </div>
 </div>

 <Button type="submit" className="w-full md:w-auto">
 Search Properties
 </Button>
 </form>
 </div>
 );
}