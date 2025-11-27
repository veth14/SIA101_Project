import { useState } from 'react';
export const useRevenueChart = () => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [activeMetric, setActiveMetric] = useState('revenue');
    const handlePointHover = (index) => {
        setHoveredPoint(index);
    };
    const handleMetricToggle = (metric) => {
        setActiveMetric(metric);
    };
    return {
        hoveredPoint,
        activeMetric,
        handlePointHover,
        handleMetricToggle
    };
};
export const useChartAnimations = () => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerAnimation = () => {
        setIsVisible(true);
    };
    const resetAnimation = () => {
        setIsVisible(false);
    };
    return {
        isVisible,
        triggerAnimation,
        resetAnimation
    };
};
