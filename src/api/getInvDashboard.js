import { useState } from "react";
import axios from "./axiosInstance";
const useGetInvDashboard = () => {
    const [loadingForGetInvDashboard, setLoadingForGetInvDashboard] = useState(false);
    const [loadingForGetInvDashboardChart, setLoadingForGetInvDashboardChart] = useState(false);
    const [loadingForGetInvDashboardActivity, setLoadingForGetInvDashboardActivity] = useState(false);
    const getInvDashboard = async () => {
        try {
            setLoadingForGetInvDashboard(true);
            const response = await axios.get("/inventory-dashboard/get-dashboard-stats");
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
            setLoadingForGetInvDashboard(false);
        }
    };
    const getInvDashboardChart = async () => {
        try {
            setLoadingForGetInvDashboardChart(true);
            const response = await axios.get("/inventory-dashboard/get-dashboard-chart");
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
            setLoadingForGetInvDashboardChart(false);
        }
    };
    const getInvDashboardActivity = async () => {
        try {
            setLoadingForGetInvDashboardActivity(true);
            const response = await axios.get("/inventory-dashboard/get-dashboard-activity");
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
            setLoadingForGetInvDashboardActivity(false);
        }
    };
    return {
        getInvDashboard,
        loadingForGetInvDashboard,
        getInvDashboardChart,
        loadingForGetInvDashboardChart,
        getInvDashboardActivity,
        loadingForGetInvDashboardActivity,
    };
};
export default useGetInvDashboard;
