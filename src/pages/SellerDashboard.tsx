import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Package, Star, TrendingUp, Plus, Edit, Eye } from 'lucide-react';
import { authApi, gigApi, orderApi } from '@/services/api';
import type { User, Gig, Order } from '@/types/types';

export default function SellerDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const userGigs = gigApi.getBySellerId(user.id);
    setGigs(userGigs);

    const userOrders = orderApi.getBySellerId(user.id);
    setOrders(userOrders);
  }, [navigate]);

  if (!currentUser) return null;

  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.amount, 0);
  const avgRating = gigs.length > 0 
    ? gigs.reduce((sum, g) => sum + g.rating, 0) / gigs.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your gigs and orders</p>
        </div>
        <Button onClick={() => navigate('/seller/create-gig')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Gig
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {completedOrders.length} completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">Orders in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Across all gigs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gigs.filter(g => g.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Out of {gigs.length} total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gigs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gigs">My Gigs</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="gigs" className="space-y-4">
          {gigs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any gigs yet</p>
              <Button onClick={() => navigate('/seller/create-gig')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Gig
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <Card key={gig.id}>
                  <CardHeader className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                      />
                      {!gig.isActive && (
                        <Badge className="absolute top-2 right-2 bg-destructive">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{gig.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{gig.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{gig.orders} orders</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span>{gig.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/gig/${gig.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/seller/edit-gig/${gig.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const gig = gigApi.getById(order.gigId);
                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{gig?.title}</CardTitle>
                          <CardDescription>Order #{order.id.slice(0, 8)}</CardDescription>
                        </div>
                        <Badge className={
                          order.status === 'completed' ? 'bg-accent' :
                          order.status === 'in_progress' ? 'bg-primary' :
                          order.status === 'pending' ? 'bg-secondary' :
                          'bg-destructive'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Amount: ${order.amount}</p>
                          <p>Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/seller/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
