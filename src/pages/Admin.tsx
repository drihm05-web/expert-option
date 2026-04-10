import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, Edit, Shield, MessageSquare, Settings } from 'lucide-react';
import { ChatModal } from '../components/ChatModal';

export const Admin = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [eftDetails, setEftDetails] = useState({ bank: '', accountName: '', accountNumber: '', branchCode: '' });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Chat State
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);

  // New Vehicle Form State
  const [vTitle, setVTitle] = useState('');
  const [vBrand, setVBrand] = useState('');
  const [vPrice, setVPrice] = useState('');
  const [vCondition, setVCondition] = useState('Used');
  const [vStatus, setVStatus] = useState('Available');
  const [vImage, setVImage] = useState('');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  useEffect(() => {
    if (role === 'admin') {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [role, authLoading]);

  const fetchData = async () => {
    try {
      const { data: vData } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      setVehicles(vData || []);

      const { data: rData } = await supabase.from('export_requests').select('*').order('created_at', { ascending: false });
      setRequests(rData || []);

      const { data: uData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      setUsers(uData || []);

      const { data: settingsData } = await supabase.from('settings').select('value').eq('key', 'eft_details').single();
      if (settingsData) setEftDetails(settingsData.value);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('vehicles').insert([{
        title: vTitle,
        brand: vBrand,
        price: Number(vPrice),
        condition: vCondition,
        status: vStatus,
        images: vImage ? [vImage] : []
      }]);
      setIsAddVehicleOpen(false);
      fetchData();
      // Reset
      setVTitle(''); setVBrand(''); setVPrice(''); setVImage('');
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if(confirm('Are you sure?')) {
      await supabase.from('vehicles').delete().eq('id', id);
      fetchData();
    }
  };

  const handleUpdateRequestStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('export_requests').update({ status: newStatus }).eq('id', id);
      fetchData();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      await supabase.from('users').update({ role: newRole }).eq('id', id);
      fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await supabase.from('settings').upsert({
        key: 'eft_details',
        value: eftDetails
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37]">Loading...</div>;

  if (role !== 'admin') {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Access Denied. Admins only.</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Admin <span className="text-[#D4AF37] italic font-serif">Control</span></h1>
          <p className="text-white/50">Manage platform data, operations, and users.</p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="bg-[#0a0a0a] border border-white/10 p-1 mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Export Requests</TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Vehicles</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">User Roles</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">All Export Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Date</TableHead>
                      <TableHead className="text-white/50">User ID</TableHead>
                      <TableHead className="text-white/50">Destination</TableHead>
                      <TableHead className="text-white/50">Budget</TableHead>
                      <TableHead className="text-white/50">Status</TableHead>
                      <TableHead className="text-white/50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">{new Date(req.createdAt || req.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-white font-mono text-xs">{req.user_id?.substring(0,8)}...</TableCell>
                        <TableCell className="text-white">{req.destination}</TableCell>
                        <TableCell className="text-white">${req.budget?.toLocaleString() || 'N/A'}</TableCell>
                        <TableCell>
                          <Select defaultValue={req.status} onValueChange={(v) => handleUpdateRequestStatus(req.id, v)}>
                            <SelectTrigger className="w-[140px] bg-[#050505] border-white/20 text-white h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              {['Pending', 'Sourcing', 'Inspection', 'Cleared', 'Shipped', 'Delivered'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button onClick={() => setChatRequestId(req.id)} size="sm" variant="outline" className="border-white/20 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Vehicle Inventory</CardTitle>
                <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]"><Plus className="w-4 h-4 mr-2"/> Add Vehicle</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddVehicle} className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input required value={vTitle} onChange={e=>setVTitle(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Brand</Label>
                          <Input required value={vBrand} onChange={e=>setVBrand(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (USD)</Label>
                          <Input type="number" required value={vPrice} onChange={e=>setVPrice(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input value={vImage} onChange={e=>setVImage(e.target.value)} className="bg-[#050505] border-white/20" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <Select value={vCondition} onValueChange={setVCondition}>
                            <SelectTrigger className="bg-[#050505] border-white/20"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Used">Used</SelectItem>
                              <SelectItem value="Refurbished">Refurbished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={vStatus} onValueChange={setVStatus}>
                            <SelectTrigger className="bg-[#050505] border-white/20"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="Reserved">Reserved</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F]">Save Vehicle</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Vehicle</TableHead>
                      <TableHead className="text-white/50">Brand</TableHead>
                      <TableHead className="text-white/50">Price</TableHead>
                      <TableHead className="text-white/50">Status</TableHead>
                      <TableHead className="text-white/50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((v) => (
                      <TableRow key={v.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{v.title}</TableCell>
                        <TableCell className="text-white">{v.brand}</TableCell>
                        <TableCell className="text-white">${v.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">{v.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(v.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  User Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Name</TableHead>
                      <TableHead className="text-white/50">Email</TableHead>
                      <TableHead className="text-white/50">Joined</TableHead>
                      <TableHead className="text-white/50">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{u.name || 'N/A'}</TableCell>
                        <TableCell className="text-white">{u.email}</TableCell>
                        <TableCell className="text-white">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select defaultValue={u.role} onValueChange={(v) => handleUpdateUserRole(u.id, v)}>
                            <SelectTrigger className="w-[120px] bg-[#050505] border-white/20 text-white h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-[#0a0a0a] border-white/10 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#D4AF37]" />
                  Payment Settings (EFT)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Bank Name</Label>
                    <Input 
                      required 
                      value={eftDetails.bank} 
                      onChange={e => setEftDetails({...eftDetails, bank: e.target.value})} 
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Account Name</Label>
                    <Input 
                      required 
                      value={eftDetails.accountName} 
                      onChange={e => setEftDetails({...eftDetails, accountName: e.target.value})} 
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Account Number</Label>
                    <Input 
                      required 
                      value={eftDetails.accountNumber} 
                      onChange={e => setEftDetails({...eftDetails, accountNumber: e.target.value})} 
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Branch Code</Label>
                    <Input 
                      required 
                      value={eftDetails.branchCode} 
                      onChange={e => setEftDetails({...eftDetails, branchCode: e.target.value})} 
                      className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                    />
                  </div>
                  <Button type="submit" disabled={savingSettings} className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Admin Live Chat Modal */}
      <ChatModal 
        isOpen={!!chatRequestId} 
        onClose={() => setChatRequestId(null)} 
        requestId={chatRequestId || ''} 
        currentUserId={user?.id || ''} 
      />
    </div>
  );
};
