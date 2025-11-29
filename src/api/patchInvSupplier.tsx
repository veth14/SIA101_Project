import { useState } from "react";
import axios from "./axiosInstance";

const usePatchInvSupplier = () => {
  const [loadingForPatchInvSupplier, setLoadingForPatchInvSupplier] =
    useState(false);

  const patchInvSupplier = async (id: string | number, dataToUpdate: any) => {
    try {
      setLoadingForPatchInvSupplier(true);

      // router.patch("/update-procurement-order/:id", ...)
      const response = await axios.patch(
        `/inventory-supplier/patch-supplier/${id}`,
        dataToUpdate
      );

      return response.data;
    } catch (error: any) {
      console.log(error);

      if (error.response && error.response.status >= 400) {
        return {
          success: false,
          message: error.response.data.message || "Error from server",
        };
      }

      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForPatchInvSupplier(false);
    }
  };

  return {
    patchInvSupplier,
    loadingForPatchInvSupplier,
  };
};

export default usePatchInvSupplier;
