import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Package, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';


interface ProductForm {
  name: string;
  image_url: string;
  original_price: string;
  discounted_price: string;
  category: string;
  store_name: string;
  affiliate_link: string;
  is_featured: boolean;
  is_trending: boolean;
}

const initialForm: ProductForm = {
  name: '',
  image_url: '',
  original_price: '',
  discounted_price: '',
  category: '',
  store_name: '',
  affiliate_link: '',
  is_featured: false,
  is_trending: false,
};

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast.error('Access denied. Admin only.');
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const calculateDiscount = (original: number, discounted: number) => {
    return ((original - discounted) / original) * 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const original = parseFloat(form.original_price);
    const discounted = parseFloat(form.discounted_price);
    
    if (isNaN(original) || isNaN(discounted) || original <= 0 || discounted <= 0) {
      toast.error('Please enter valid prices');
      return;
    }

    if (discounted >= original) {
      toast.error('Discounted price must be less than original price');
      return;
    }

    const productData = {
      name: form.name,
      image_url: form.image_url,
      original_price: original,
      discounted_price: discounted,
      discount_percent: calculateDiscount(original, discounted),
      category: form.category,
      store_name: form.store_name,
      affiliate_link: form.affiliate_link,
      is_featured: form.is_featured,
      is_trending: form.is_trending,
    };

    if (editingId) {
      updateProduct.mutate({ id: editingId, ...productData }, {
        onSuccess: () => {
          setDialogOpen(false);
          setForm(initialForm);
          setEditingId(null);
        }
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setDialogOpen(false);
          setForm(initialForm);
        }
      });
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      image_url: product.image_url,
      original_price: product.original_price.toString(),
      discounted_price: product.discounted_price.toString(),
      category: product.category,
      store_name: product.store_name,
      affiliate_link: product.affiliate_link,
      is_featured: product.is_featured || false,
      is_trending: product.is_trending || false,
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stats = {
    total: products.length,
    totalValue: products.reduce((acc, p) => acc + p.discounted_price, 0),
    avgDiscount: products.length > 0 
      ? products.reduce((acc, p) => acc + p.discount_percent, 0) / products.length 
      : 0,
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - PriceHunt</title>
        <meta name="description" content="Manage products on PriceHunt admin panel." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your products and deals</p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setForm(initialForm);
                setEditingId(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL *</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Original Price *</Label>
                      <Input
                        id="original_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.original_price}
                        onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discounted_price">Discounted Price *</Label>
                      <Input
                        id="discounted_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.discounted_price}
                        onChange={(e) => setForm({ ...form, discounted_price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {form.original_price && form.discounted_price && (
                    <p className="text-sm text-success font-medium">
                      Discount: {calculateDiscount(parseFloat(form.original_price), parseFloat(form.discounted_price)).toFixed(1)}%
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Electronics"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_name">Store *</Label>
                      <Input
                        id="store_name"
                        value={form.store_name}
                        onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                        placeholder="Amazon"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliate_link">Affiliate Link *</Label>
                    <Input
                      id="affiliate_link"
                      type="url"
                      value={form.affiliate_link}
                      onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={form.is_featured}
                        onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_trending"
                        checked={form.is_trending}
                        onCheckedChange={(checked) => setForm({ ...form, is_trending: checked })}
                      />
                      <Label htmlFor="is_trending">Trending</Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary"
                    disabled={createProduct.isPending || updateProduct.isPending}
                  >
                    {(createProduct.isPending || updateProduct.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingId ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalValue)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Discount</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgDiscount.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products yet. Add your first product!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <span className="font-medium max-w-[200px] truncate">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{product.store_name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            <div>
                              <span className="font-medium">{formatPrice(product.discounted_price)}</span>
                              <span className="text-muted-foreground text-xs block line-through">
                                {formatPrice(product.original_price)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-success font-medium">
                              {Math.round(product.discount_percent)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
