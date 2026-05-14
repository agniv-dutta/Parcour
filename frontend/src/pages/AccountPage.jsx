import React from 'react';
import { UserCircle2, ShieldCheck, BellRing } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/TopBar';

const AccountPage = () => {
  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Account" />
        <main className="flex-1 overflow-y-auto app-scrollbar p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
              <h2 className="text-warm font-playfair text-3xl mb-1">Account</h2>
              <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">Profile and access settings</p>
            </div>

            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold/10 rounded-lg text-gold">
                  <UserCircle2 size={20} />
                </div>
                <h3 className="text-warm font-playfair text-xl">Manager Profile</h3>
              </div>
              <div className="space-y-3 text-sm text-warm-muted">
                <p><span className="text-warm font-bold">Name:</span> Agniv Dutta</p>
                <p><span className="text-warm font-bold">Role:</span> Manager</p>
                <p><span className="text-warm font-bold">Organization:</span> Parcour</p>
              </div>
            </section>

            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg text-gold">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-warm font-playfair text-xl">Access</h3>
              </div>
              <p className="text-warm-muted text-sm">Session management, permissions, and audit controls can be wired here later.</p>
            </section>

            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg text-gold">
                  <BellRing size={20} />
                </div>
                <h3 className="text-warm font-playfair text-xl">Notifications</h3>
              </div>
              <p className="text-warm-muted text-sm">Notification preferences can be connected to your backend settings endpoint later.</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
