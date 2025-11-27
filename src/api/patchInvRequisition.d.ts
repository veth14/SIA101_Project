declare const usePatchInvRequisition: () => {
    patchInvRequisition: (id: string | number, dataToUpdate: any) => Promise<any>;
    loadingForPatchInvRequisition: boolean;
};
export default usePatchInvRequisition;
