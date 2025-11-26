import React from "react";
import ProcurementMetrics from "./ProcurementMetrics";
import ProcurementCharts from "./ProcurementCharts";

const ProcurementAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <ProcurementMetrics />

      {/* Charts */}
      <ProcurementCharts />
    </div>
  );
};

export default ProcurementAnalyticsPage;
