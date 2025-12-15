import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu, Search, User, LogOut, Settings, Package, MessageSquare, Briefcase } from 'lucide-react';
import { authApi, notificationApi } from '@/services/api';
import type { User as UserType } from '@/types/types';

export default function Header() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const notifications = notificationApi.getByUserId(user.id);
      setUnreadCount(notifications.filter(n => !n.isRead).length);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">FreelanceHub</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden xl:flex items-center gap-2">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
          </div>

          <nav className="hidden xl:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Browse Gigs
            </Link>
            {currentUser?.role === 'seller' || currentUser?.role === 'admin' ? (
              <Link to="/seller/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Seller Dashboard
              </Link>
            ) : null}
            {currentUser?.role === 'buyer' || currentUser?.role === 'admin' ? (
              <Link to="/buyer/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                My Orders
              </Link>
            ) : null}
            {currentUser?.role === 'admin' ? (
              <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Admin Panel
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <div className="hidden xl:flex items-center gap-3">
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-col">
                    <Link to="/profile" className="text-sm font-medium hover:text-primary">
                      {currentUser.name}
                    </Link>
                    <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden xl:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Join Now
                </Button>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <form onSubmit={handleSearch} className="xl:hidden">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search for services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {currentUser && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{currentUser.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                      </div>
                    </div>
                  )}

                  <Link to="/browse" className="text-sm font-medium py-2">
                    Browse Gigs
                  </Link>
                  {currentUser?.role === 'seller' || currentUser?.role === 'admin' ? (
                    <Link to="/seller/dashboard" className="text-sm font-medium py-2">
                      Seller Dashboard
                    </Link>
                  ) : null}
                  {currentUser?.role === 'buyer' || currentUser?.role === 'admin' ? (
                    <Link to="/buyer/dashboard" className="text-sm font-medium py-2">
                      My Orders
                    </Link>
                  ) : null}
                  {currentUser?.role === 'admin' ? (
                    <Link to="/admin" className="text-sm font-medium py-2">
                      Admin Panel
                    </Link>
                  ) : null}

                  {currentUser ? (
                    <>
                      <Link to="/profile" className="text-sm font-medium py-2">
                        Profile Settings
                      </Link>
                      <Button variant="outline" onClick={handleLogout} className="justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => navigate('/login')}>
                        Sign In
                      </Button>
                      <Button onClick={() => navigate('/signup')}>
                        Join Now
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
