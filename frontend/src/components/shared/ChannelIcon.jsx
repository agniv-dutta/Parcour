import React from 'react';
import { MessageCircle, Home, Globe, Camera, Mail } from 'lucide-react';

export const CHANNELS = {
  whatsapp:    { icon: MessageCircle, color: '#25D366', label: 'WhatsApp' },
  airbnb:      { icon: Home, color: '#FF5A5F', label: 'Airbnb' },
  booking_com: { icon: Globe, color: '#003580', label: 'Booking.com' },
  instagram:   { icon: Camera, color: '#E1306C', label: 'Instagram' },
  direct:      { icon: Mail, color: '#C9A96E', label: 'Direct' },
};

const ChannelIcon = ({ source, size = 16, className = "" }) => {
  const channel = CHANNELS[source] || CHANNELS.direct;
  const Icon = channel.icon;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={channel.label}
    >
      <Icon size={size} style={{ color: channel.color }} />
      <span className="text-[10px] uppercase tracking-wider text-warm-muted">{channel.label}</span>
    </div>
  );
};

export default ChannelIcon;
