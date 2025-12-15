import { storageService } from './storage';
import type {
  User,
  Gig,
  Order,
  Review,
  Message,
  Dispute,
  Notification,
  Withdrawal,
  JobRequest,
  JobOffer,
  Category,
} from '@/types/types';

function generateId(): string {
  return crypto.randomUUID();
}

export const authApi = {
  login: (email: string, password: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      storageService.setCurrentUser(user);
      return user;
    }
    return null;
  },

  signup: (userData: Omit<User, 'id' | 'joinedAt'>): User => {
    const users = storageService.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      joinedAt: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      successScore: 0,
      totalEarnings: 0,
      totalOrders: 0,
    };

    users.push(newUser);
    storageService.setUsers(users);
    storageService.setCurrentUser(newUser);
    return newUser;
  },

  logout: (): void => {
    storageService.setCurrentUser(null);
  },

  getCurrentUser: (): User | null => {
    return storageService.getCurrentUser();
  },

  updateProfile: (userId: string, updates: Partial<User>): User => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...updates };
    storageService.setUsers(users);
    
    const currentUser = storageService.getCurrentUser();
    if (currentUser?.id === userId) {
      storageService.setCurrentUser(users[index]);
    }
    
    return users[index];
  },
};

export const categoryApi = {
  getAll: (): Category[] => {
    return storageService.getCategories();
  },

  getById: (id: string): Category | null => {
    const categories = storageService.getCategories();
    return categories.find(c => c.id === id) || null;
  },

  getSubcategories: (parentId: string): Category[] => {
    const categories = storageService.getCategories();
    return categories.filter(c => c.parentId === parentId);
  },
};

