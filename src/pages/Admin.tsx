import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
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
import { toast } from 'sonner';

export const Admin = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [eftDetails, setEftDetails] = useState({ bank: '', accountName: '', accountNumber: '', branchCode: '' });
  const [heroImage, setHeroImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Chat State
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);

  // New Vehicle Form State
  const [vTitle, setVTitle] = useState('');
  const [vBrand, setVBrand] = useState('');
  const [vMake, setVMake] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('');
  const [vMileage, setVMileage] = useState('');
  const [vPrice, setVPrice] = useState('');
  const [vCondition, setVCondition] = useState('Used');
  const [vStatus, setVStatus] = useState('Available');
  const [vImage, setVImage] = useState('');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (role === 'admin') {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [role, authLoading]);

  const fetchData = async () => {
    setError(null);
    try {
      const [vehRes, reqRes, inqRes, usersRes, setRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/export-requests'),
        fetch('/api/inquiries'),
        fetch('/api/users'),
        fetch('/api/settings')
      ]);

      if (vehRes.ok) setVehicles(await vehRes.json());
      
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        reqData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRequests(reqData);
      }

      if (inqRes.ok) {
        const inqData = await inqRes.json();
        inqData.sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
        setInquiries(inqData);
      }

      if (usersRes.ok) setUsers(await usersRes.json());

      if (setRes.ok) {
        const settingsData = await setRes.json();
        const eftSetting = settingsData.find((s: any) => s.id === 'eft_details');
        if (eftSetting && eftSetting.value) {
          setEftDetails(JSON.parse(eftSetting.value));
        }
        const heroSetting = settingsData.find((s: any) => s.id === 'heroImage');
        if (heroSetting && heroSetting.value) {
          setHeroImage(heroSetting.value);
        }
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching admin data:", err);
      setError(err.message || "A technical issue occurred while loading the admin panel. Please try again later.");
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: vTitle,
        brand: vBrand,
        make: vMake,
        model: vModel,
        year: Number(vYear),
        mileage: Number(vMileage),
        price: Number(vPrice),
        condition: vCondition,
        status: vStatus,
        images: vImage ? [vImage] : []
      };

      if (editingVehicleId) {
        const res = await fetch(`/api/vehicles/${editingVehicleId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update vehicle');
        toast.success('Vehicle updated successfully');
      } else {
        const res = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to add vehicle');
        toast.success('Vehicle added successfully');
      }
      setIsAddVehicleOpen(false);
      setEditingVehicleId(null);
      setVTitle(''); setVBrand(''); setVMake(''); setVModel(''); setVYear(''); setVMileage(''); setVPrice(''); setVImage('');
      fetchData();
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast.error(error.message || 'Failed to save vehicle');
    }
  };

  const openEditVehicle = (v: any) => {
    setEditingVehicleId(v.id);
    setVTitle(v.title || '');
    setVBrand(v.brand || '');
    setVMake(v.make || '');
    setVModel(v.model || '');
    setVYear(v.year?.toString() || '');
    setVMileage(v.mileage?.toString() || '');
    setVPrice(v.price?.toString() || '');
    setVCondition(v.condition || 'Used');
    setVStatus(v.status || 'Available');
    setVImage(v.images?.[0] || v.image_url || '');
    setIsAddVehicleOpen(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if(confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete vehicle');
        toast.success('Vehicle deleted');
        fetchData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete vehicle');
      }
    }
  };

  const handleUpdateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/export-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update request');
      toast.success(`Request status updated to ${newStatus}`);
      fetchData();
    } catch (error: any) {
      console.error("Error updating request:", error);
      toast.error(error.message || 'Failed to update request');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      toast.success(`Inquiry marked as ${newStatus}`);
      fetchData();
    } catch (error: any) {
      console.error("Error updating inquiry:", error);
      toast.error(error.message || 'Failed to update inquiry');
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update user role');
      toast.success(`User role updated to ${newRole}`);
      fetchData();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'eft_details', value: JSON.stringify(eftDetails) })
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'heroImage', value: heroImage })
      });
      if (!res.ok) throw new Error('Failed to save hero image');
      toast.success('Hero image updated successfully!');
    } catch (error: any) {
      console.error("Error saving hero image:", error);
      toast.error(error.message || 'Failed to save hero image.');
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37]">Loading...</div>;

  if (role !== 'admin') {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Access Denied. Admins only.</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="bg-red-500/10 border-red-500/50 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <Shield className="w-5 h-5" />
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

  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Admin <span className="text-[#D4AF37] italic font-serif">Control</span></h1>
          <p className="text-white/50">Manage platform data, operations, and users.</p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="bg-[#0a0a0a] border border-white/10 p-1 mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black relative">
              Export Requests
              {pendingRequestsCount > 0 && (
                <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {pendingRequestsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black relative">
              Inquiries
              {newInquiriesCount > 0 && (
                <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {newInquiriesCount}
                </span>
              )}
            </TabsTrigger>
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
                        <TableCell className="text-white font-mono text-xs">{req.user_id ? String(req.user_id).substring(0,8) : ''}...</TableCell>
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

          <TabsContent value="inquiries">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">General Inquiries & Concierge</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Date</TableHead>
                      <TableHead className="text-white/50">Type</TableHead>
                      <TableHead className="text-white/50">Name</TableHead>
                      <TableHead className="text-white/50">Email</TableHead>
                      <TableHead className="text-white/50">Message</TableHead>
                      <TableHead className="text-white/50 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inq) => (
                      <TableRow key={inq.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">{new Date(inq.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">{inq.type}</Badge>
                        </TableCell>
                        <TableCell className="text-white">{inq.name}</TableCell>
                        <TableCell className="text-white">{inq.email}</TableCell>
                        <TableCell className="text-white max-w-xs truncate" title={inq.message}>{inq.message}</TableCell>
                        <TableCell className="text-right">
                          <Select defaultValue={inq.status || 'New'} onValueChange={(v) => handleUpdateInquiryStatus(inq.id, v)}>
                            <SelectTrigger className="w-[120px] bg-[#050505] border-white/20 text-white h-8 text-xs ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {inquiries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-white/50 py-8">No inquiries found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Vehicle Inventory</CardTitle>
                <Dialog open={isAddVehicleOpen} onOpenChange={(open) => {
                  setIsAddVehicleOpen(open);
                  if (!open) {
                    setEditingVehicleId(null);
                    setVTitle(''); setVBrand(''); setVMake(''); setVModel(''); setVYear(''); setVMileage(''); setVPrice(''); setVImage('');
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]"><Plus className="w-4 h-4 mr-2"/> Add Vehicle</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>{editingVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
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
                          <Label>Make</Label>
                          <Input required value={vMake} onChange={e=>setVMake(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Model</Label>
                          <Input required value={vModel} onChange={e=>setVModel(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input type="number" required value={vYear} onChange={e=>setVYear(e.target.value)} className="bg-[#050505] border-white/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Mileage (km)</Label>
                          <Input type="number" required value={vMileage} onChange={e=>setVMileage(e.target.value)} className="bg-[#050505] border-white/20" />
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
                      <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
                        {editingVehicleId ? 'Update Vehicle' : 'Save Vehicle'}
                      </Button>
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
                        <TableCell className="text-white">${(v.price || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">{v.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditVehicle(v)} className="text-white/70 hover:text-white hover:bg-white/10 mr-2">
                            <Edit className="w-4 h-4" />
                          </Button>
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
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-[#0a0a0a] border-white/10">
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

              <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#D4AF37]" />
                    Hero Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveHeroImage} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Homepage Background Image URL</Label>
                      <Input 
                        required 
                        value={heroImage} 
                        onChange={e => setHeroImage(e.target.value)} 
                        placeholder="https://images.unsplash.com/..."
                        className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" 
                      />
                    </div>
                    {heroImage && (
                      <div className="mt-4 border border-white/10 rounded-xl overflow-hidden aspect-video">
                        <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Button type="submit" className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
                      Save Hero Image
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
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
