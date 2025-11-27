declare const usePostInvRequisition: () => {
    postInvRequisition: (requisitions: any) => Promise<any>;
    loadingForPostInvRequisition: boolean;
};
export default usePostInvRequisition;
