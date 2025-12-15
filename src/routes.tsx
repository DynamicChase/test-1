import type { ReactNode } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseGigs from './pages/BrowseGigs';
import GigDetails from './pages/GigDetails';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Browse',
    path: '/browse',
    element: <BrowseGigs />,
    visible: false,
  },
  {
    name: 'Gig Details',
    path: '/gig/:id',
    element: <GigDetails />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />,
    visible: false,
  },
  {
    name: 'Seller Dashboard',
    path: '/seller/dashboard',
    element: <SellerDashboard />,
    visible: false,
  },
  {
    name: 'Buyer Dashboard',
    path: '/buyer/dashboard',
    element: <BuyerDashboard />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false,
  },
  {
    name: 'Messages',
    path: '/messages',
    element: <Messages />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: <Notifications />,
    visible: false,
  },
];

export default routes;
