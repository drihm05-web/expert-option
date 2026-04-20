import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, CheckCircle, Globe2, Award, Briefcase } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 mb-6">
            <Globe2 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Global Reach, Local Expertise</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-md">
            About <span className="text-[#D4AF37] italic font-serif">Exertion</span>
          </h1>
          <p className="text-lg text-white/70 tracking-wide font-light leading-relaxed">
            Your trusted South Africa-based cross-border sourcing and procurement partner. We bridge the gap between international buyers and premium South African markets.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Shield className="w-8 h-8 text-[#D4AF37]" />,
              title: "Clarity",
              desc: "Transparent processes, clear pricing, and straightforward communication from sourcing to delivery."
            },
            {
              icon: <CheckCircle className="w-8 h-8 text-[#D4AF37]" />,
              title: "Verification",
              desc: "Rigorous inspection and verification of all assets and suppliers to ensure quality and compliance."
            },
            {
              icon: <Target className="w-8 h-8 text-[#D4AF37]" />,
              title: "Execution",
              desc: "Flawless logistics, handling, and export documentation for a seamless cross-border experience."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-[#050505]/70 backdrop-blur-xl p-10 rounded-3xl border border-white/10 text-center hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 mb-8 group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-[0.15em]">{item.title}</h3>
              <p className="text-white/60 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/20 p-2 relative">
               <div className="absolute inset-0 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent opacity-50 rounded-3xl" />
               <img 
                 src="https://images.unsplash.com/photo-1541888081683-de077b96057a?q=80&w=2664&auto=format&fit=crop" 
                 alt="Professional Handshake" 
                 className="w-full h-full object-cover rounded-2xl mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 opacity-80"
                 referrerPolicy="no-referrer"
               />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-[#050505]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-10 md:p-14 relative overflow-hidden">
               <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-[#D4AF37]/10 rounded-full blur-[50px] pointer-events-none" />
               
               <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-4">
                 <Award className="w-8 h-8 text-[#D4AF37]" /> Our Mission
               </h2>
               
               <p className="text-lg text-white/70 leading-relaxed mb-8 font-light">
                 To provide international entrepreneurs and businesses with secure, structured, and highly professional access to South African vehicles, machinery, and general goods. 
               </p>
               <p className="text-lg text-white/70 leading-relaxed mb-10 font-light">
                 We eliminate the risks of cross-border procurement through on-the-ground expertise, strategic vendor networks, and an unwavering dedication to our clients' success.
               </p>

               <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 mt-auto">
                 <div>
                   <h4 className="text-4xl font-bold text-[#D4AF37] mb-2 font-serif italic">100%</h4>
                   <p className="text-xs text-white/50 uppercase tracking-widest font-bold">FICA Compliant</p>
                 </div>
                 <div>
                   <h4 className="text-4xl font-bold text-[#D4AF37] mb-2 font-serif italic">15+</h4>
                   <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Years Experience</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
