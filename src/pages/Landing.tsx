import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, ShieldCheck, Globe, Plane, FileCheck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" 
            alt="Luxury Vehicle" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            FROM DREAMS TO REALITY,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3C93F] italic font-serif">
              WORRY-FREE
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 uppercase tracking-widest"
          >
            With a team you can trust. Premium vehicle export & logistics from South Africa to the world.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/vehicles">
              <Button size="lg" className="w-full sm:w-auto bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold tracking-wider uppercase h-14 px-8">
                Browse Vehicles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-bold tracking-wider uppercase h-14 px-8">
                Start Export Process
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About / Trust Section */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">Our Legacy</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">10+ YEARS OF EXCELLENCE IN GLOBAL TRADE.</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Exertion Exports is South Africa's premier vehicle export company. We specialize in sourcing, inspecting, and shipping high-end vehicles across borders with zero friction. Your peace of mind is our highest priority.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
                  <span className="font-semibold uppercase tracking-wider text-sm">Verified Secure</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-[#D4AF37]" />
                  <span className="font-semibold uppercase tracking-wider text-sm">Global Reach</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-full overflow-hidden border border-white/10 p-2">
                <img 
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop" 
                  alt="Export Logistics" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">What We Do</h2>
            <h3 className="text-4xl font-bold">PREMIUM SERVICES</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Vehicle Sourcing", desc: "We find the exact make and model you desire from our trusted network." },
              { icon: ShieldCheck, title: "Vehicle Inspection", desc: "Rigorous 150-point checks ensuring top quality before purchase." },
              { icon: FileCheck, title: "Export Clearance", desc: "We handle all complex paperwork, customs, and police clearances." },
              { icon: Globe, title: "Transportation", desc: "Secure transport to ports and borders with full insurance." },
              { icon: Plane, title: "Travel Assistance", desc: "Car hire and accommodation support for visiting clients." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors group"
              >
                <service.icon className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-3 uppercase tracking-wide">{service.title}</h4>
                <p className="text-white/50 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">The Process</h2>
            <h3 className="text-4xl font-bold">HOW IT WORKS</h3>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
            {[
              { step: "01", title: "Choose Vehicle" },
              { step: "02", title: "Inspection" },
              { step: "03", title: "Documentation" },
              { step: "04", title: "Shipping" },
              { step: "05", title: "Delivery" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#050505] border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold font-serif italic text-[#D4AF37] mb-4">
                  {item.step}
                </div>
                <h4 className="font-bold uppercase tracking-wider text-sm">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
