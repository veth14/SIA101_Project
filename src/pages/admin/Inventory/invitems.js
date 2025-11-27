import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import InventoryItemsPage from '../../../components/inventory/invItems/InventoryItemsPage';
export default function AdminInventoryItemsPage() {
    return (_jsx(AdminLayout, { children: _jsx(InventoryItemsPage, {}) }));
}
