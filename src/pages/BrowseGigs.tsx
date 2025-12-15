import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Star, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { gigApi, categoryApi, userApi } from '@/services/api';
import type { Gig, Category } from '@/types/types';

export default function BrowseGigs() {
  const [searchParams] = useSearchParams();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    const cats = categoryApi.getAll();
    setCategories(cats);

    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    loadGigs(categoryParam || undefined, searchParam || undefined);
  }, [searchParams]);

  const loadGigs = (categoryId?: string, search?: string) => {
    const filters: any = {};
    
    if (categoryId && categoryId !== 'all') {
      filters.categoryId = categoryId;
    }
    
    if (search) {
      filters.search = search;
    }

    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filters.minPrice = priceRange[0];
      filters.maxPrice = priceRange[1];
    }

    if (minRating > 0) {
      filters.minRating = minRating;
    }

    let results = gigApi.getAll(filters);

    if (sortBy === 'price_low') {
      results.sort((a, b) => a.pricing[0].price - b.pricing[0].price);
    } else if (sortBy === 'price_high') {
      results.sort((a, b) => b.pricing[0].price - a.pricing[0].price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      results.sort((a, b) => b.orders - a.orders);
    }

    setGigs(results);
  };

  const handleFilterChange = () => {
    loadGigs(selectedCategory !== 'all' ? selectedCategory : undefined, searchParams.get('search') || undefined);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, priceRange, minRating, sortBy]);

  const getSeller = (sellerId: string) => {
    return userApi.getById(sellerId);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.filter(c => !c.parentId).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
        <Slider
          min={0}
          max={1000}
          step={50}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Rating</Label>
        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="4.8">4.8+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
          <p className="text-muted-foreground">{gigs.length} services available</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden xl:flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="xl:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="hidden xl:block">
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3">
          {gigs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No services found matching your criteria</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gigs.map((gig) => {
                const seller = getSeller(gig.sellerId);
                return (
                  <Link key={gig.id} to={`/gig/${gig.id}`}>
                    <Card className="hover:shadow-lg transition-all h-full">
                      <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={gig.images[0]}
                            alt={gig.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          {gig.isFeatured && (
                            <Badge className="absolute top-2 right-2 bg-accent">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={seller?.avatar} />
                            <AvatarFallback>{seller?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{seller?.name}</span>
                          {seller?.sellerLevel === 'pro' && (
                            <Badge variant="secondary" className="text-xs">Pro</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {gig.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-semibold">{gig.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({gig.reviewCount})</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-sm text-muted-foreground">Starting at</span>
                          <span className="text-lg font-bold">${gig.pricing[0].price}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
