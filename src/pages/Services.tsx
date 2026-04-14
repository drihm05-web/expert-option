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
      description: "Access a wide range of passenger, commercial, and fleet vehicles. We handle sourcing, inspection, and export clearance.",
      features: ["Passenger Vehicles", "Commercial Trucks", "Fleet Acquisitions", "Export Documentation"]
    },
    {
      id: "machinery",
      icon: <Tractor className="w-12 h-12 text-[#D4AF37]" />,
      title: "Machinery Sourcing",
      description: "Heavy-duty solutions for your business. We source reliable construction, agricultural, and industrial machinery.",
      features: ["Construction Equipment", "Agricultural Machinery", "Industrial Plant", "Condition Verification"]
    },
    {
      id: "goods",
      icon: <Package className="w-12 h-12 text-[#D4AF37]" />,
      title: "General Goods",
      description: "From bulk supply to retail stock, we connect you with verified South African wholesalers and manufacturers.",
      features: ["Bulk Commodities", "Retail Stock", "Supplier Verification", "Logistics Coordination"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white">
            Our <span className="text-[#D4AF37] italic font-serif">Services</span>
          </h1>
          <p className="text-lg text-white/70">
            Comprehensive procurement solutions tailored for international buyers.
          </p>
        </div>

        <div className="space-y-12">
          {services.map((service, i) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center">
                <div className="mb-6">{service.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">{service.title}</h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div>
                  <Link to={`/contact?service=${service.id}`}>
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider">
                      Inquire Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 bg-[#111] relative min-h-[300px]">
                {/* Abstract representation or image placeholder */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
