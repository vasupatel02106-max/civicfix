import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, MapPin, FileText, BarChart3, MessageSquare, Shield, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/report", label: "Report Issue", icon: FileText },
    { href: "/map", label: "Issue Map", icon: MapPin },
    { href: "/track", label: "Track Issues", icon: BarChart3 },
    { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Admin Dashboard", icon: Shield },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-civic rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">CivicFix</h1>
              <p className="text-xs text-muted-foreground">Your City, Your Responsibility</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "civic" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Admin Navigation */}
            {isAdmin && adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "government" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                {profile && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{profile.full_name || user.email}</span>
                    </Badge>
                    {profile.role !== 'citizen' && (
                      <Badge variant="civic" className="text-xs">
                        {profile.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    )}
                  </div>
                )}
                <Button variant="outline" onClick={signOut} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="ml-4">
                <Link to="/auth">
                  <Button variant="civic" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* User Info */}
                  {user && profile && (
                    <div className="pb-4 border-b">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs">{profile.full_name || user.email}</span>
                        </Badge>
                      </div>
                      {profile.role !== 'citizen' && (
                        <Badge variant="civic" className="text-xs">
                          {profile.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Navigation Items */}
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive(item.href) ? "civic" : "ghost"}
                          className="w-full justify-start space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}

                  {/* Admin Navigation */}
                  {isAdmin && adminNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive(item.href) ? "government" : "ghost"}
                          className="w-full justify-start space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}

                  {/* Auth Buttons */}
                  <div className="pt-4 border-t">
                    {user ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="civic" className="w-full justify-start space-x-2">
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;