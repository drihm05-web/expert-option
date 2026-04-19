import React from 'react';
import { motion } from 'motion/react';
import { Car, Tractor, Package, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const Services = () => {
  const services = [
    {
      id: "vehicles",
      icon: <Car className="w-12 h-12 text-[#D4AF37]" />,
      title: "Vehicle Sourcing",
      description: "Access a wide range of passenger, commercial, and fleet vehicles. We handle sourcing, inspection, and export clearance. Specializing in Toyota Hilux, GR Sport, 4x4s, and heavy-duty trucks.",
      features: ["Passenger Vehicles", "Commercial Trucks", "Fleet Acquisitions", "Export Documentation"],
      image: "https://images.unsplash.com/photo-1590362891991-f2009d3233bf?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: "machinery",
      icon: <Tractor className="w-12 h-12 text-[#D4AF37]" />,
      title: "Machinery Sourcing",
      description: "Heavy-duty solutions for your business. We source reliable construction, agricultural, and industrial machinery direct from trusted suppliers.",
      features: ["Construction Equipment", "Agricultural Machinery", "Industrial Plant", "Condition Verification"],
      image: "https://images.unsplash.com/photo-1581452292723-d343c683b791?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "goods",
      icon: <Package className="w-12 h-12 text-[#D4AF37]" />,
      title: "General Goods",
      description: "From bulk supply to retail stock, we connect you with verified South African wholesalers and manufacturers for seamless procurement.",
      features: ["Bulk Commodities", "Retail Stock", "Supplier Verification", "Logistics Coordination"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-md">
            Our <span className="text-[#D4AF37] italic font-serif">Services</span>
          </h1>
          <p className="text-lg text-white/70 uppercase tracking-widest">
            Comprehensive procurement solutions tailored for international buyers.
          </p>
        </div>

        <div className="space-y-16">
          {services.map((service, i) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all overflow-hidden flex flex-col md:flex-row group"
            >
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center relative z-20">
                <div className="mb-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all transform origin-left">{service.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">{service.title}</h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed font-light">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-3 shadow-[0_0_5px_rgba(212,175,55,0.8)]" />
                      <span className="text-sm tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <Link to={`/contact?service=${service.id}`}>
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-bold uppercase tracking-wider transition-all">
                      Inquire Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-2/5 relative min-h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10 md:bg-gradient-to-l" />
                <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
