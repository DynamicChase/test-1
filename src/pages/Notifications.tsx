import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, MessageSquare, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi, notificationApi } from '@/services/api';
import type { User, Notification } from '@/types/types';

export default function Notifications() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const userNotifications = notificationApi.getByUserId(user.id);
    setNotifications(userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [navigate]);

  const handleMarkAsRead = (id: string) => {
    notificationApi.markAsRead(id);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) {
        notificationApi.markAsRead(n.id);
      }
    });
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'review':
        return <Star className="h-5 w-5" />;
      case 'dispute':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification.id);
                  }
                  if (notification.link) {
                    navigate(notification.link);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      !notification.isRead ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        {!notification.isRead && (
                          <Badge variant="default" className="shrink-0">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
