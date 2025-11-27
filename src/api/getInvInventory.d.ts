declare const useGetInvInventory: () => {
    getInvInventoryItems: () => Promise<any>;
    loadingForGetInvInventoryItems: boolean;
};
export default useGetInvInventory;
