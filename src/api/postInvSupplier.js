import { useState } from "react";
import axios from "./axiosInstance";
const usePostInvSupplier = () => {
    const [loadingForPostInvSupplier, setLoadingForPostInvSupplier] = useState(false);
    const postInvSupplier = async (suppliers) => {
        try {
            setLoadingForPostInvSupplier(true);
            const response = await axios.post("/inventory-supplier/post-supplier", suppliers);
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
            setLoadingForPostInvSupplier(false);
        }
    };
    return {
        postInvSupplier,
        loadingForPostInvSupplier,
    };
};
export default usePostInvSupplier;
