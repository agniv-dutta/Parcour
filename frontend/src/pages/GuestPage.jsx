import React from 'react';
import { motion } from 'framer-motion';
import GuestProfile from '../components/guests/GuestProfile';

const GuestPage = () => {
  const mockGuest = {
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    member_since: 'Nov 2022',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-playfair font-bold text-gold">Guest Profile</h2>
        <button className="btn-gold">Edit Profile</button>
      </div>
      
      <GuestProfile guest={mockGuest} />
    </motion.div>
  );
};

export default GuestPage;
