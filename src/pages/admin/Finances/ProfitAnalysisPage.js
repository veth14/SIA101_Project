import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
// Use the new ProfitAnalysis dashboard component
import ProfitAnalysisComponent from '../../../components/finances/dashboard/ProfitAnalysis';
const AdminProfitAnalysisPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(ProfitAnalysisComponent, {}) }));
};
export default AdminProfitAnalysisPage;
