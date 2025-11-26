import React from "react";
import DepartmentMetrics from "./DepartmentMetrics";
import DepartmentCharts from "./DepartmentCharts";

const RequisitionAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <DepartmentMetrics />

      {/* Charts */}
      <DepartmentCharts />
    </div>
  );
};

export default RequisitionAnalyticsPage;
