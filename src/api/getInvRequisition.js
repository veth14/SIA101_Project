import { useState } from "react";
import axios from "./axiosInstance";
const useGetInvRequisition = () => {
    const [loadingForGetInvRequisition, setLoadingForGetInvRequisition] = useState(false);
    const getInvRequisitions = async () => {
        try {
            setLoadingForGetInvRequisition(true);
            const response = await axios.get("/inventory-requisition/get-requisitions");
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
            setLoadingForGetInvRequisition(false);
        }
    };
    return {
        getInvRequisitions,
        loadingForGetInvRequisition,
    };
};
export default useGetInvRequisition;
