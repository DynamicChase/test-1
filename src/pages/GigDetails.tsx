import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, RefreshCw, Check, MessageSquare } from 'lucide-react';
import { gigApi, userApi, reviewApi, authApi, orderApi } from '@/services/api';
import type { Gig, User, Review } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function GigDetails() {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const gigData = gigApi.getById(id);
      if (gigData) {
        setGig(gigData);
        const sellerData = userApi.getById(gigData.sellerId);
        setSeller(sellerData);
        const reviewsData = reviewApi.getByGigId(id);
        setReviews(reviewsData);
      }
    }

    const user = authApi.getCurrentUser();
    setCurrentUser(user);
  }, [id]);

  const handleOrder = () => {
    if (!currentUser) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to place an order',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!gig) return;

    const selectedPricing = gig.pricing.find(p => p.name === selectedTier);
    if (!selectedPricing) return;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + selectedPricing.deliveryDays);

    const order = orderApi.create({
      gigId: gig.id,
      buyerId: currentUser.id,
      sellerId: gig.sellerId,
      pricingTier: selectedTier,
      amount: selectedPricing.price,
      status: 'pending',
      deliveryDate: deliveryDate.toISOString(),
    });

    toast({
      title: 'Order placed!',
      description: 'Your order has been created successfully',
    });

    navigate(`/buyer/orders/${order.id}`);
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to contact sellers',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    navigate(`/messages?user=${seller?.id}`);
  };

  if (!gig || !seller) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Gig not found</p>
        </Card>
      </div>
    );
  }

  const selectedPricing = gig.pricing.find(p => p.name === selectedTier);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={seller.avatar} />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{seller.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-semibold">{gig.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({gig.reviewCount})</span>
                  </div>
                  {seller.sellerLevel && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {seller.sellerLevel.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <img
              src={gig.images[0]}
              alt={gig.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <Tabs defaultValue="description" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({gig.reviewCount})</TabsTrigger>
              <TabsTrigger value="seller">About Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Gig</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{gig.description}</p>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {gig.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </Card>
                ) : (
                  reviews.map((review) => {
                    const reviewer = userApi.getById(review.buyerId);
                    return (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={reviewer?.avatar} />
                              <AvatarFallback>{reviewer?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold">{reviewer?.name}</p>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'fill-accent text-accent' : 'text-muted'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={seller.avatar} />
                      <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{seller.name}</h3>
                      <p className="text-muted-foreground">{seller.bio}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-semibold">{new Date(seller.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="font-semibold">{seller.totalOrders || 0}</p>
                    </div>
                  </div>
                  {seller.skills && seller.skills.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {seller.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <Tabs value={selectedTier} onValueChange={(value) => setSelectedTier(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {selectedPricing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${selectedPricing.price}</span>
                  </div>
                  <p className="text-muted-foreground">{selectedPricing.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{selectedPricing.deliveryDays} days delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4" />
                      <span>{selectedPricing.revisions} revisions</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {selectedPricing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg" onClick={handleOrder}>
                Continue (${selectedPricing?.price})
              </Button>
              <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
