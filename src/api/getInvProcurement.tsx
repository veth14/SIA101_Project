import { useState } from "react";
import axios from "./axiosInstance";

const useGetInvProcurement= () => {
  const [loadingForGetInvProcurementOrder, setLoadingForGetInvProcurementOrder] =
    useState(false);
    const [loadingForGetInvProcurementStats, setLoadingForGetInvProcurementStats] =
    useState(false);

  const getInvProcurementOrder = async () => {
    try {
      setLoadingForGetInvProcurementOrder(true);
      const response = await axios.get("/inventory-procurement/get-procurement-orders");
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
      setLoadingForGetInvProcurementOrder(false);
    }
  };

  const getInvProcurementStats = async () => {
    try {
      setLoadingForGetInvProcurementStats(true);
      const response = await axios.get("/inventory-procurement/get-procurement-stats");
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
      setLoadingForGetInvProcurementStats(false);
    }
  };


  return {

    getInvProcurementOrder,
    loadingForGetInvProcurementOrder,
    getInvProcurementStats,
    loadingForGetInvProcurementStats,
  };

};

export default useGetInvProcurement;
