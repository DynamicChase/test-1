import type {
  User,
  Category,
  Gig,
  Order,
  Review,
  Message,
  Dispute,
  Notification,
  Withdrawal,
  JobRequest,
  JobOffer,
  PlatformSettings,
} from '@/types/types';

const STORAGE_KEYS = {
  USERS: 'freelancer_users',
  CATEGORIES: 'freelancer_categories',
  GIGS: 'freelancer_gigs',
  ORDERS: 'freelancer_orders',
  REVIEWS: 'freelancer_reviews',
  MESSAGES: 'freelancer_messages',
  DISPUTES: 'freelancer_disputes',
  NOTIFICATIONS: 'freelancer_notifications',
  WITHDRAWALS: 'freelancer_withdrawals',
  JOB_REQUESTS: 'freelancer_job_requests',
  JOB_OFFERS: 'freelancer_job_offers',
  SETTINGS: 'freelancer_settings',
  CURRENT_USER: 'freelancer_current_user',
};

class StorageService {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getSingleItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setSingleItem<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): User[] {
    return this.getItem<User>(STORAGE_KEYS.USERS);
  }

  setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getCategories(): Category[] {
    return this.getItem<Category>(STORAGE_KEYS.CATEGORIES);
  }

  setCategories(categories: Category[]): void {
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  getGigs(): Gig[] {
    return this.getItem<Gig>(STORAGE_KEYS.GIGS);
  }

  setGigs(gigs: Gig[]): void {
    this.setItem(STORAGE_KEYS.GIGS, gigs);
  }

  getOrders(): Order[] {
    return this.getItem<Order>(STORAGE_KEYS.ORDERS);
  }

  setOrders(orders: Order[]): void {
    this.setItem(STORAGE_KEYS.ORDERS, orders);
  }

  getReviews(): Review[] {
    return this.getItem<Review>(STORAGE_KEYS.REVIEWS);
  }

  setReviews(reviews: Review[]): void {
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);
  }

  getMessages(): Message[] {
    return this.getItem<Message>(STORAGE_KEYS.MESSAGES);
  }

  setMessages(messages: Message[]): void {
    this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  getDisputes(): Dispute[] {
    return this.getItem<Dispute>(STORAGE_KEYS.DISPUTES);
  }

  setDisputes(disputes: Dispute[]): void {
    this.setItem(STORAGE_KEYS.DISPUTES, disputes);
  }

  getNotifications(): Notification[] {
    return this.getItem<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  }

  setNotifications(notifications: Notification[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  getWithdrawals(): Withdrawal[] {
    return this.getItem<Withdrawal>(STORAGE_KEYS.WITHDRAWALS);
  }

  setWithdrawals(withdrawals: Withdrawal[]): void {
    this.setItem(STORAGE_KEYS.WITHDRAWALS, withdrawals);
  }

  getJobRequests(): JobRequest[] {
    return this.getItem<JobRequest>(STORAGE_KEYS.JOB_REQUESTS);
  }

  setJobRequests(requests: JobRequest[]): void {
    this.setItem(STORAGE_KEYS.JOB_REQUESTS, requests);
  }

  getJobOffers(): JobOffer[] {
    return this.getItem<JobOffer>(STORAGE_KEYS.JOB_OFFERS);
  }

  setJobOffers(offers: JobOffer[]): void {
    this.setItem(STORAGE_KEYS.JOB_OFFERS, offers);
  }

  getSettings(): PlatformSettings {
    const settings = this.getSingleItem<PlatformSettings>(STORAGE_KEYS.SETTINGS);
    return settings || {
      commissionRate: 0.15,
      withdrawalFee: 2.5,
      featuredGigPrice: 50,
      sponsoredListingPrice: 100,
      proSubscriptionPrice: 29.99,
    };
  }

  setSettings(settings: PlatformSettings): void {
    this.setSingleItem(STORAGE_KEYS.SETTINGS, settings);
  }

  getCurrentUser(): User | null {
    return this.getSingleItem<User>(STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      this.setSingleItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
