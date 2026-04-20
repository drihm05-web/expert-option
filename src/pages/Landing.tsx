import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, ShieldCheck, Globe, Search, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/siteContext';

export const Landing = () => {
  const { siteData } = useSiteData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteData.heroImage} 
            alt="Luxury Vehicle" 
            className="w-full h-full object-cover brightness-110 contrast-125 saturate-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            {siteData.landingTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 uppercase tracking-widest font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {siteData.landingSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center drop-shadow-xl"
          >
            <Link to="/contact?subject=Quote Request">
              <Button size="lg" className="w-full sm:w-auto bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold tracking-[0.15em] uppercase h-14 px-8 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all">
                Request a Quote
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-black/40 backdrop-blur-sm border-[#D4AF37]/50 text-white hover:bg-[#D4AF37]/10 font-bold tracking-[0.15em] uppercase h-14 px-8 transition-colors">
                Start Sourcing
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 font-bold tracking-[0.15em] uppercase h-14 px-8 transition-colors">
                Speak to Our Team
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Verified Suppliers", value: "100+" },
              { label: "Successful Exports", value: "500+" },
              { label: "Countries Served", value: "15+" },
              { label: "FICA Compliant", value: "100%" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">{stat.value}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview of Services */}
      <section id="services" className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">What We Do</h2>
            <h3 className="text-4xl font-bold uppercase tracking-tight">Core Services</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Vehicle Sourcing", desc: "Passenger, commercial, and fleet vehicles sourced and inspected." },
              { icon: ShieldCheck, title: "Machinery Sourcing", desc: "Construction, agricultural, and industrial machinery procurement." },
              { icon: Globe, title: "General Goods", desc: "Bulk supply and retail stock from verified South African wholesalers." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <service.icon className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all" />
                <h4 className="text-xl font-bold mb-3 uppercase tracking-wide">{service.title}</h4>
                <p className="text-white/50 leading-relaxed mb-6">{service.desc}</p>
                <Link to="/services" className="text-[#D4AF37] font-bold uppercase text-sm tracking-wider flex items-center group-hover:text-[#F3C93F]">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">The Exertion Advantage</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight uppercase">Why Choose Us?</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                We eliminate the risks of cross-border procurement. With our on-the-ground expertise, we ensure that every transaction is secure, compliant, and executed with precision.
              </p>
              <ul className="space-y-4">
                {[
                  "End-to-end logistics management",
                  "Strict FICA & legal compliance",
                  "On-ground physical inspections",
                  "Secure payment routing"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-[#D4AF37]/20 p-2 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent opacity-50 rounded-3xl" />
                <img 
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop" 
                  alt="Export Logistics" 
                  className="w-full h-full object-cover rounded-2xl mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-[10%] top-[20%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-[10%] bottom-[20%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">Simplified Flow</h2>
            <h3 className="text-4xl font-bold uppercase">How It Works</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -translate-y-1/2 z-0" />
            {[
              { step: "01", title: "Consultation" },
              { step: "02", title: "Sourcing & Inspection" },
              { step: "03", title: "Procurement" },
              { step: "04", title: "Export & Delivery" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#050505] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center text-xl font-bold font-serif italic text-[#D4AF37] mb-4 transition-all duration-300">
                  {item.step}
                </div>
                <h4 className="font-bold uppercase tracking-wider text-sm group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/journey">
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-wider min-h-[56px] px-8">
                View Detailed Client Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
