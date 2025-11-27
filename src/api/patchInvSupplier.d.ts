declare const usePatchInvSupplier: () => {
    patchInvSupplier: (id: string | number, dataToUpdate: any) => Promise<any>;
    loadingForPatchInvSupplier: boolean;
};
export default usePatchInvSupplier;
