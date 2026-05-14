import React from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, Users, Bath, BedDouble, Waves, DollarSign, Clock } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const PROPERTIES = [
  {
    id: 'villa-b1',
    name: 'Villa B1',
    location: 'Assagao, North Goa',
    bedrooms: 3,
    maxGuests: 6,
    pool: true,
    rate: '18,000',
    checkIn: '2pm',
    checkOut: '11am',
    status: 'AVAILABLE',
    activeMessages: 2,
    features: ['Private Pool', 'Luxury Decor', 'Chef on call']
  },
  {
    id: 'villa-b2',
    name: 'Villa B2',
    location: 'Anjuna, North Goa',
    bedrooms: 4,
    maxGuests: 8,
    pool: true,
    rate: '24,000',
    checkIn: '2pm',
    checkOut: '11am',
    status: 'OCCUPIED',
    activeMessages: 1,
    features: ['Infinity Pool', 'Beachfront', 'Private Gym']
  },
  {
    id: 'villa-c2',
    name: 'Villa C2',
    location: 'Vagator, North Goa',
    bedrooms: 2,
    maxGuests: 4,
    pool: false,
    rate: '15,000',
    checkIn: '2pm',
    checkOut: '11am',
    status: 'AVAILABLE',
    activeMessages: 0,
    features: ['Sea View', 'Sunset Terrace', 'Jacuzzi']
  }
];

const PropertyCard = ({ property, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-navy-surface border border-warm/10 rounded-2xl overflow-hidden group hover:border-gold/50 transition-all shadow-xl shadow-black/20"
  >
    <div className="h-48 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60 z-10" />
      <div className="absolute top-4 right-4 z-20">
        <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border ${
          property.status === 'AVAILABLE' 
            ? 'bg-success/10 border-success text-success' 
            : 'bg-warning/10 border-warning text-warning'
        }`}>
          ● {property.status}
        </span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
        <Home size={64} className="text-gold/20" />
      </div>
      <div className="absolute bottom-4 left-6 z-20">
        <h3 className="text-warm font-playfair text-2xl mb-1">{property.name}</h3>
        <p className="text-warm-muted text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <MapPin size={12} className="text-gold" /> {property.location}
        </p>
      </div>
    </div>

    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4 border-b border-warm/5 pb-6">
        <div className="flex items-center gap-3 text-warm-muted">
          <BedDouble size={18} className="text-gold/50" />
          <span className="text-xs font-medium">{property.bedrooms} Bedrooms</span>
        </div>
        <div className="flex items-center gap-3 text-warm-muted">
          <Users size={18} className="text-gold/50" />
          <span className="text-xs font-medium">Max {property.maxGuests} Guests</span>
        </div>
        <div className="flex items-center gap-3 text-warm-muted">
          <Waves size={18} className="text-gold/50" />
          <span className="text-xs font-medium">Pool: {property.pool ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center gap-3 text-warm-muted">
          <DollarSign size={18} className="text-gold/50" />
          <span className="text-xs font-medium">₹{property.rate}/night</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-warm-muted">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gold/50" />
          <span>In: {property.checkIn} | Out: {property.checkOut}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-warm/5 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[8px] text-warm-muted uppercase tracking-widest font-bold mb-1">Active Messages</span>
          <span className="text-gold font-playfair text-xl leading-none">{property.activeMessages}</span>
        </div>
        <button className="bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gold hover:text-navy transition-all">
          Manage Property
        </button>
      </div>
    </div>
  </motion.div>
);

const PropertiesPage = () => {
  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Properties" />
        
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-warm font-playfair text-3xl mb-1">Properties</h2>
              <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">
                Managing {PROPERTIES.length} luxury villas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROPERTIES.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} index={idx} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PropertiesPage;
