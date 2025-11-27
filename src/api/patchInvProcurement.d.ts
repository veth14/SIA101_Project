declare const usePatchInvProcurement: () => {
    patchInvProcurement: (id: string | number, dataToUpdate: any) => Promise<any>;
    loadingForPatchInvProcurement: boolean;
};
export default usePatchInvProcurement;
