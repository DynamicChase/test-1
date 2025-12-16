import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { authApi, gigApi, categoryApi } from '@/services/api';
import type { User, Category, PricingTier, Gig } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function EditGig() {
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gig, setGig] = useState<Gig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [tags, setTags] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [basicPrice, setBasicPrice] = useState('50');
  const [basicDelivery, setBasicDelivery] = useState('3');
  const [basicRevisions, setBasicRevisions] = useState('2');
  const [basicDescription, setBasicDescription] = useState('');
  const [basicFeatures, setBasicFeatures] = useState<string[]>(['']);

  const [standardPrice, setStandardPrice] = useState('100');
  const [standardDelivery, setStandardDelivery] = useState('5');
  const [standardRevisions, setStandardRevisions] = useState('5');
  const [standardDescription, setStandardDescription] = useState('');
  const [standardFeatures, setStandardFeatures] = useState<string[]>(['']);

  const [premiumPrice, setPremiumPrice] = useState('200');
  const [premiumDelivery, setPremiumDelivery] = useState('7');
  const [premiumRevisions, setPremiumRevisions] = useState('10');
  const [premiumDescription, setPremiumDescription] = useState('');
  const [premiumFeatures, setPremiumFeatures] = useState<string[]>(['']);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/login/seller');
      return;
    }
    setCurrentUser(user);

    if (!id) {
      navigate('/seller/dashboard');
      return;
    }

    const existingGig = gigApi.getById(id);
    if (!existingGig) {
      toast({
        title: 'Service not found',
        description: 'The service you are trying to edit does not exist',
        variant: 'destructive',
      });
      navigate('/seller/dashboard');
      return;
    }

    if (existingGig.sellerId !== user.id && user.role !== 'admin') {
      toast({
        title: 'Access denied',
        description: 'You can only edit your own services',
        variant: 'destructive',
      });
      navigate('/seller/dashboard');
      return;
    }

    setGig(existingGig);
    setTitle(existingGig.title);
    setDescription(existingGig.description);
    setCategoryId(existingGig.categoryId);
    setSubcategoryId(existingGig.subcategoryId || '');
    setImages(existingGig.images.length > 0 ? existingGig.images : ['']);
    setTags(existingGig.tags?.join(', ') || '');
    setIsActive(existingGig.isActive);

    const basicTier = existingGig.pricing.find(p => p.name === 'basic');
    if (basicTier) {
      setBasicPrice(basicTier.price.toString());
      setBasicDelivery(basicTier.deliveryDays.toString());
      setBasicRevisions(basicTier.revisions.toString());
      setBasicDescription(basicTier.description || '');
      setBasicFeatures(basicTier.features.length > 0 ? basicTier.features : ['']);
    }

    const standardTier = existingGig.pricing.find(p => p.name === 'standard');
    if (standardTier) {
      setStandardPrice(standardTier.price.toString());
      setStandardDelivery(standardTier.deliveryDays.toString());
      setStandardRevisions(standardTier.revisions.toString());
      setStandardDescription(standardTier.description || '');
      setStandardFeatures(standardTier.features.length > 0 ? standardTier.features : ['']);
    }

    const premiumTier = existingGig.pricing.find(p => p.name === 'premium');
    if (premiumTier) {
      setPremiumPrice(premiumTier.price.toString());
      setPremiumDelivery(premiumTier.deliveryDays.toString());
      setPremiumRevisions(premiumTier.revisions.toString());
      setPremiumDescription(premiumTier.description || '');
      setPremiumFeatures(premiumTier.features.length > 0 ? premiumTier.features : ['']);
    }

    const cats = categoryApi.getAll();
    setCategories(cats);
  }, [id, navigate, toast]);

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleAddFeature = (tier: 'basic' | 'standard' | 'premium') => {
    if (tier === 'basic') {
      setBasicFeatures([...basicFeatures, '']);
    } else if (tier === 'standard') {
      setStandardFeatures([...standardFeatures, '']);
    } else {
      setPremiumFeatures([...premiumFeatures, '']);
    }
  };

  const handleRemoveFeature = (tier: 'basic' | 'standard' | 'premium', index: number) => {
    if (tier === 'basic') {
      setBasicFeatures(basicFeatures.filter((_, i) => i !== index));
    } else if (tier === 'standard') {
      setStandardFeatures(standardFeatures.filter((_, i) => i !== index));
    } else {
      setPremiumFeatures(premiumFeatures.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (tier: 'basic' | 'standard' | 'premium', index: number, value: string) => {
    if (tier === 'basic') {
      const newFeatures = [...basicFeatures];
      newFeatures[index] = value;
      setBasicFeatures(newFeatures);
    } else if (tier === 'standard') {
      const newFeatures = [...standardFeatures];
      newFeatures[index] = value;
      setStandardFeatures(newFeatures);
    } else {
      const newFeatures = [...premiumFeatures];
      newFeatures[index] = value;
      setPremiumFeatures(newFeatures);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !gig) return;

    setLoading(true);

    try {
      if (!title || !description || !categoryId) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const pricing: PricingTier[] = [
        {
          name: 'basic',
          price: Number(basicPrice),
          deliveryDays: Number(basicDelivery),
          revisions: Number(basicRevisions),
          description: basicDescription,
          features: basicFeatures.filter(f => f.trim()),
        },
        {
          name: 'standard',
          price: Number(standardPrice),
          deliveryDays: Number(standardDelivery),
          revisions: Number(standardRevisions),
          description: standardDescription,
          features: standardFeatures.filter(f => f.trim()),
        },
        {
          name: 'premium',
          price: Number(premiumPrice),
          deliveryDays: Number(premiumDelivery),
          revisions: Number(premiumRevisions),
          description: premiumDescription,
          features: premiumFeatures.filter(f => f.trim()),
        },
      ];

      gigApi.update(gig.id, {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        images: images.filter(img => img.trim()),
        pricing,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        isActive,
      });

      toast({
        title: 'Service updated!',
        description: 'Your service has been updated successfully',
      });

      navigate(`/gig/${gig.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (!currentUser || !gig) return null;

  const subcategories = categories.filter(c => c.parentId === categoryId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/seller/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Edit Service</h1>
          <p className="text-muted-foreground">Update your service details and pricing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update details about your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Service Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {isActive ? 'Service is active and visible to buyers' : 'Service is inactive and hidden'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="I will design a professional logo for your business"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => !c.parentId).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {subcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Service Images (URLs)</Label>
                {images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                    {images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="logo, branding, design"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Packages</CardTitle>
              <CardDescription>Update your service packages and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={basicPrice}
                        onChange={(e) => setBasicPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (days)</Label>
                      <Input
                        type="number"
                        value={basicDelivery}
                        onChange={(e) => setBasicDelivery(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Revisions</Label>
                      <Input
                        type="number"
                        value={basicRevisions}
                        onChange={(e) => setBasicRevisions(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Package Description</Label>
                    <Textarea
                      value={basicDescription}
                      onChange={(e) => setBasicDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Features</Label>
                    {basicFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Feature description"
                          value={feature}
                          onChange={(e) => handleFeatureChange('basic', index, e.target.value)}
                        />
                        {basicFeatures.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFeature('basic', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddFeature('basic')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="standard" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={standardPrice}
                        onChange={(e) => setStandardPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (days)</Label>
                      <Input
                        type="number"
                        value={standardDelivery}
                        onChange={(e) => setStandardDelivery(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Revisions</Label>
                      <Input
                        type="number"
                        value={standardRevisions}
                        onChange={(e) => setStandardRevisions(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Package Description</Label>
                    <Textarea
                      value={standardDescription}
                      onChange={(e) => setStandardDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Features</Label>
                    {standardFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Feature description"
                          value={feature}
                          onChange={(e) => handleFeatureChange('standard', index, e.target.value)}
                        />
                        {standardFeatures.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFeature('standard', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddFeature('standard')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="premium" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={premiumPrice}
                        onChange={(e) => setPremiumPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (days)</Label>
                      <Input
                        type="number"
                        value={premiumDelivery}
                        onChange={(e) => setPremiumDelivery(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Revisions</Label>
                      <Input
                        type="number"
                        value={premiumRevisions}
                        onChange={(e) => setPremiumRevisions(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Package Description</Label>
                    <Textarea
                      value={premiumDescription}
                      onChange={(e) => setPremiumDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Features</Label>
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Feature description"
                          value={feature}
                          onChange={(e) => handleFeatureChange('premium', index, e.target.value)}
                        />
                        {premiumFeatures.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFeature('premium', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddFeature('premium')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Service'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/seller/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
