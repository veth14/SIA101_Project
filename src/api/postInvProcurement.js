import { useState } from "react";
import axios from "./axiosInstance";
const usePostInvProcurementOrder = () => {
    const [loadingForPostInvProcurementOrder, setLoadingForPostInvProcurementOrder] = useState(false);
    const postInvProcurementOrder = async (purchaseOrders) => {
        try {
            setLoadingForPostInvProcurementOrder(true);
            const response = await axios.post("/inventory-procurement/post-procurement-order", purchaseOrders);
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
            setLoadingForPostInvProcurementOrder(false);
        }
    };
    return {
        postInvProcurementOrder,
        loadingForPostInvProcurementOrder,
    };
};
export default usePostInvProcurementOrder;
