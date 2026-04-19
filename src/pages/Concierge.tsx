import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, Hotel, CarFront, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export const Concierge = () => {
  const [formData, setFormData] = useState({ name: '', email: '', dates: '', requirements: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Concierge',
          name: formData.name,
          email: formData.email,
          message: `Dates: ${formData.dates}\nRequirements: ${formData.requirements}`,
          status: 'New',
          createdAt: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setFormData({ name: '', email: '', dates: '', requirements: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white">
            On-Ground <span className="text-[#D4AF37] italic font-serif">Concierge</span>
          </h1>
          <p className="text-lg text-white/70">
            Premium support for international clients visiting South Africa. We handle the logistics so you can focus on business.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Plane />, title: "Airport Transfers", desc: "VIP pickup and drop-off at major airports." },
            { icon: <Hotel />, title: "Accommodation", desc: "Secure, premium hotel bookings near business hubs." },
            { icon: <CarFront />, title: "Transport", desc: "Chauffeured transport to suppliers and auctions." },
            { icon: <Users />, title: "Guided Visits", desc: "Expert accompaniment during negotiations." }
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-[#0a0a0a] p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-center">Book Concierge Services</h2>
          
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
              <p className="text-white/70">Our concierge team will contact you shortly to finalize your itinerary.</p>
              <Button onClick={() => setStatus('idle')} className="mt-6 bg-white/10 text-white hover:bg-white/20">Book Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Full Name</Label>
                  <Input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="bg-[#050505] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email Address</Label>
                  <Input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="bg-[#050505] border-white/10 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Expected Travel Dates</Label>
                <Input required value={formData.dates} onChange={e=>setFormData({...formData, dates: e.target.value})} placeholder="e.g., Oct 12 - Oct 20" className="bg-[#050505] border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Specific Requirements</Label>
                <Textarea required value={formData.requirements} onChange={e=>setFormData({...formData, requirements: e.target.value})} placeholder="Tell us what you need to view, auction interests, etc." className="bg-[#050505] border-white/10 text-white min-h-[120px]" />
              </div>
              {status === 'error' && <p className="text-red-500 text-sm">An error occurred. Please try again.</p>}
              <Button type="submit" disabled={status === 'submitting'} className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider">
                {status === 'submitting' ? 'Submitting...' : 'Request Concierge'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
