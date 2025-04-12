import { useEffect, useState } from "react";
import {
  getFriendRequestList,
  respondFriendRequest,
  deleteFriendRequest,
} from "../api/notificationApi";
import "./FriendRequestList.css";

const FriendRequestList = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  useEffect(() => {
    console.log("userId hiện tại trong localStorage:", userId);

    if (!userId) {
      console.error("Không tìm thấy userId trong localStorage.");
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const data = await getFriendRequestList();
        const pendingRequests = data.filter((req) => req.status === "pending");
        setFriendRequests(pendingRequests);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu kết bạn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const handleAction = async (friendRequestId, action, userActionId) => {
    let result;
    let newStatus = "";

    if (action === "accept") {
      result = await respondFriendRequest(friendRequestId, "accepted", userActionId);
      newStatus = "accepted";
    } else if (action === "reject") {
      result = await respondFriendRequest(friendRequestId, "rejected", userActionId);
      newStatus = "rejected";
    } else if (action === "cancel") {
      result = await deleteFriendRequest(friendRequestId, userActionId);
      newStatus = "cancelled";
    }

    if (result) {
      setFriendRequests((prev) =>
        prev.map((req) =>
          req._id === friendRequestId ? { ...req, handledStatus: newStatus } : req
        )
      );
    } else {
      alert("Không thể xử lý yêu cầu.");
    }
  };

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="friend-request-container">
      <h2>Yêu cầu kết bạn</h2>
      {friendRequests.length === 0 ? (
        <p className="no-requests">Không có yêu cầu kết bạn nào.</p>
      ) : (
        <ul className="request-list">
          {friendRequests.map((request) => (
            <li key={request._id} className="request-item">
              <img
                src={
                  request.sender[0]?.avatar ||
                  "https://thuvienmeme.com/wp-content/uploads/2023/09/doi-cho-sach-jack-cho-thom-350x250.jpg"
                }
                alt="Avatar"
                className="avatar"
              />
              <div className="request-info">
                <p className="name">{request.sender[0]?.name || "Không có tên"}</p>
                {request.senderId === userId ? (
                  <p className="sent-request">
                    Đã gửi yêu cầu đến:{" "}
                    <strong>{request.receiver[0]?.name || "Không rõ tên"}</strong>
                  </p>
                ) : null}

                <div className="actions">
                  {request.handledStatus ? (
                    <p className="handled-message">
                      {request.handledStatus === "accepted" && "✅ Đã chấp nhận yêu cầu."}
                      {request.handledStatus === "rejected" && "❌ Đã từ chối yêu cầu."}
                      {request.handledStatus === "cancelled" && "🚫 Đã thu hồi yêu cầu."}
                    </p>
                  ) : request.status === "pending" ? (
                    request.senderId === userId ? (
                      <button
                        className="cancel"
                        onClick={() =>
                          handleAction(request._id, "cancel", request.senderId)
                        }
                      >
                        Thu hồi lời gửi kết bạn
                      </button>
                    ) : (
                      <>
                        <button
                          className="accept"
                          onClick={() =>
                            handleAction(request._id, "accept", request.receiverId)
                          }
                        >
                          Chấp nhận
                        </button>
                        <button
                          className="reject"
                          onClick={() =>
                            handleAction(request._id, "reject", request.receiverId)
                          }
                        >
                          Từ chối
                        </button>
                      </>
                    )
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequestList;
