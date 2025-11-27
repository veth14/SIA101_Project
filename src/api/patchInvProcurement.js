import { useState } from "react";
import axios from "./axiosInstance";
const usePatchInvProcurement = () => {
    const [loadingForPatchInvProcurement, setLoadingForPatchInvProcurement] = useState(false);
    const patchInvProcurement = async (id, dataToUpdate) => {
        try {
            setLoadingForPatchInvProcurement(true);
            // router.patch("/update-procurement-order/:id", ...)
            const response = await axios.patch(`/inventory-procurement/update-procurement-order/${id}`, dataToUpdate);
            return response.data;
        }
        catch (error) {
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
        }
        finally {
            setLoadingForPatchInvProcurement(false);
        }
    };
    return {
        patchInvProcurement,
        loadingForPatchInvProcurement,
    };
};
export default usePatchInvProcurement;
