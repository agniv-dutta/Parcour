import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BedDouble, Clock, DollarSign, MapPin, Users, Waves, Settings2 } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/TopBar';
import { useToast } from '../hooks/useToast';
import PropertyManageModal from '../components/properties/PropertyManageModal';

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

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const property = location.state?.property || PROPERTIES.find((item) => item.id === id) || PROPERTIES[0];
  const [managedProperty, setManagedProperty] = useState(property);
  const [isManageOpen, setIsManageOpen] = useState(false);

  useEffect(() => {
    setManagedProperty(property);
  }, [property]);

  const handleSaveProperty = (updates) => {
    setManagedProperty((current) => ({ ...current, ...updates }));
    setIsManageOpen(false);
    showToast({ message: `Saved changes for ${updates.name || managedProperty.name}`, type: 'success' });
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Property Details" />

        <main className="flex-1 overflow-y-auto app-scrollbar p-8">
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 text-warm-muted hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Properties
            </button>

            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold mb-2">{managedProperty.status}</p>
                  <h2 className="text-warm font-playfair text-4xl mb-2">{managedProperty.name}</h2>
                  <p className="text-warm-muted text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                    <MapPin size={14} className="text-gold" /> {managedProperty.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManageOpen(true)}
                  className="bg-gold text-navy font-bold px-5 py-3 rounded-lg text-[10px] uppercase tracking-widest hover:bg-gold-light transition-all"
                >
                  Manage Property
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-warm-muted text-[10px] uppercase tracking-widest font-bold mb-2">
                    <BedDouble size={14} className="text-gold/60" /> Bedrooms
                  </div>
                    <p className="text-warm font-playfair text-2xl">{managedProperty.bedrooms}</p>
                </div>
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-warm-muted text-[10px] uppercase tracking-widest font-bold mb-2">
                    <Users size={14} className="text-gold/60" /> Guests
                  </div>
                    <p className="text-warm font-playfair text-2xl">{managedProperty.maxGuests}</p>
                </div>
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-warm-muted text-[10px] uppercase tracking-widest font-bold mb-2">
                    <Waves size={14} className="text-gold/60" /> Pool
                  </div>
                    <p className="text-warm font-playfair text-2xl">{managedProperty.pool ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-warm-muted text-[10px] uppercase tracking-widest font-bold mb-2">
                    <DollarSign size={14} className="text-gold/60" /> Rate
                  </div>
                    <p className="text-warm font-playfair text-2xl">₹{managedProperty.rate}</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-warm font-playfair text-xl mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-gold" /> Stay Details
                </h3>
                <div className="space-y-4 text-sm text-warm-muted">
                  <p><span className="text-warm font-bold">Check-in:</span> {managedProperty.checkIn}</p>
                  <p><span className="text-warm font-bold">Check-out:</span> {managedProperty.checkOut}</p>
                  <p><span className="text-warm font-bold">Active Messages:</span> {managedProperty.activeMessages}</p>
                </div>
              </section>

              <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-warm font-playfair text-xl mb-6 flex items-center gap-2">
                  <Settings2 size={18} className="text-gold" /> Features
                </h3>
                <div className="flex flex-wrap gap-3">
                  {managedProperty.features.map((feature) => (
                    <span key={feature} className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest">
                      {feature}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <PropertyManageModal
        isOpen={isManageOpen}
        property={managedProperty}
        onClose={() => setIsManageOpen(false)}
        onSave={handleSaveProperty}
      />
    </div>
  );
};

export default PropertyDetailPage;
