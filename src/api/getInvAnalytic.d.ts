declare const useGetInvAnalytic: () => {
    getInvAnalyticsChart: () => Promise<any>;
    loadingForGetInvAnalyticsChart: boolean;
    getInvAnalyticsBottomSection: () => Promise<any>;
    loadingForGetInvAnalyticsBottomSection: boolean;
    getInvProcurementMetrics: () => Promise<any>;
    loadingForGetInvProcurementMetrics: boolean;
    getInvProcurementAnalytics: () => Promise<any>;
    loadingForGetInvProcurementAnalytics: boolean;
    getInvDepartmentMetrics: () => Promise<any>;
    loadingForGetInvDepartmentMetrics: boolean;
    getInvDepartmentCharts: () => Promise<any>;
    loadingForGetInvDepartmentCharts: boolean;
};
export default useGetInvAnalytic;
