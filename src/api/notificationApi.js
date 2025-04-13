
import { axiosInstance } from "./index";

// Lấy danh sách yêu cầu kết bạn
export const getFriendRequestList = async (userId) => {

  const response = await axiosInstance.get(`/user/get-friend-request?userId=${userId}`)
  return response.data
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

export const unfriend = async (userId, friendId) => {
  const respond = await axiosInstance.post(`/user/unfriend`, {
    userId, friendId
  })
  return respond.data
}
