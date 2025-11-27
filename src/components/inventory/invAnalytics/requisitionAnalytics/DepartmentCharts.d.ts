import React from "react";
export interface DepartmentMonthlyData {
    month: string;
    housekeeping: number;
    frontoffice: number;
    fnb: number;
    maintenance: number;
    security: number;
}
export interface DepartmentPerformance {
    name: string;
    requests: number;
    avgTime: string;
    approval: number;
    color: string;
}
declare const DepartmentCharts: React.FC;
export default DepartmentCharts;
