export interface Product {
  id: string;
  name: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  discount_percent: number;
  category: string;
  store_name: string;
  affiliate_link: string;
  is_featured?: boolean;
  is_trending?: boolean;
  created_at: number;
}

export type SortOption = 'latest' | 'price-low' | 'price-high' | 'discount';

export interface ProductFilters {
  search: string;
  category: string;
  store: string;
  sort: SortOption;
}
