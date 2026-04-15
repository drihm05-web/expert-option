import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Car, LogIn, LogOut, LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Summary State
  const [adminSummary, setAdminSummary] = useState({ pendingRequests: 0, newInquiries: 0 });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let unsubRequests: () => void;
    let unsubInquiries: () => void;

    if (user && role === 'admin') {
      unsubRequests = onSnapshot(query(collection(db, 'export_requests'), where('status', '==', 'Pending')), (snapshot) => {
        setAdminSummary(prev => ({ ...prev, pendingRequests: snapshot.size }));
      });
      unsubInquiries = onSnapshot(query(collection(db, 'inquiries'), where('status', '==', 'New')), (snapshot) => {
        setAdminSummary(prev => ({ ...prev, newInquiries: snapshot.size }));
      });
    }

    return () => {
      if (unsubRequests) unsubRequests();
      if (unsubInquiries) unsubInquiries();
    };
  }, [user, role]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      await login();
      setIsAuthOpen(false);
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      <Toaster theme="dark" position="top-center" />
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#997A15] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                <Car className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">Exertion <span className="text-[#D4AF37]">Exports</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">About</Link>
              <Link to="/services" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Services</Link>
              <Link to="/auctions" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Auctions</Link>
              <Link to="/journey" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Journey</Link>
              <Link to="/concierge" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Concierge</Link>
              <Link to="/vehicles" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Marketplace</Link>
              <Link to="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    {role === 'admin' && (
                      <Link to="/admin" className="relative">
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                        {(adminSummary.pendingRequests > 0 || adminSummary.newInquiries > 0) && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                            {adminSummary.pendingRequests + adminSummary.newInquiries}
                          </span>
                        )}
                      </Link>
                    )}
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-white/20 text-white hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsAuthOpen(true)} className="bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-semibold">
                    <LogIn className="w-4 h-4 mr-2" />
                    Client Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">About</Link>
              <Link to="/services" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Services</Link>
              <Link to="/auctions" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Auctions</Link>
              <Link to="/journey" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Journey</Link>
              <Link to="/concierge" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Concierge</Link>
              <Link to="/vehicles" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Marketplace</Link>
              <Link to="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Contact</Link>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
              {user ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsAuthOpen(true)} className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-semibold">
                  <LogIn className="w-4 h-4 mr-2" />
                  Client Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <main>
        {children}
      </main>

      <footer className="border-t border-white/10 bg-black py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-[#D4AF37]" />
            <span className="font-bold text-lg tracking-tight uppercase">Exertion <span className="text-[#D4AF37]">Exports</span></span>
          </div>
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} Exertion Exports. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white sm:max-w-[400px] p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-center uppercase tracking-wider">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="space-y-4">
              <Button 
                onClick={handleEmailAuth}
                disabled={authLoading}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider h-12 mt-2 transition-colors"
              >
                {authLoading ? 'Please wait...' : 'Sign in with Google'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
