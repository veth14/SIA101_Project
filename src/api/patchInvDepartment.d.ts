declare const usePatchInvDepartment: () => {
    patchInvMaintenanceRequest: (id: string | number, dataToUpdate: any) => Promise<any>;
    loadingForPatchInvMaintenanceRequest: boolean;
};
export default usePatchInvDepartment;
