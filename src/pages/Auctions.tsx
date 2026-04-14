import React from 'react';
import { motion } from 'motion/react';
import { Gavel, FileCheck, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const Auctions = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white">
            Auctions & <span className="text-[#D4AF37] italic font-serif">Procurement</span>
          </h1>
          <p className="text-lg text-white/70">
            Exclusive access to South Africa's premier vehicle and machinery auctions, fully managed by our on-ground experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10"
          >
            <Gavel className="w-12 h-12 text-[#D4AF37] mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Auction Access</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Navigating South African auctions requires local presence and compliance. We act as your proxy, providing real-time condition reports, bidding on your behalf, and securing assets at wholesale prices.
            </p>
            <ul className="space-y-3 text-white/80 mb-8">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Pre-auction physical inspections</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Live bidding representation</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Post-auction logistics & clearance</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10"
          >
            <FileCheck className="w-12 h-12 text-[#D4AF37] mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">FICA & Compliance</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              South African law requires strict FICA (Financial Intelligence Centre Act) compliance for high-value purchases. We guide you through the documentation process to ensure your purchases are 100% legal and secure.
            </p>
            <ul className="space-y-3 text-white/80 mb-8">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Document verification support</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Secure payment routing</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Export permit facilitation</li>
            </ul>
          </motion.div>
        </div>

        <div className="text-center">
          <Link to="/contact?subject=Auction Support">
            <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider px-8 py-6 text-lg">
              Join Auction Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
