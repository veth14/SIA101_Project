import { useState } from 'react';

export const useRevenueChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'expenses'>('revenue');

  const handlePointHover = (index: number | null) => {
    setHoveredPoint(index);
  };

  const handleMetricToggle = (metric: 'revenue' | 'expenses') => {
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