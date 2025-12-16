import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Search, TrendingUp, Shield, Clock, ArrowRight, Briefcase, ShoppingBag } from 'lucide-react';
import { gigApi, categoryApi, userApi } from '@/services/api';
import type { Gig, Category } from '@/types/types';

export default function Home() {
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const gigs = gigApi.getFeatured();
    setFeaturedGigs(gigs);

    const cats = categoryApi.getAll().filter(c => !c.parentId);
    setCategories(cats);
  }, []);

  const getSeller = (sellerId: string) => {
    return userApi.getById(sellerId);
  };

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              Find the Perfect <span className="text-primary">Freelance</span> Services
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground mb-8">
              Connect with talented professionals and get your projects done with quality and speed
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login/buyer')} className="text-lg px-8">
                Hire Freelancers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login/seller')} className="text-lg px-8">
                <Briefcase className="mr-2 h-5 w-5" />
                Offer Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/browse?category=${category.id}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <Button variant="ghost" onClick={() => navigate('/browse')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredGigs.map((gig) => {
              const seller = getSeller(gig.sellerId);
              return (
                <Link key={gig.id} to={`/gig/${gig.id}`}>
                  <Card className="hover:shadow-lg transition-all h-full">
                    <CardHeader className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={gig.images[0]}
                          alt={gig.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FreelanceHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Your funds are held securely until you're satisfied with the work delivered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Quality Work</h3>
                <p className="text-muted-foreground">
                  Connect with verified professionals who deliver exceptional results
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Get your projects completed quickly with clear timelines and milestones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied clients and talented freelancers
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup/buyer')}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Sign Up as Buyer
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/signup/seller')}>
              <Briefcase className="mr-2 h-5 w-5" />
              Sign Up as Seller
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
