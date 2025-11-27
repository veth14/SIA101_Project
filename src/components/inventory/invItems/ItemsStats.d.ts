import React from "react";
import type { InventoryItem } from "./items-backendLogic/inventoryService";
interface ItemsStatsProps {
    items: InventoryItem[];
    formatCurrency: (amount: number) => string;
}
export declare const ItemsStats: React.FC<ItemsStatsProps>;
export {};
