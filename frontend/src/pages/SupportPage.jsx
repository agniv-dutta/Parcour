import React from 'react';
import { Mail, MessageSquareHeart, PhoneCall } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/TopBar';

const SupportPage = () => {
  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Support" />
        <main className="flex-1 overflow-y-auto app-scrollbar p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
              <h2 className="text-warm font-playfair text-3xl mb-1">Support</h2>
              <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">Get help from the Parcour ops team</p>
            </div>

            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg text-gold">
                  <MessageSquareHeart size={20} />
                </div>
                <h3 className="text-warm font-playfair text-xl">Contact Channels</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <Mail className="text-gold mb-2" size={18} />
                  <p className="text-warm font-bold text-sm mb-1">Email</p>
                  <p className="text-warm-muted text-sm">support@parcour.ai</p>
                </div>
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <PhoneCall className="text-gold mb-2" size={18} />
                  <p className="text-warm font-bold text-sm mb-1">Hotline</p>
                  <p className="text-warm-muted text-sm">+91 98765 43210</p>
                </div>
                <div className="bg-navy/40 border border-warm/5 rounded-xl p-4">
                  <MessageSquareHeart className="text-gold mb-2" size={18} />
                  <p className="text-warm font-bold text-sm mb-1">Live Ops</p>
                  <p className="text-warm-muted text-sm">Escalations monitored 24/7</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportPage;
