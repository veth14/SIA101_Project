declare const usePostInvProcurementOrder: () => {
    postInvProcurementOrder: (purchaseOrders: any) => Promise<any>;
    loadingForPostInvProcurementOrder: boolean;
};
export default usePostInvProcurementOrder;
