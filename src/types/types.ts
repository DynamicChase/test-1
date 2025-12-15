export type UserRole = 'buyer' | 'seller' | 'admin';

export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export type DisputeStatus = 'open' | 'in_review' | 'resolved';

export type SellerLevel = 'beginner' | 'level_1' | 'level_2' | 'pro';

export type NotificationType = 'order' | 'message' | 'review' | 'dispute' | 'system';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  sellerLevel?: SellerLevel;
  successScore?: number;
  totalEarnings?: number;
  totalOrders?: number;
  joinedAt: string;
  isOnline?: boolean;
  vacationMode?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon?: string;
  description?: string;
}

export interface PricingTier {
  name: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryDays: number;
  revisions: number;
  description: string;
  features: string[];
}

export interface GigAddOn {
  id: string;
  name: string;
  price: number;
  deliveryDays?: number;
}

export interface Gig {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  images: string[];
  pricing: PricingTier[];
  addOns?: GigAddOn[];
  tags: string[];
  views: number;
  clicks: number;
  orders: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isSponsored: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  gigId: string;
  buyerId: string;
  sellerId: string;
  pricingTier: 'basic' | 'standard' | 'premium';
  amount: number;
  addOns?: GigAddOn[];
  status: OrderStatus;
  requirements?: string;
  deliveryDate: string;
  deliveredFiles?: string[];
  deliveryNote?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reviewId?: string;
}

export interface Review {
  id: string;
  orderId: string;
  gigId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  orderId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  files?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  reason: string;
  description: string;
  evidence?: string[];
  status: DisputeStatus;
  resolution?: string;
  refundAmount?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export interface JobRequest {
  id: string;
  buyerId: string;
  title: string;
  description: string;
  budget: number;
  categoryId: string;
  deadline: string;
  invitedSellers?: string[];
  status: 'open' | 'closed';
  createdAt: string;
}

export interface JobOffer {
  id: string;
  jobRequestId: string;
  sellerId: string;
  amount: number;
  deliveryDays: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface PlatformSettings {
  commissionRate: number;
  withdrawalFee: number;
  featuredGigPrice: number;
  sponsoredListingPrice: number;
  proSubscriptionPrice: number;
}
