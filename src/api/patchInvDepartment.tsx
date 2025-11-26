import { useState } from "react";
import axios from "./axiosInstance"; 

const usePatchInvDepartment = () => {
  const [loadingForPatchInvMaintenanceRequest, setLoadingForPatchInvMaintenanceRequest] = useState(false);

  const patchInvMaintenanceRequest = async (
    id: string | number,
    dataToUpdate: any
  ) => {
    try {
      setLoadingForPatchInvMaintenanceRequest(true);

      console.log("Updating maintenance request:", id, dataToUpdate);
      
      // Encode the ID twice to handle the # character properly
      const encodedId = encodeURIComponent(String(id));
      console.log("Encoded ID:", encodedId);
      
      const response = await axios.patch(
        `/inventory-department/update-maintenance-request/${encodedId}`,
        dataToUpdate
      );

      console.log("Update response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating maintenance request:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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
      setLoadingForPatchInvMaintenanceRequest(false);
    }
  };

  return {
    patchInvMaintenanceRequest,
    loadingForPatchInvMaintenanceRequest,
  };
};

export default usePatchInvDepartment;