export const gigApi = {
  getAll: (filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
  }): Gig[] => {
    let gigs = storageService.getGigs().filter(g => g.isActive);

    if (filters?.categoryId) {
      gigs = gigs.filter(g => g.categoryId === filters.categoryId || g.subcategoryId === filters.categoryId);
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      gigs = gigs.filter(g => {
        const minGigPrice = Math.min(...g.pricing.map(p => p.price));
        return (
          (filters.minPrice === undefined || minGigPrice >= filters.minPrice) &&
          (filters.maxPrice === undefined || minGigPrice <= filters.maxPrice)
        );
      });
    }

    if (filters?.minRating) {
      gigs = gigs.filter(g => g.rating >= filters.minRating);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      gigs = gigs.filter(g =>
        g.title.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower) ||
        g.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    return gigs;
  },

  getById: (id: string): Gig | null => {
    const gigs = storageService.getGigs();
    const gig = gigs.find(g => g.id === id);
    if (gig) {
      gig.views += 1;
      storageService.setGigs(gigs);
    }
    return gig || null;
  },

  getBySellerId: (sellerId: string): Gig[] => {
    return storageService.getGigs().filter(g => g.sellerId === sellerId);
  },

  getFeatured: (): Gig[] => {
    return storageService.getGigs().filter(g => g.isFeatured && g.isActive).slice(0, 8);
  },

  create: (gigData: Omit<Gig, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks' | 'orders' | 'rating' | 'reviewCount'>): Gig => {
    const gigs = storageService.getGigs();
    const newGig: Gig = {
      ...gigData,
      id: generateId(),
      slug: gigData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      views: 0,
      clicks: 0,
      orders: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    gigs.push(newGig);
    storageService.setGigs(gigs);
    return newGig;
  },

  update: (id: string, updates: Partial<Gig>): Gig => {
    const gigs = storageService.getGigs();
    const index = gigs.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Gig not found');

    gigs[index] = { ...gigs[index], ...updates, updatedAt: new Date().toISOString() };
    storageService.setGigs(gigs);
    return gigs[index];
  },

  delete: (id: string): void => {
    const gigs = storageService.getGigs();
    const filtered = gigs.filter(g => g.id !== id);
    storageService.setGigs(filtered);
  },
};

export const orderApi = {
  getAll: (): Order[] => {
    return storageService.getOrders();
  },

  getById: (id: string): Order | null => {
    const orders = storageService.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  getByBuyerId: (buyerId: string): Order[] => {
    return storageService.getOrders().filter(o => o.buyerId === buyerId);
  },

  getBySellerId: (sellerId: string): Order[] => {
    return storageService.getOrders().filter(o => o.sellerId === sellerId);
  },

  create: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const orders = storageService.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    storageService.setOrders(orders);

    const gigs = storageService.getGigs();
    const gigIndex = gigs.findIndex(g => g.id === orderData.gigId);
    if (gigIndex !== -1) {
      gigs[gigIndex].orders += 1;
      storageService.setGigs(gigs);
    }

    return newOrder;
  },

  update: (id: string, updates: Partial<Order>): Order => {
    const orders = storageService.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');

    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    storageService.setOrders(orders);
    return orders[index];
  },
};

export const reviewApi = {
  getByGigId: (gigId: string): Review[] => {
    return storageService.getReviews().filter(r => r.gigId === gigId);
  },

  create: (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = storageService.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    storageService.setReviews(reviews);

    const gigs = storageService.getGigs();
    const gigIndex = gigs.findIndex(g => g.id === reviewData.gigId);
    if (gigIndex !== -1) {
      const gigReviews = reviews.filter(r => r.gigId === reviewData.gigId);
      const avgRating = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;
      gigs[gigIndex].rating = avgRating;
      gigs[gigIndex].reviewCount = gigReviews.length;
      storageService.setGigs(gigs);
    }

    return newReview;
  },
};

export const messageApi = {
  getConversation: (userId1: string, userId2: string): Message[] => {
    const messages = storageService.getMessages();
    return messages.filter(
      m =>
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  getByOrderId: (orderId: string): Message[] => {
    return storageService.getMessages().filter(m => m.orderId === orderId);
  },

  send: (messageData: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message => {
    const messages = storageService.getMessages();
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    storageService.setMessages(messages);
    return newMessage;
  },

  markAsRead: (messageId: string): void => {
    const messages = storageService.getMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index].isRead = true;
      storageService.setMessages(messages);
    }
  },
};

export const disputeApi = {
  getAll: (): Dispute[] => {
    return storageService.getDisputes();
  },

  getById: (id: string): Dispute | null => {
    const disputes = storageService.getDisputes();
    return disputes.find(d => d.id === id) || null;
  },

  create: (disputeData: Omit<Dispute, 'id' | 'createdAt'>): Dispute => {
    const disputes = storageService.getDisputes();
    const newDispute: Dispute = {
      ...disputeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    disputes.push(newDispute);
    storageService.setDisputes(disputes);
    return newDispute;
  },

  resolve: (id: string, resolution: string, refundAmount?: number): Dispute => {
    const disputes = storageService.getDisputes();
    const index = disputes.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Dispute not found');

    disputes[index] = {
      ...disputes[index],
      status: 'resolved',
      resolution,
      refundAmount,
      resolvedAt: new Date().toISOString(),
    };
    storageService.setDisputes(disputes);
    return disputes[index];
  },
};

export const notificationApi = {
  getByUserId: (userId: string): Notification[] => {
    return storageService.getNotifications().filter(n => n.userId === userId);
  },

  create: (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification => {
    const notifications = storageService.getNotifications();
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    notifications.push(newNotification);
    storageService.setNotifications(notifications);
    return newNotification;
  },

  markAsRead: (id: string): void => {
    const notifications = storageService.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].isRead = true;
      storageService.setNotifications(notifications);
    }
  },
};

export const withdrawalApi = {
  getByUserId: (userId: string): Withdrawal[] => {
    return storageService.getWithdrawals().filter(w => w.userId === userId);
  },

  create: (withdrawalData: Omit<Withdrawal, 'id' | 'createdAt'>): Withdrawal => {
    const withdrawals = storageService.getWithdrawals();
    const newWithdrawal: Withdrawal = {
      ...withdrawalData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    withdrawals.push(newWithdrawal);
    storageService.setWithdrawals(withdrawals);
    return newWithdrawal;
  },
};

export const jobRequestApi = {
  getAll: (): JobRequest[] => {
    return storageService.getJobRequests();
  },

  getById: (id: string): JobRequest | null => {
    const requests = storageService.getJobRequests();
    return requests.find(r => r.id === id) || null;
  },

  create: (requestData: Omit<JobRequest, 'id' | 'createdAt'>): JobRequest => {
    const requests = storageService.getJobRequests();
    const newRequest: JobRequest = {
      ...requestData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    storageService.setJobRequests(requests);
    return newRequest;
  },
};

export const jobOfferApi = {
  getByJobRequestId: (jobRequestId: string): JobOffer[] => {
    return storageService.getJobOffers().filter(o => o.jobRequestId === jobRequestId);
  },

  create: (offerData: Omit<JobOffer, 'id' | 'createdAt'>): JobOffer => {
    const offers = storageService.getJobOffers();
    const newOffer: JobOffer = {
      ...offerData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    offers.push(newOffer);
    storageService.setJobOffers(offers);
    return newOffer;
  },

  update: (id: string, updates: Partial<JobOffer>): JobOffer => {
    const offers = storageService.getJobOffers();
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Offer not found');

    offers[index] = { ...offers[index], ...updates };
    storageService.setJobOffers(offers);
    return offers[index];
  },
};

export const userApi = {
  getAll: (): User[] => {
    return storageService.getUsers();
  },

  getById: (id: string): User | null => {
    const users = storageService.getUsers();
    return users.find(u => u.id === id) || null;
  },

  getSellers: (): User[] => {
    return storageService.getUsers().filter(u => u.role === 'seller' || u.role === 'admin');
  },
};
