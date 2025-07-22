import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, HelpCircle, LogOut } from 'lucide-react';
import { MenuBar } from './ui/MenuBar';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeItem, setActiveItem] = useState(() => {
    // Set initial active item based on current route
    if (location.pathname.includes('/dashboard')) return 'Dashboard';
    if (location.pathname.includes('/settings')) return 'Settings';
    if (location.pathname.includes('/help')) return 'Help';
    return 'Dashboard';
  });

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: ROUTES.DASHBOARD,
      gradient: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)',
      iconColor: 'text-blue-500'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: ROUTES.SETTINGS,
      gradient: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)',
      iconColor: 'text-green-500'
    },
    {
      icon: HelpCircle,
      label: 'Help',
      href: ROUTES.HELP,
      gradient: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)',
      iconColor: 'text-red-500'
    }
  ];

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    const item = menuItems.find(item => item.label === label);
    if (item) {
      navigate(item.href);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-gray-50/95 via-gray-50/80 to-transparent backdrop-blur-sm border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <MenuBar 
            items={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
          />
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;