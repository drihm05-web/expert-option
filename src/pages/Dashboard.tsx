import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Package, MessageSquare, Plus, Clock, CheckCircle2, Truck, Ship, MapPin, History, User as UserIcon, CreditCard, Car, BarChart3 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChatModal } from '../components/ChatModal';

const STATUS_STEPS = ['Pending', 'Sourcing', 'Inspection', 'Cleared', 'Shipped', 'Delivered'];

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefilledVehicleId = searchParams.get('vehicle');
  
  const [requests, setRequests] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [eftDetails, setEftDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(prefilledVehicleId ? 'new' : 'active');

  // Modals State
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // New Request Form State
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [vehicleId, setVehicleId] = useState(prefilledVehicleId || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    setError(null);
    try {
      // Fetch Requests
      const { data: reqData, error: reqError } = await supabase
        .from('export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (reqError) throw reqError;
      if (reqData) setRequests(reqData);

      // Fetch Vehicles
      const { data: vehData, error: vehError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });
      
      if (vehError) throw vehError;
      if (vehData) setVehicles(vehData);

      // Fetch EFT Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'eft_details')
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') {
        console.warn("Settings fetch error:", settingsError);
      }
      if (settingsData) setEftDetails(settingsData.value);

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "A technical issue occurred while loading your dashboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('export_requests').insert([{
        user_id: user.id,
        vehicle_id: vehicleId || null,
        destination,
        budget: Number(budget),
        preferences,
        status: 'Pending'
      }]);
      
      if (error) throw error;
      
      setDestination('');
      setBudget('');
      setPreferences('');
      setVehicleId('');
      setActiveTab('active');
      fetchData();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestVehicle = (id: string) => {
    setVehicleId(id);
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please login to view your dashboard</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="bg-red-500/10 border-red-500/50 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Technical Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">{error}</p>
            <Button onClick={fetchData} className="w-full bg-red-500 text-white hover:bg-red-600">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeRequests = requests.filter(req => req.status !== 'Delivered');
  const historyRequests = requests.filter(req => req.status === 'Delivered');
  const totalBudget = requests.reduce((sum, req) => sum + (req.budget || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Client <span className="text-[#D4AF37] italic font-serif">Dashboard</span></h1>
          <p className="text-white/50">Manage your export requests, track progress, and view available vehicles.</p>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-lg">
                <Package className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider">Active Exports</p>
                <p className="text-2xl font-bold text-white">{activeRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider">Delivered</p>
                <p className="text-2xl font-bold text-white">{historyRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider">Total Value</p>
                <p className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#0a0a0a] border border-white/10 p-1 mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="active" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Active Exports</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">New Request</TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Available Vehicles</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">History</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeRequests.length === 0 ? (
              <div className="text-center py-24 border border-white/10 rounded-2xl bg-[#0a0a0a]">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No active exports</h3>
                <p className="text-white/50 mb-6">You haven't requested any vehicle exports yet.</p>
                <Button onClick={() => setActiveTab('new')} className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
                  Start a Request
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeRequests.map((req) => {
                  const currentStepIndex = STATUS_STEPS.indexOf(req.status);
                  return (
                    <Card key={req.id} className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                      <CardHeader className="border-b border-white/5 pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-[#D4AF37]" />
                              Export to {req.destination}
                            </CardTitle>
                            <p className="text-sm text-white/50 mt-1">Requested on {new Date(req.createdAt || req.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50 uppercase tracking-wider">{req.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {/* More Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
                          <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                            <span className="block text-white/40 uppercase text-[10px] tracking-wider mb-1">Budget</span>
                            <span className="text-white font-medium">${req.budget?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                            <span className="block text-white/40 uppercase text-[10px] tracking-wider mb-1">Vehicle ID</span>
                            <span className="text-white font-mono text-xs">{req.vehicle_id ? String(req.vehicle_id).substring(0,8) : 'Sourcing'}</span>
                          </div>
                          <div className="bg-[#050505] p-3 rounded-lg border border-white/5 col-span-2">
                            <span className="block text-white/40 uppercase text-[10px] tracking-wider mb-1">Preferences</span>
                            <span className="text-white/80 line-clamp-1">{req.preferences || 'None specified'}</span>
                          </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="relative mb-8">
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-[#D4AF37] -translate-y-1/2 z-0 transition-all duration-500" 
                            style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                          />
                          <div className="relative z-10 flex justify-between">
                            {STATUS_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isActive = idx === currentStepIndex;
                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-[#050505] border-white/20 text-white/20'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                                  </div>
                                  <span className={`text-xs mt-2 uppercase tracking-wider font-semibold ${isActive ? 'text-[#D4AF37]' : 'text-white/50'}`}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3">
                          <Button onClick={() => setPaymentModalOpen(true)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay via EFT
                          </Button>
                          <Button onClick={() => setChatRequestId(req.id)} className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Live Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-[#0a0a0a] border-white/10 overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={vehicle.image_url} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider">
                        ${(vehicle.price || 0).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                      <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {(vehicle.mileage || 0).toLocaleString()} km</span>
                    </div>
                    <Button 
                      onClick={() => handleRequestVehicle(vehicle.id)}
                      className="w-full bg-white/5 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                      Request Export
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {historyRequests.length === 0 ? (
              <div className="text-center py-24 border border-white/10 rounded-2xl bg-[#0a0a0a]">
                <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No completed exports</h3>
                <p className="text-white/50">Your successfully delivered vehicles will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {historyRequests.map((req) => (
                  <Card key={req.id} className="bg-[#0a0a0a] border-white/10 overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                    <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#D4AF37]" />
                            Export to {req.destination}
                          </CardTitle>
                          <p className="text-sm text-white/50 mt-1">Requested on {new Date(req.createdAt || req.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 uppercase tracking-wider">Delivered</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                          <span className="block text-white/40 uppercase text-[10px] tracking-wider mb-1">Budget</span>
                          <span className="text-white font-medium">${req.budget?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                          <span className="block text-white/40 uppercase text-[10px] tracking-wider mb-1">Vehicle ID</span>
                          <span className="text-white font-mono text-xs">{req.vehicle_id ? String(req.vehicle_id).substring(0,8) : 'Sourcing'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-[#0a0a0a] border-white/10 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-[#D4AF37]" />
                  Client Profile
                </CardTitle>
                <p className="text-white/50 text-sm">Your account details and preferences.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-white/50 uppercase text-xs tracking-wider">Email Address</Label>
                  <p className="text-white font-medium text-lg">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-white/50 uppercase text-xs tracking-wider">Account ID</Label>
                  <p className="text-white font-mono text-sm bg-[#050505] p-2 rounded border border-white/10">{user.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-white/50 uppercase text-xs tracking-wider">Member Since</Label>
                  <p className="text-white">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider mb-4">Support</h4>
                  <p className="text-white/70 mb-4">Need help with your account or have general questions?</p>
                  <a 
                    href="https://wa.me/27623105001?text=Hi%20Exertion%20Exports,%20I%20need%20some%20help%20with%20my%20account." 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#25D366] text-black hover:bg-[#1da851] font-bold uppercase tracking-wider">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support via WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card className="bg-[#0a0a0a] border-white/10 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Request Vehicle Export</CardTitle>
                <p className="text-white/50 text-sm">Fill out the details below and our team will begin sourcing and logistics.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {vehicleId && (
                    <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                      <p className="text-sm text-[#D4AF37] font-semibold">Pre-selected Vehicle ID:</p>
                      <p className="text-white font-mono text-xs">{vehicleId}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-white">Destination Country *</Label>
                    <Input 
                      id="destination" 
                      required 
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                      placeholder="e.g. United Kingdom" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-white">Estimated Budget (USD)</Label>
                    <Input 
                      id="budget" 
                      type="number"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                      placeholder="e.g. 50000" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences" className="text-white">Preferences & Notes</Label>
                    <Textarea 
                      id="preferences" 
                      value={preferences}
                      onChange={e => setPreferences(e.target.value)}
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37] min-h-[120px]" 
                      placeholder="Specific models, colors, or special requirements..." 
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Chat Modal */}
      <ChatModal 
        isOpen={!!chatRequestId} 
        onClose={() => setChatRequestId(null)} 
        requestId={chatRequestId || ''} 
        currentUserId={user.id} 
      />

      {/* EFT Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#D4AF37] flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Direct EFT Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-white/70 text-sm">
              Please use your <strong className="text-white">Request ID</strong> or <strong className="text-white">Name</strong> as the payment reference.
            </p>
            
            {eftDetails ? (
              <div className="bg-[#050505] p-4 rounded-lg border border-white/10 space-y-3 font-mono text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Bank:</span>
                  <span className="text-white">{eftDetails.bank}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Account Name:</span>
                  <span className="text-white">{eftDetails.accountName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Account Number:</span>
                  <span className="text-[#D4AF37] font-bold">{eftDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Branch Code:</span>
                  <span className="text-white">{eftDetails.branchCode}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/50 py-4">
                Loading payment details...
              </div>
            )}
            
            <p className="text-xs text-white/40 text-center mt-4">
              Once payment is made, please upload your proof of payment in the Live Chat or contact support.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setPaymentModalOpen(false)} className="bg-white/10 text-white hover:bg-white/20">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
