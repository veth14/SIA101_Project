import { useState } from "react";
import axios from "./axiosInstance";

const usePatchInvRequisition = () => {
  const [loadingForPatchInvRequisition, setLoadingForPatchInvRequisition] =
    useState(false);

  const patchInvRequisition = async (
    id: string | number,
    dataToUpdate: any
  ) => {
    try {
      setLoadingForPatchInvRequisition(true);

      // router.patch("/update-procurement-order/:id", ...)
      const response = await axios.patch(
          `/inventory-requisition/patch-requisition/${id}`,
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
      setLoadingForPatchInvRequisition(false);
    }
  };

  return {
    patchInvRequisition,
    loadingForPatchInvRequisition,
  };
};

export default usePatchInvRequisition;
