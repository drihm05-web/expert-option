import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Marketplace = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (response.ok) {
          const data = await response.json();
          // Filter for available vehicles
          setVehicles(data.filter((v: any) => v.status === 'Available'));
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || v.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const brands = Array.from(new Set(vehicles.map(v => v.brand)));

  return (
    <div className="min-h-screen bg-[#050505] py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-2 text-white drop-shadow-md">Available <span className="text-[#D4AF37] italic font-serif">Vehicles</span></h1>
            <p className="text-white/70 uppercase tracking-widest text-sm">Browse our curated selection of premium vehicles ready for export.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <Input 
                placeholder="Search models..." 
                className="pl-10 bg-black/40 backdrop-blur-md border-white/10 text-white focus-visible:ring-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-black/40 backdrop-blur-md border-white/10 text-white hover:border-[#D4AF37]/50 transition-colors">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white backdrop-blur-xl">
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-black/40 backdrop-blur-md animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Car className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-white uppercase tracking-wider">No vehicles found</h3>
            <p className="text-white/50 mb-8">Try adjusting your search filters or request a custom sourcing.</p>
            <Link to="/dashboard">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#F3C93F] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all">
                Request Custom Sourcing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all flex flex-col h-full rounded-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={vehicle.images?.[0] || vehicle.image_url || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop'} 
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-luminosity hover:mix-blend-normal opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider border-none shadow-lg">{vehicle.condition}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 bg-gradient-to-b from-transparent to-black/60 relative z-10 -mt-12">
                    <div className="flex justify-between items-start mb-6">
                      <div className="pt-2">
                        <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-2">{vehicle.brand}</p>
                        <h3 className="text-xl font-bold text-white leading-tight uppercase tracking-wide">{vehicle.title}</h3>
                      </div>
                      <p className="text-2xl font-bold font-serif italic text-white drop-shadow-md pt-2">${(vehicle.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-white/70">
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]" /><span className="text-white/40 uppercase text-[10px] tracking-wider w-12">Year</span> <span className="font-mono">{vehicle.year || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]" /><span className="text-white/40 uppercase text-[10px] tracking-wider w-12">KM</span> <span className="font-mono">{vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]" /><span className="text-white/40 uppercase text-[10px] tracking-wider w-12">Model</span> <span className="truncate">{vehicle.model || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]" /><span className="text-white/40 uppercase text-[10px] tracking-wider w-12">Make</span> <span className="truncate">{vehicle.make || 'N/A'}</span></div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 bg-black/60">
                    <Link to={`/dashboard?vehicle=${vehicle.id}`} className="w-full">
                      <Button className="w-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-colors font-bold uppercase tracking-wider h-12 relative overflow-hidden group/btn">
                         <span className="relative z-10 transition-transform group-hover/btn:scale-105 inline-block">Request Export</span>
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
