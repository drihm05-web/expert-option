import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, CheckCircle } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-white">
            About <span className="text-[#D4AF37] italic font-serif">Exertion Exports</span>
          </h1>
          <p className="text-lg text-white/70">
            Your trusted South Africa-based cross-border sourcing and procurement partner. We bridge the gap between international buyers and premium South African markets.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/10 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider">Our Mission</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              To provide international entrepreneurs and businesses with secure, structured, and highly professional access to South African vehicles, machinery, and general goods. We eliminate the risks of cross-border procurement through on-the-ground expertise and unwavering dedication to our clients' success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
