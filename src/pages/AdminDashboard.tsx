import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package, DollarSign, AlertCircle } from 'lucide-react';
import { authApi, userApi, gigApi, orderApi, disputeApi } from '@/services/api';
import type { User } from '@/types/types';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGigs: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeDisputes: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const users = userApi.getAll();
    const gigs = gigApi.getAll();
    const orders = orderApi.getAll();
    const disputes = disputeApi.getAll();

    const revenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.amount, 0);

    setStats({
      totalUsers: users.length,
      totalGigs: gigs.length,
      totalOrders: orders.length,
      totalRevenue: revenue,
      activeDisputes: disputes.filter(d => d.status !== 'resolved').length,
    });
  }, [navigate]);

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGigs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDisputes}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="gigs">Gigs</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Platform Users</span>
                  <span className="font-semibold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Active Gigs</span>
                  <span className="font-semibold">{stats.totalGigs}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Orders Processed</span>
                  <span className="font-semibold">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Platform Revenue</span>
                  <span className="font-semibold">${stats.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Pending Disputes</span>
                  <span className="font-semibold text-destructive">{stats.activeDisputes}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gigs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gig Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gig moderation and approval features will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Order management features will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dispute resolution features will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
