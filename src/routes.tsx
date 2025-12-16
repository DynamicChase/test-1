import type { ReactNode } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginBuyer from './pages/LoginBuyer';
import LoginSeller from './pages/LoginSeller';
import Signup from './pages/Signup';
import SignupBuyer from './pages/SignupBuyer';
import SignupSeller from './pages/SignupSeller';
import BrowseGigs from './pages/BrowseGigs';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import EditGig from './pages/EditGig';
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
    name: 'Login Buyer',
    path: '/login/buyer',
    element: <LoginBuyer />,
    visible: false,
  },
  {
    name: 'Login Seller',
    path: '/login/seller',
    element: <LoginSeller />,
    visible: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />,
    visible: false,
  },
  {
    name: 'Signup Buyer',
    path: '/signup/buyer',
    element: <SignupBuyer />,
    visible: false,
  },
  {
    name: 'Signup Seller',
    path: '/signup/seller',
    element: <SignupSeller />,
    visible: false,
  },
  {
    name: 'Create Gig',
    path: '/seller/create-gig',
    element: <CreateGig />,
    visible: false,
  },
  {
    name: 'Edit Gig',
    path: '/seller/edit-gig/:id',
    element: <EditGig />,
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
