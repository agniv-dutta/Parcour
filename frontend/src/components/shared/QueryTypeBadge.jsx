import React from 'react';
import { Calendar, AlertCircle, DollarSign, LogIn, MessageSquare } from 'lucide-react';

const QueryTypeBadge = ({ type }) => {
  const types = {
    Availability: { icon: Calendar, color: 'text-success bg-success/10 border-success/20', label: 'Availability' },
    Complaint: { icon: AlertCircle, color: 'text-danger bg-danger/10 border-danger/20', label: 'Complaint' },
    Pricing: { icon: DollarSign, color: 'text-gold bg-gold/10 border-gold/20', label: 'Pricing' },
    'Check-in': { icon: LogIn, color: 'text-success bg-success/10 border-success/20', label: 'Check-in' },
    General: { icon: MessageSquare, color: 'text-warm bg-warm/10 border-warm/20', label: 'General' },
  };

  const config = types[type] || types.General;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </div>
  );
};

export default QueryTypeBadge;
