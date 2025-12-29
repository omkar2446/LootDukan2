import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
   const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
           <img src="afavicon.ico" alt="" />
          </div>
          <span className="hidden font-display text-xl font-bold text-foreground sm:inline-block">
            LootDukan
          </span>
        </Link>

        {/* Search Bar - Desktop */}
       <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                onSearch?.(value); // 🔥 LIVE SEARCH
              }}
              className="pl-10"
            />
          </div>
        </div>

          </div>
      

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Admin Panel
              </Button>
            </Link>
          )}
          
         

          {/* Mobile Menu */}
          <Sheet>
            <form
 
  className="flex flex-1 max-w-full md:max-w-md"
>
  
</form>

            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <form
 
  className="flex flex-1 max-w-full md:max-w-md"
>
  <div className="relative w-full">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      type="search"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
    />
  </div>
</form>

                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="w-full">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                
               
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      
    </header>
  );
}
