import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from "../../../layouts/AdminLayout";
import InventoryAnalyticsPage from "../../../components/inventory/invAnalytics/InventoryAnalyticsPage";
export default function AdminInventoryAnalyticsPage() {
    return (_jsx(AdminLayout, { children: _jsx(InventoryAnalyticsPage, {}) }));
}
