import { axiosInstance } from "./index";

// Lấy danh sách yêu cầu kết bạn
export const getFriendRequestList = async () => {
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  if (!userId) {
    console.error("DSYCKB Không tìm thấy userId trong localStorage");
    return [];
  }

  try {
    const response = await axiosInstance.get("/user/get-friend-request", {
      params: { userId },
    });
    const filteredRequests = response.data.filter(
      (request) => request.senderId === userId || request.receiverId === userId
    );
    return filteredRequests;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn:", error?.response?.data || error.message);
    return [];
  }
};

// Phản hồi yêu cầu kết bạn
export const respondFriendRequest = async (friendRequestId, status, userAction) => {
  try {
    const response = await axiosInstance.post("/user/respond-friend-request", {
      friendRequestId,
      status,
      userAction,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi phản hồi yêu cầu kết bạn:", error?.response?.data || error.message);
    return false;
  }
};

// Hủy yêu cầu kết bạn
export const deleteFriendRequest = async (friendRequestId, userAction) => {
  try {
    const response = await axiosInstance.post("/user/delete-request-friend", {
      friendRequestId,
      userAction,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hủy yêu cầu kết bạn:", error?.response?.data || error.message);
    return false;
  }
};
