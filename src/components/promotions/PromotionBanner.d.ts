import React from 'react';
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
export declare const PromotionBanner: React.FC<PromotionBannerProps>;
export declare const PromotionCard: React.FC<{
    promotion: Promotion;
}>;
export {};
