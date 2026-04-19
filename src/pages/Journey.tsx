import React from 'react';
import { motion } from 'motion/react';
import { Globe, MapPin } from 'lucide-react';

export const Journey = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-md">
            Client <span className="text-[#D4AF37] italic font-serif">Journey</span>
          </h1>
          <p className="text-lg text-white/70 uppercase tracking-widest">
            Whether you are procuring from afar or visiting South Africa in person, we have a structured process to guarantee success.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Remote Journey */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -z-10 group-hover:bg-[#D4AF37]/10 transition-colors" />
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="p-4 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Remote Sourcing</h2>
            </div>
            
            <div className="space-y-8 relative z-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37]/50 before:via-white/10 before:to-transparent">
              {[
                { step: "01", title: "Consultation & Mandate", desc: "Define your requirements, budget, and sign the sourcing mandate." },
                { step: "02", title: "Market Scanning", desc: "Our team locates assets across private sellers, dealerships, and auctions." },
                { step: "03", title: "Inspection & Reporting", desc: "Detailed photos, videos, and mechanical reports sent to your dashboard." },
                { step: "04", title: "Procurement & Payment", desc: "Secure transaction handling and FICA compliance." },
                { step: "05", title: "Export & Logistics", desc: "Customs clearance, transport to port, and shipping to your destination." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group/step is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-[#D4AF37] text-black font-bold text-sm shrink-0 md:order-1 md:group-odd/step:-translate-x-1/2 md:group-even/step:translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.4)] z-10 group-hover/step:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm group-hover/step:border-[#D4AF37]/50 transition-colors">
                    <h3 className="font-bold text-white mb-1 tracking-wide">{item.title}</h3>
                    <p className="text-sm text-white/60 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* On-Ground Journey */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10 group-hover:bg-white/10 transition-colors" />
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">On-Ground Visit</h2>
            </div>
            
            <div className="space-y-8 relative z-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/30 before:via-white/10 before:to-transparent">
              {[
                { step: "01", title: "Pre-Arrival Planning", desc: "Itinerary creation, hotel bookings, and target asset identification." },
                { step: "02", title: "VIP Airport Pickup", desc: "Personal welcome at OR Tambo International and transfer to accommodation." },
                { step: "03", title: "Guided Viewings", desc: "Chauffeured visits to suppliers, dealerships, and auction houses." },
                { step: "04", title: "Negotiation & Purchase", desc: "On-site assistance with negotiations, paperwork, and payments." },
                { step: "05", title: "Logistics Handover", desc: "You fly home; we handle the export clearance and shipping." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group/step is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-white text-black font-bold text-sm shrink-0 md:order-1 md:group-odd/step:-translate-x-1/2 md:group-even/step:translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.2)] z-10 group-hover/step:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm group-hover/step:border-white/40 transition-colors">
                    <h3 className="font-bold text-white mb-1 tracking-wide">{item.title}</h3>
                    <p className="text-sm text-white/60 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
