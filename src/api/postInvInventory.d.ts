declare const usePostInvInventoryItem: () => {
    postInvInventoryItem: (item: any) => Promise<any>;
    loadingForPostInvInventoryItem: boolean;
};
export default usePostInvInventoryItem;
