import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProducts, useCategories, useStores } from '@/hooks/useProducts';
import { ProductFilters as Filters } from '@/types/product';
import { Helmet } from 'react-helmet-async';

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  store: 'all',
  sort: 'latest',
};

export default function Index() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  
  const { data: products = [], isLoading } = useProducts(filters);
  const { data: categories = [] } = useCategories();
  const { data: stores = [] } = useStores();

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <>
      <Helmet>
        <title>lootdukan - Compare Prices Across Amazon, Flipkart & More</title>
        <meta name="description" content="Find the best deals and lowest prices. Compare products across Amazon, Flipkart, Myntra and more. Save money on every purchase with PriceHunt." />
        <meta name="keywords" content="price comparison,Loot,lootdukan,dukaan,dukan,store,amazon,lootdele,best price,best deals, amazon deals, flipkart offers, online shopping, discount finder" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1">
          <HeroSection />
          
          <section className="container py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Today's Best Deals
                </h2>
                <p className="text-muted-foreground mt-1">
                  {products.length} products found
                </p>
              </div>
            </div>

            <ProductFilters
              filters={filters}
              categories={categories}
              stores={stores}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />

            <div className="mt-8">
              <ProductGrid products={products} loading={isLoading} />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
