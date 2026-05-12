import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Award } from 'lucide-react';

const GuestProfile = ({ guest }) => {
  if (!guest) return null;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold/20 p-1">
          <img 
            src={guest.avatar || `https://ui-avatars.com/api/?name=${guest.name}&background=C9A96E&color=0D1B2A`} 
            alt={guest.name} 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-playfair font-bold text-warm">{guest.name}</h2>
            <span className="px-2 py-0.5 bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest rounded">
              VIP Guest
            </span>
          </div>
          <div className="flex items-center gap-4 text-warm/60 text-sm">
             <div className="flex items-center gap-1.5"><MapPin size={14} /> {guest.location || 'New Delhi, India'}</div>
             <div className="flex items-center gap-1.5"><Calendar size={14} /> Member since {guest.member_since || '2022'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="glass-panel p-6 rounded-xl border-warm/5">
          <h3 className="text-xs font-bold text-warm/40 uppercase tracking-widest mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-warm/5 flex items-center justify-center text-warm/40">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] text-warm/40 font-bold uppercase">Email</p>
                <p className="text-sm font-medium text-warm">{guest.email || 'rahul.s@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-warm/5 flex items-center justify-center text-warm/40">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] text-warm/40 font-bold uppercase">Phone</p>
                <p className="text-sm font-medium text-warm">{guest.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty & Stats */}
        <div className="glass-panel p-6 rounded-xl border-warm/5">
          <h3 className="text-xs font-bold text-warm/40 uppercase tracking-widest mb-4">Stay Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-warm/5 rounded-lg border border-warm/10 text-center">
               <p className="text-2xl font-playfair font-bold text-gold">12</p>
               <p className="text-[10px] text-warm/40 font-bold uppercase">Total Stays</p>
            </div>
            <div className="p-4 bg-warm/5 rounded-lg border border-warm/10 text-center">
               <p className="text-2xl font-playfair font-bold text-gold">₹4.2L</p>
               <p className="text-[10px] text-warm/40 font-bold uppercase">LTV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel p-6 rounded-xl border-warm/5">
        <h3 className="text-xs font-bold text-warm/40 uppercase tracking-widest mb-4">Guest Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {['Late Check-out', 'Vegetarian', 'High Floor', 'Quiet Room', 'Extra Towels'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;
