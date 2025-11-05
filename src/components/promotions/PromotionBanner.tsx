import React, { useState, useEffect } from 'react';
import { X, Tag, Clock } from 'lucide-react';

interface Promotion {
  promoId: string;
  title: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  validFrom: string;
  validTo: string;
  promoCode: string;
  bannerColor?: string;
  isActive: boolean;
}

interface PromotionBannerProps {
  promotion: Promotion;
  onClose?: () => void;
  dismissible?: boolean;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({
  promotion,
  onClose,
  dismissible = true
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(promotion.validTo).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setTimeLeft('Expired');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [promotion.validTo]);

  const discountText = promotion.discountPercent 
    ? `${promotion.discountPercent}% OFF`
    : `₱${promotion.discountAmount} OFF`;

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-lg"
      style={{
        background: promotion.bannerColor || 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
      }}
    >
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Promo Code Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">CODE: {promotion.promoCode}</span>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
              {promotion.title}
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-4">
              {promotion.description}
            </p>

            {/* Time Left */}
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{timeLeft}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Discount Badge */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text">
                {discountText}
              </div>
            </div>

            {/* Close Button */}
            {dismissible && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <button className="px-8 py-3 bg-white text-heritage-green rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            Book Now & Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact Promotion Card (for listing multiple promos)
export const PromotionCard: React.FC<{ promotion: Promotion }> = ({ promotion }) => {
  const discountText = promotion.discountPercent 
    ? `${promotion.discountPercent}% OFF`
    : `₱${promotion.discountAmount} OFF`;

  return (
    <div className="bg-gradient-to-br from-heritage-green/10 to-emerald-600/10 rounded-xl p-4 border-2 border-heritage-green/20 hover:border-heritage-green/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-bold text-gray-900">{promotion.title}</h4>
          <p className="text-sm text-gray-600">{promotion.description}</p>
        </div>
        <div className="bg-heritage-green text-white px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap">
          {discountText}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono font-bold text-heritage-green">
          {promotion.promoCode}
        </code>
        <span className="text-xs text-gray-500">
          Until {new Date(promotion.validTo).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
