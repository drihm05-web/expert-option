import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Car, LogIn, LogOut, LayoutDashboard, Settings, Menu, X, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Toaster } from 'sonner';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
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
    let interval: any;

    if (user && role === 'admin') {
      const fetchAdminSummary = async () => {
        try {
          const [reqRes, inqRes] = await Promise.all([
            fetch('/api/export-requests'),
            fetch('/api/inquiries')
          ]);
          
          if (reqRes.ok && inqRes.ok) {
            const requests = await reqRes.json();
            const inquiries = await inqRes.json();
            
            setAdminSummary({
              pendingRequests: requests.filter((r: any) => r.status === 'Pending').length,
              newInquiries: inquiries.filter((i: any) => i.status === 'New').length
            });
          }
        } catch (err) {
          console.error("Failed to fetch admin summary", err);
        }
      };

      fetchAdminSummary();
      interval = setInterval(fetchAdminSummary, 10000); // Poll every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
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

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/27635473010?text=Hello,%20I%20would%20like%20assistance%20with%20sourcing%20from%20South%20Africa." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-10 right-0 bg-black/80 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us
        </span>
      </a>

      <footer className="border-t border-white/10 bg-[#050505] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-[#D4AF37]" />
              <span className="font-bold text-lg tracking-tight uppercase">Exertion <span className="text-[#D4AF37]">Exports</span></span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Your premium partner for cross-border sourcing and procurement of vehicles, machinery, and general goods from South Africa.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-6">Quick Links</h4>
            <div className="space-y-3 flex flex-col">
              <Link to="/services" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Services</Link>
              <Link to="/auctions" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Auctions</Link>
              <Link to="/concierge" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Concierge Support</Link>
              <Link to="/vehicles" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Marketplace</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-6">Contact</h4>
            <div className="space-y-4">
              <a href="https://wa.me/27635473010" className="flex items-start gap-3 text-white/60 hover:text-[#D4AF37] transition-colors group">
                <Phone className="w-5 h-5 group-hover:text-[#D4AF37] text-white/40 shrink-0" />
                <span className="text-sm">+27 63 547 3010</span>
              </a>
              <a href="mailto:admin@exertionexports.co.za" className="flex items-start gap-3 text-white/60 hover:text-[#D4AF37] transition-colors group">
                <Mail className="w-5 h-5 group-hover:text-[#D4AF37] text-white/40 shrink-0" />
                <span className="text-sm">admin@exertionexports.co.za</span>
              </a>
              <a href="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x1e95735aaef55899:0xf14b71546e4e0a01" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-white/60 hover:text-[#D4AF37] transition-colors group">
                <MapPin className="w-5 h-5 group-hover:text-[#D4AF37] text-white/40 shrink-0" />
                <span className="text-sm">Johannesburg, South Africa</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-6">WhatsApp</h4>
            <div className="p-4 bg-white rounded-xl inline-block">
              {/* Fallback QR Code - you can replace with an actual image of the QR later */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/27635473010?text=Hello,%20I%20would%20like%20assistance%20with%20sourcing%20from%20South%20Africa." alt="WhatsApp QR Code" className="w-[120px] h-[120px]" referrerPolicy="no-referrer" />
            </div>
            <p className="text-xs text-white/50 mt-3">Scan to Chat on WhatsApp</p>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Exertion Exports. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-white/40 hover:text-white text-xs">Privacy Policy</Link>
            <Link to="#" className="text-white/40 hover:text-white text-xs">Terms of Service</Link>
          </div>
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
