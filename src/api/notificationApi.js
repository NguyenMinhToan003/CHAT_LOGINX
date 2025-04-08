import { axiosInstance } from "./index";

export const getFriendRequestList = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error("Không tìm thấy userId trong localStorage");
        return [];
    }

    try {
        const response = await axiosInstance.get(`http://localhost:8123/api/user/get-friend-request?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi API get-friend-request:", error);
        return [];
    }
};
