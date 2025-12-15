import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { authApi, orderApi, gigApi } from '@/services/api';
import type { User, Order } from '@/types/types';

export default function BuyerDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const userOrders = orderApi.getByBuyerId(user.id);
    setOrders(userOrders);
  }, [navigate]);

  if (!currentUser) return null;

  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <Button onClick={() => navigate('/browse')}>
          Browse Services
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No active orders</p>
              <Button onClick={() => navigate('/browse')}>
                Browse Services
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => {
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
                          order.status === 'in_progress' ? 'bg-primary' : 'bg-secondary'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Amount: ${order.amount}</p>
                          <p>Expected Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                          <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/buyer/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No completed orders yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedOrders.map((order) => {
                const gig = gigApi.getById(order.gigId);
                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{gig?.title}</CardTitle>
                          <CardDescription>Order #{order.id.slice(0, 8)}</CardDescription>
                        </div>
                        <Badge className="bg-accent">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Amount: ${order.amount}</p>
                          <p>Completed: {order.completedAt ? new Date(order.completedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/buyer/orders/${order.id}`}>View Details</Link>
                          </Button>
                          {!order.reviewId && (
                            <Button size="sm" asChild>
                              <Link to={`/buyer/orders/${order.id}/review`}>Leave Review</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button onClick={() => navigate('/browse')}>
                Browse Services
              </Button>
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
                          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/buyer/orders/${order.id}`}>View Details</Link>
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
