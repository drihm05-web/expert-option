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
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all');

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
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (v.bodyType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || v.brand === brandFilter;
    const matchesBody = bodyTypeFilter === 'all' || v.bodyType === bodyTypeFilter;
    return matchesSearch && matchesBrand && matchesBody;
  });

  const brands = Array.from(new Set(vehicles.map(v => v.brand)));
  const bodyTypes = Array.from(new Set(vehicles.map(v => v.bodyType).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#050505] py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-2 text-white drop-shadow-md">Available <span className="text-[#D4AF37] italic font-serif">Vehicles</span></h1>
            <p className="text-white/70 uppercase tracking-widest text-sm">Browse our curated selection of premium vehicles ready for export.</p>
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <Input 
                placeholder="Search models..." 
                className="pl-10 bg-[#050505]/80 backdrop-blur-md border-white/10 text-white focus-visible:ring-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#050505]/80 backdrop-blur-md border-white/10 text-white hover:border-[#D4AF37]/50 transition-colors text-xs font-bold uppercase tracking-widest">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white backdrop-blur-xl">
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#050505]/80 backdrop-blur-md border-white/10 text-white hover:border-[#D4AF37]/50 transition-colors text-xs font-bold uppercase tracking-widest">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white backdrop-blur-xl">
                <SelectItem value="all">Body Type</SelectItem>
                {bodyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[450px] bg-[#050505]/70 backdrop-blur-md animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-3xl bg-[#050505]/70 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
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
                <Card className="bg-[#050505]/70 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all flex flex-col h-full rounded-2xl">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img 
                      src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop'} 
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-110 contrast-125 saturate-110 hover:saturate-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider border-none shadow-lg px-3 py-1">{vehicle.condition}</Badge>
                    </div>
                    {vehicle.bodyType && (
                       <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-[#D4AF37]/50 text-[#D4AF37] font-bold uppercase tracking-[0.1em] text-[10px]">{vehicle.bodyType}</Badge>
                       </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1 bg-gradient-to-b from-transparent to-black/80 relative z-10 -mt-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="pt-2">
                        <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-2 drop-shadow-md">{vehicle.brand}</p>
                        <h3 className="text-xl font-bold text-white leading-tight uppercase tracking-wide drop-shadow-md group-hover:text-[#D4AF37] transition-colors">{vehicle.title}</h3>
                      </div>
                      <p className="text-2xl font-bold font-serif italic text-white drop-shadow-lg pt-2">${(vehicle.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-white/30 uppercase tracking-[0.15em] text-[9px] font-bold">Year</span>
                        <span className="text-white font-mono">{vehicle.year || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-white/30 uppercase tracking-[0.15em] text-[9px] font-bold">Mileage</span>
                        <span className="text-white font-mono">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} KM` : 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-white/30 uppercase tracking-[0.15em] text-[9px] font-bold">Transmission</span>
                        <span className="text-white truncate uppercase tracking-wider">{vehicle.transmission || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-white/30 uppercase tracking-[0.15em] text-[9px] font-bold">Fuel Type</span>
                        <span className="text-white truncate uppercase tracking-wider">{vehicle.fuelType || 'N/A'}</span>
                      </div>
                      {vehicle.engineSize && (
                        <div className="flex flex-col gap-1 col-span-2 py-2 border-t border-white/5">
                          <span className="text-white/30 uppercase tracking-[0.15em] text-[9px] font-bold">Engine & Drive</span>
                          <span className="text-white truncate uppercase tracking-wider">{vehicle.engineSize} • {vehicle.driveType || 'N/A'}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 bg-black/80">
                    <Link to={`/dashboard?vehicle=${vehicle.id}`} className="w-full">
                      <Button className="w-full bg-white/5 text-white border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-bold uppercase tracking-wider h-12 relative overflow-hidden group/btn">
                         <span className="relative z-10 transition-transform group-hover/btn:scale-105 inline-block">Secure This Vehicle</span>
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
