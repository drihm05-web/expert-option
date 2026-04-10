import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Car, LogIn, LogOut, LayoutDashboard, Settings, Mail } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Clear URL hash after OAuth redirect
  useEffect(() => {
    if (location.hash && location.hash.includes('access_token')) {
      // Clear the hash from the URL without reloading the page
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error: any) {
      setAuthError(error.message || 'Failed to login with Google');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setAuthError('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setIsAuthOpen(false);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#997A15] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                <Car className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">Exertion <span className="text-[#D4AF37]">Exports</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/vehicles" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Vehicles</Link>
              <Link to="/#services" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">Services</Link>
              <Link to="/#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">About</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
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
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center uppercase tracking-wider">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full border-white/20 hover:bg-white/5 text-white h-12"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-white/50">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#050505] border-white/20 focus-visible:ring-[#D4AF37]" 
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#050505] border-white/20 focus-visible:ring-[#D4AF37]" 
                />
              </div>

              {authError && (
                <div className="text-sm text-red-400 text-center bg-red-400/10 p-2 rounded">
                  {authError}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider h-12"
              >
                {authLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="text-center text-sm text-white/50">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setAuthMode('signup')} className="text-[#D4AF37] hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setAuthMode('login')} className="text-[#D4AF37] hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
