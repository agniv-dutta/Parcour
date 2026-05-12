import React from 'react';
import { MessageCircle, Phone, Globe } from 'lucide-react';

const ChannelIcon = ({ channel, size = 16 }) => {
  const channels = {
    WhatsApp: { icon: MessageCircle, color: 'text-[#25D366]' },
    Airbnb: { icon: Globe, color: 'text-[#FF5A5F]' },
    Direct: { icon: Phone, color: 'text-gold' },
  };

  const config = channels[channel] || channels.Direct;
  const Icon = config.icon;

  return <Icon size={size} className={config.color} />;
};

export default ChannelIcon;
