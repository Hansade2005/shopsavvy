import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter } from 'lucide-react';

interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  propertyType: string;
}

export function PropertySearch({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: 1,
    propertyType: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
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
              {[1, 2, 3, 4, 5].map((bed) => (
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

        <Button type="submit" className="w-full md:w-auto">
          Search Properties
        </Button>
      </form>
    </div>
  );
}