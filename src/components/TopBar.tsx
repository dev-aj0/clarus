import React, { useState } from 'react';
import { Settings, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Home, Library, MessageCircle } from 'lucide-react';
import clarusLogo from '../../clarus_logo_max.png';

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Library",
    url: "/library",
    icon: Library,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
];

interface TopBarProps {}

const TopBar: React.FC<TopBarProps> = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profileImage, setProfileImage] = useState('');
  const [displayName, setDisplayName] = useState('User');

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || displayName || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="bg-background border-b border-border topbar-consistent">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <img src={clarusLogo} alt="Clarus Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-medium text-xl clarus-brand-text">Clarus</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.title}
                to={item.url} 
                className={`text-base font-medium transition-all duration-200 hover:text-foreground flex items-center gap-2 hover:scale-105 ${
                  location.pathname === item.url ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <item.icon size={16} />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:scale-110 transition-transform duration-200">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={clarusLogo} alt="Clarus Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-medium text-xl">Clarus</span>
              </div>
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link 
                    key={item.title}
                    to={item.url} 
                    className={`text-base font-medium transition-all duration-200 hover:text-foreground flex items-center gap-3 p-2 rounded-md hover:scale-105 ${
                      location.pathname === item.url ? 'text-foreground bg-accent' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                ))}
                <Link 
                  to="/settings" 
                  className={`text-base font-medium transition-all duration-200 hover:text-foreground flex items-center gap-3 p-2 rounded-md hover:scale-105 ${
                    location.pathname === '/settings' ? 'text-foreground bg-accent' : 'text-muted-foreground'
                  }`}
                >
                  <Settings size={20} />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right side - Settings and Profile Menu */}
        <div className="flex items-center space-x-4">
          {/* Settings Button - Desktop only */}
          <Button variant="ghost" size="icon" asChild className="hidden md:flex hover:scale-110 transition-transform duration-200">
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(getDisplayName())}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="w-[200px] truncate text-sm font-medium">
                    {getDisplayName()}
                  </p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {getUserEmail()}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer transition-colors duration-200">
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="hover:bg-accent cursor-pointer transition-colors duration-200">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;