import React from "react";
import type { InventoryItem } from "./items-backendLogic/inventoryService";
interface ItemDetailsModalProps {
    item: InventoryItem | null;
    isOpen: boolean;
    onClose: () => void;
    onStockUpdated?: () => Promise<void>;
}
declare const ItemDetailsModal: React.FC<ItemDetailsModalProps>;
export default ItemDetailsModal;
