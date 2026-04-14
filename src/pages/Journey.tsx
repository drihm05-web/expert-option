import React from 'react';
import { motion } from 'motion/react';
import { Globe, MapPin } from 'lucide-react';

export const Journey = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white">
            Client <span className="text-[#D4AF37] italic font-serif">Journey</span>
          </h1>
          <p className="text-lg text-white/70">
            Whether you are procuring from afar or visiting South Africa in person, we have a structured process to guarantee success.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Remote Journey */}
          <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-[#D4AF37]/10 rounded-2xl">
                <Globe className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Remote Sourcing</h2>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {[
                { step: "01", title: "Consultation & Mandate", desc: "Define your requirements, budget, and sign the sourcing mandate." },
                { step: "02", title: "Market Scanning", desc: "Our team locates assets across private sellers, dealerships, and auctions." },
                { step: "03", title: "Inspection & Reporting", desc: "Detailed photos, videos, and mechanical reports sent to your dashboard." },
                { step: "04", title: "Procurement & Payment", desc: "Secure transaction handling and FICA compliance." },
                { step: "05", title: "Export & Logistics", desc: "Customs clearance, transport to port, and shipping to your destination." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-[#D4AF37] text-black font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(212,175,55,0.2)]">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-[#050505]">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Ground Journey */}
          <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-[#D4AF37]/10 rounded-2xl">
                <MapPin className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">On-Ground Visit</h2>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {[
                { step: "01", title: "Pre-Arrival Planning", desc: "Itinerary creation, hotel bookings, and target asset identification." },
                { step: "02", title: "VIP Airport Pickup", desc: "Personal welcome at OR Tambo International and transfer to accommodation." },
                { step: "03", title: "Guided Viewings", desc: "Chauffeured visits to suppliers, dealerships, and auction houses." },
                { step: "04", title: "Negotiation & Purchase", desc: "On-site assistance with negotiations, paperwork, and payments." },
                { step: "05", title: "Logistics Handover", desc: "You fly home; we handle the export clearance and shipping." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-white text-black font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-[#050505]">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
