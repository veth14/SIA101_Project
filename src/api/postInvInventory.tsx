import { useState } from "react";
import axios from "./axiosInstance";

const usePostInvInventoryItem = () => {
  const [loadingForPostInvInventoryItem, setLoadingForPostInvInventoryItem] =
    useState(false);

  const postInvInventoryItem = async (item: any) => {
    try {
      setLoadingForPostInvInventoryItem(true);
      const response = await axios.post("/inventory-inventory/post-item", item);
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
      setLoadingForPostInvInventoryItem(false);
    }
  };

  return {
    postInvInventoryItem,
    loadingForPostInvInventoryItem,
  };
};

export default usePostInvInventoryItem;
