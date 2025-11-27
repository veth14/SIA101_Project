declare const useGetInvProcurement: () => {
    getInvProcurementOrder: () => Promise<any>;
    loadingForGetInvProcurementOrder: boolean;
    getInvProcurementStats: () => Promise<any>;
    loadingForGetInvProcurementStats: boolean;
};
export default useGetInvProcurement;
