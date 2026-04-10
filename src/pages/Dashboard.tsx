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
import { Package, MessageSquare, Plus, Clock, CheckCircle2, Truck, Ship, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const STATUS_STEPS = ['Pending', 'Sourcing', 'Inspection', 'Cleared', 'Shipped', 'Delivered'];

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const prefilledVehicleId = searchParams.get('vehicle');
  
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(prefilledVehicleId ? 'new' : 'active');

  // New Request Form State
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [vehicleId, setVehicleId] = useState(prefilledVehicleId || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
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
      fetchRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Client <span className="text-[#D4AF37] italic font-serif">Dashboard</span></h1>
          <p className="text-white/50">Manage your export requests and track progress.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#0a0a0a] border border-white/10 p-1 mb-8">
            <TabsTrigger value="active" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Active Exports</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">New Request</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {requests.length === 0 ? (
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
                {requests.map((req) => {
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
                            <p className="text-sm text-white/50 mt-1">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50 uppercase tracking-wider">{req.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
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

                        <div className="flex justify-end">
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message Agent
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
    </div>
  );
};
