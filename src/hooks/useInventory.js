import { useState, useCallback } from 'react';
import { addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItems, getLowStockItems } from '../services/inventoryService';
export const useInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getInventoryItems();
            setItems(data);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const fetchLowStockItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getLowStockItems();
            setItems(data);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch low stock items');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const addItem = async (item) => {
        try {
            setLoading(true);
            await addInventoryItem(item);
            await fetchInventory();
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const updateItem = async (id, updates) => {
        try {
            setLoading(true);
            await updateInventoryItem(id, updates);
            await fetchInventory();
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const deleteItem = async (id) => {
        try {
            setLoading(true);
            await deleteInventoryItem(id);
            await fetchInventory();
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    return {
        items,
        loading,
        error,
        fetchInventory,
        fetchLowStockItems,
        addItem,
        updateItem,
        deleteItem
    };
};
