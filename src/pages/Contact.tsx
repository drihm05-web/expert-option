import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

export const Contact = () => {
  const [searchParams] = useSearchParams();
  const prefilledSubject = searchParams.get('subject') || searchParams.get('service') || '';
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: prefilledSubject, message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'Contact',
        name: formData.name,
        email: formData.email,
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        status: 'New',
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
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
            Contact <span className="text-[#D4AF37] italic font-serif">Us</span>
          </h1>
          <p className="text-lg text-white/70">
            Get in touch with our team to start your sourcing journey or ask any questions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Direct Contact</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-lg shrink-0">
                    <Phone className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                    <a href="https://wa.me/27623105001" className="text-white hover:text-[#D4AF37] transition-colors font-mono text-lg">+27 62 310 5001</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-lg shrink-0">
                    <Mail className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:info@exertionexports.com" className="text-white hover:text-[#D4AF37] transition-colors">info@exertionexports.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-lg shrink-0">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Headquarters</p>
                    <p className="text-white">Johannesburg, South Africa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">Send an Inquiry</h2>
              
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                  <p className="text-white/70">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <Button onClick={() => setStatus('idle')} className="mt-8 bg-white/10 text-white hover:bg-white/20">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name</Label>
                      <Input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email Address</Label>
                      <Input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Subject</Label>
                    <Input required value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Message</Label>
                    <Textarea required value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37] min-h-[150px]" />
                  </div>
                  {status === 'error' && <p className="text-red-500 text-sm">An error occurred. Please try again.</p>}
                  <Button type="submit" disabled={status === 'submitting'} className="w-full bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider py-6">
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
