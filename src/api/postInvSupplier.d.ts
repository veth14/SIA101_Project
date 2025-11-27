declare const usePostInvSupplier: () => {
    postInvSupplier: (suppliers: any) => Promise<any>;
    loadingForPostInvSupplier: boolean;
};
export default usePostInvSupplier;
