import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { authApi } from '@/services/api';
import type { User } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    setName(user.name);
    setBio(user.bio || '');
    setPhone(user.phone || '');
    setSkills(user.skills?.join(', ') || '');
  }, [navigate]);

  const handleSave = () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const updatedUser = authApi.updateProfile(currentUser.id, {
        name,
        bio,
        phone,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
      });

      setCurrentUser(updatedUser);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  <Badge className="mt-2 capitalize">{currentUser.role}</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {(currentUser.role === 'seller' || currentUser.role === 'admin') && (
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. Web Design, Logo Design, Branding"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {(currentUser.role === 'seller' || currentUser.role === 'admin') && (
            <Card>
              <CardHeader>
                <CardTitle>Seller Statistics</CardTitle>
                <CardDescription>Your performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Seller Level</p>
                    <p className="text-lg font-semibold capitalize">
                      {currentUser.sellerLevel?.replace('_', ' ') || 'Beginner'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Score</p>
                    <p className="text-lg font-semibold">{currentUser.successScore || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-lg font-semibold">${currentUser.totalEarnings || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-lg font-semibold">{currentUser.totalOrders || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Verification</span>
                  <Badge variant={currentUser.emailVerified ? 'default' : 'secondary'}>
                    {currentUser.emailVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Phone Verification</span>
                  <Badge variant={currentUser.phoneVerified ? 'default' : 'secondary'}>
                    {currentUser.phoneVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Badge variant={currentUser.twoFactorEnabled ? 'default' : 'secondary'}>
                    {currentUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(currentUser.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
