import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">FreelanceHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with talented freelancers and find the perfect services for your business needs.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Services</Link></li>
              <li><Link to="/buyer/dashboard" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/job-requests" className="hover:text-primary transition-colors">Post a Request</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/seller/dashboard" className="hover:text-primary transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/seller/create-gig" className="hover:text-primary transition-colors">Create a Gig</Link></li>
              <li><Link to="/seller/earnings" className="hover:text-primary transition-colors">Earnings</Link></li>
              <li><Link to="/seller-guide" className="hover:text-primary transition-colors">Seller Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>2025 FreelanceHub</p>
        </div>
      </div>
    </footer>
  );
}
