import { useState } from "react";
import axios from "./axiosInstance";
const usePostInvRequisition = () => {
    const [loadingForPostInvRequisition, setLoadingForPostInvRequisition] = useState(false);
    const postInvRequisition = async (requisitions) => {
        try {
            setLoadingForPostInvRequisition(true);
            const response = await axios.post("/inventory-requisition/post-requisition", requisitions);
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
            setLoadingForPostInvRequisition(false);
        }
    };
    return {
        postInvRequisition,
        loadingForPostInvRequisition,
    };
};
export default usePostInvRequisition;
