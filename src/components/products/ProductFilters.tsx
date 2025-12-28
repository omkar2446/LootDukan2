import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ProductFilters as Filters, SortOption } from '@/types/product';
import { RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: Filters;
  categories: string[];
  stores: string[];
  onFilterChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
}

export function ProductFilters({ filters, categories, stores, onFilterChange, onReset }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl shadow-card">
      {/* Category Filter */}
      <div className="flex-1 min-w-[150px]">
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ category: value })}
        >
          <SelectTrigger className="bg-muted/50 border-0">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store Filter */}
      <div className="flex-1 min-w-[150px]">
        <Select
          value={filters.store}
          onValueChange={(value) => onFilterChange({ store: value })}
        >
          <SelectTrigger className="bg-muted/50 border-0">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store} value={store}>
                {store}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex-1 min-w-[150px]">
        <Select
          value={filters.sort}
          onValueChange={(value) => onFilterChange({ sort: value as SortOption })}
        >
          <SelectTrigger className="bg-muted/50 border-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="discount">Highest Discount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button variant="ghost" size="icon" onClick={onReset} title="Reset filters">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
