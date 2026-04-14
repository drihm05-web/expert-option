import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Marketplace = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'Available');
        
        if (error) throw error;
        setVehicles(data || []);
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
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Available <span className="text-[#D4AF37] italic font-serif">Vehicles</span></h1>
            <p className="text-white/50">Browse our curated selection of premium vehicles ready for export.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input 
                placeholder="Search models..." 
                className="pl-10 bg-[#0a0a0a] border-white/10 text-white focus-visible:ring-[#D4AF37]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#0a0a0a] border-white/10 text-white">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-[#0a0a0a] animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-2xl bg-[#0a0a0a]">
            <Car className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
            <p className="text-white/50">Try adjusting your search filters or request a custom sourcing.</p>
            <Link to="/dashboard">
              <Button className="mt-6 bg-[#D4AF37] text-black hover:bg-[#F3C93F]">Request Custom Sourcing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={vehicle.images?.[0] || vehicle.image_url || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop'} 
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#D4AF37]">{vehicle.condition}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-[#D4AF37] font-bold uppercase tracking-wider mb-1">{vehicle.brand}</p>
                        <h3 className="text-xl font-bold text-white leading-tight">{vehicle.title}</h3>
                      </div>
                      <p className="text-xl font-bold font-serif italic text-white">${(vehicle.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/50">
                      <div><span className="block text-white/30 uppercase text-[10px] tracking-wider">Year</span> {vehicle.year || 'N/A'}</div>
                      <div><span className="block text-white/30 uppercase text-[10px] tracking-wider">Mileage</span> {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</div>
                      <div><span className="block text-white/30 uppercase text-[10px] tracking-wider">Model</span> {vehicle.model || 'N/A'}</div>
                      <div><span className="block text-white/30 uppercase text-[10px] tracking-wider">Make</span> {vehicle.make || 'N/A'}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link to={`/dashboard?vehicle=${vehicle.id}`} className="w-full">
                      <Button className="w-full bg-white text-black hover:bg-[#D4AF37] hover:text-black transition-colors font-bold uppercase tracking-wider">
                        Request Export
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
