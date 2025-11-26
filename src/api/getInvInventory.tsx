import { useState } from "react";
import axios from "./axiosInstance";

const useGetInvInventory = () => {
  const [loadingForGetInvInventoryItems, setLoadingForGetInvInventoryItems] =
    useState(false);

  const getInvInventoryItems = async () => {
    try {
      setLoadingForGetInvInventoryItems(true);
      const response = await axios.get("/inventory-inventory/get-items");
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
      setLoadingForGetInvInventoryItems(false);
    }
  };

  return {
    getInvInventoryItems,
    loadingForGetInvInventoryItems,
  };
};

export default useGetInvInventory;
