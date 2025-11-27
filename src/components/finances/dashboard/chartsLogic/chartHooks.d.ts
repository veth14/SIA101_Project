export declare const useRevenueChart: () => {
    hoveredPoint: number | null;
    activeMetric: "revenue" | "expenses";
    handlePointHover: (index: number | null) => void;
    handleMetricToggle: (metric: "revenue" | "expenses") => void;
};
export declare const useChartAnimations: () => {
    isVisible: boolean;
    triggerAnimation: () => void;
    resetAnimation: () => void;
};
