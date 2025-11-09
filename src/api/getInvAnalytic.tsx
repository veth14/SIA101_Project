import { useState } from "react";
import axios from "./axiosInstance";

const useGetInvAnalytic = () => {
  const [loadingForGetInvAnalyticsChart, setLoadingForGetInvAnalyticsChart] =
    useState(false);
  const [
    loadingForGetInvAnalyticsBottomSection,
    setLoadingForGetInvAnalyticsBottomSection,
  ] = useState(false);

  const getInvAnalyticsChart = async () => {
    try {
      setLoadingForGetInvAnalyticsChart(true);
      const response = await axios.get(
        "/inventory-analytic/get-analytics-chart"
      );
      return response.data;
    } catch (error: any) {
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
    } finally {
      setLoadingForGetInvAnalyticsChart(false);
    }
  };

  const getInvAnalyticsBottomSection = async () => {
    try {
      setLoadingForGetInvAnalyticsBottomSection(true);
      const response = await axios.get(
        "/inventory-analytic/get-analytics-bottom-section"
      );
      return response.data;
    } catch (error: any) {
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
    } finally {
      setLoadingForGetInvAnalyticsBottomSection(false);
    }
  };

  return {
    getInvAnalyticsChart,
    loadingForGetInvAnalyticsChart,
    getInvAnalyticsBottomSection,
    setLoadingForGetInvAnalyticsBottomSection,
  };
};

export default useGetInvAnalytic;
