import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save, Home, Clock3, Users, Waves, DollarSign } from 'lucide-react';

const PROPERTY_CHOICES = ['Villa B1', 'Villa B2', 'Villa C2'];

const PropertyManageModal = ({ isOpen, property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'AVAILABLE',
    bedrooms: 3,
    maxGuests: 6,
    pool: true,
    rate: '18,000',
    checkIn: '2pm',
    checkOut: '11am',
    activeMessages: 0,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        location: property.location || '',
        status: property.status || 'AVAILABLE',
        bedrooms: property.bedrooms ?? 3,
        maxGuests: property.maxGuests ?? 6,
        pool: Boolean(property.pool),
        rate: property.rate || '18,000',
        checkIn: property.checkIn || '2pm',
        checkOut: property.checkOut || '11am',
        activeMessages: property.activeMessages ?? 0,
      });
    }
  }, [property]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      bedrooms: Number(formData.bedrooms),
      maxGuests: Number(formData.maxGuests),
      activeMessages: Number(formData.activeMessages),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            className="relative w-full max-w-4xl rounded-3xl border border-warm/10 bg-[#0F1923] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-warm/5 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold/10 text-gold">
                  <Home size={22} />
                </div>
                <div>
                  <h2 className="font-playfair text-2xl text-warm">Manage Property</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">
                    Update villa details and operational settings
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-warm-muted transition-colors hover:bg-white/5 hover:text-warm"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-6 md:p-8 space-y-5 border-r border-warm/5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Property Name</span>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Status</span>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Location</span>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Bedrooms</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Max Guests</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxGuests}
                      onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Check-in</span>
                    <input
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Check-out</span>
                    <input
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-5 bg-navy/20">
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Pool</span>
                    <select
                      value={formData.pool ? 'yes' : 'no'}
                      onChange={(e) => setFormData({ ...formData, pool: e.target.value === 'yes' })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Rate</span>
                    <input
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-warm-muted">Active Messages</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.activeMessages}
                    onChange={(e) => setFormData({ ...formData, activeMessages: e.target.value })}
                    className="w-full rounded-xl border border-warm/10 bg-navy/50 p-3 text-sm text-warm outline-none transition-colors focus:border-gold/50"
                  />
                </label>

                <div className="rounded-2xl border border-warm/10 bg-navy/40 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
                    <Clock3 size={14} /> Operational Summary
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-warm-muted">
                    <div className="rounded-xl border border-warm/5 bg-navy/50 p-3">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-1">
                        <Users size={12} className="text-gold/60" /> Capacity
                      </div>
                      <p className="text-warm">{formData.maxGuests} guests</p>
                    </div>
                    <div className="rounded-xl border border-warm/5 bg-navy/50 p-3">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-1">
                        <Waves size={12} className="text-gold/60" /> Pool
                      </div>
                      <p className="text-warm">{formData.pool ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div className="rounded-xl border border-warm/5 bg-navy/50 p-3 col-span-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-1">
                        <DollarSign size={12} className="text-gold/60" /> Nightly Rate
                      </div>
                      <p className="text-warm">₹{formData.rate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-warm/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-warm-muted transition-colors hover:bg-white/5 hover:text-warm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gold px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-navy transition-all hover:bg-gold-light"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Save size={14} /> Save Changes
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyManageModal;
