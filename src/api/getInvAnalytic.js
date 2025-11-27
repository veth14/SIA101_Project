import { useState } from "react";
import axios from "./axiosInstance";
const useGetInvAnalytic = () => {
    const [loadingForGetInvAnalyticsChart, setLoadingForGetInvAnalyticsChart] = useState(false);
    const [loadingForGetInvAnalyticsBottomSection, setLoadingForGetInvAnalyticsBottomSection,] = useState(false);
    const [loadingForGetInvProcurementMetrics, setLoadingForGetInvProcurementMetrics,] = useState(false);
    const [loadingForGetInvProcurementAnalytics, setLoadingForGetInvProcurementAnalytics,] = useState(false);
    const [loadingForGetInvDepartmentMetrics, setLoadingForGetInvDepartmentMetrics,] = useState(false);
    const [loadingForGetInvDepartmentCharts, setLoadingForGetInvDepartmentCharts,] = useState(false);
    const getInvAnalyticsChart = async () => {
        try {
            setLoadingForGetInvAnalyticsChart(true);
            const response = await axios.get("/inventory-analytic/get-analytics-chart");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvAnalyticsChart(false);
        }
    };
    const getInvAnalyticsBottomSection = async () => {
        try {
            setLoadingForGetInvAnalyticsBottomSection(true);
            const response = await axios.get("/inventory-analytic/get-analytics-bottom-section");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvAnalyticsBottomSection(false);
        }
    };
    const getInvProcurementMetrics = async () => {
        try {
            setLoadingForGetInvProcurementMetrics(true);
            const response = await axios.get("/inventory-analytic/get-procurement-metrics");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvProcurementMetrics(false);
        }
    };
    const getInvProcurementAnalytics = async () => {
        try {
            setLoadingForGetInvProcurementAnalytics(true);
            const response = await axios.get("/inventory-analytic/get-procurement-analytics");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvProcurementAnalytics(false);
        }
    };
    const getInvDepartmentMetrics = async () => {
        try {
            setLoadingForGetInvDepartmentMetrics(true);
            const response = await axios.get("/inventory-analytic/get-department-metrics");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvDepartmentMetrics(false);
        }
    };
    const getInvDepartmentCharts = async () => {
        try {
            setLoadingForGetInvDepartmentCharts(true);
            const response = await axios.get("/inventory-analytic/get-department-charts");
            return response.data;
        }
        catch (error) {
            console.log(error);
            if (error.status >= 400) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            return {
                success: false,
                message: "API calling failed",
            };
        }
        finally {
            setLoadingForGetInvDepartmentCharts(false);
        }
    };
    return {
        getInvAnalyticsChart,
        loadingForGetInvAnalyticsChart,
        getInvAnalyticsBottomSection,
        loadingForGetInvAnalyticsBottomSection,
        getInvProcurementMetrics,
        loadingForGetInvProcurementMetrics,
        getInvProcurementAnalytics,
        loadingForGetInvProcurementAnalytics,
        getInvDepartmentMetrics,
        loadingForGetInvDepartmentMetrics,
        getInvDepartmentCharts,
        loadingForGetInvDepartmentCharts,
    };
};
export default useGetInvAnalytic;
