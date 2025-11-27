declare const useGetInvDashboard: () => {
    getInvDashboard: () => Promise<any>;
    loadingForGetInvDashboard: boolean;
    getInvDashboardChart: () => Promise<any>;
    loadingForGetInvDashboardChart: boolean;
    getInvDashboardActivity: () => Promise<any>;
    loadingForGetInvDashboardActivity: boolean;
};
export default useGetInvDashboard;
