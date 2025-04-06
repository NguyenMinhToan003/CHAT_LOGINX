import { useEffect, useState } from "react";
import { getFriendRequestList } from "../api/notificationApi";
import "./FriendRequestList.css";

const FriendRequestList = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getFriendRequestList();
        setFriendRequests(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="friend-request-container">
      <h2>Danh sách yêu cầu kết bạn</h2>
      {friendRequests.length === 0 ? (
        <p className="no-requests">Không có yêu cầu kết bạn nào.</p>
      ) : (
        <ul className="request-list">
          {friendRequests.map((request) => (
            <li key={request._id} className="request-item">
              <img
                src={request.sender[0]?.avatar || "https://thuvienmeme.com/wp-content/uploads/2023/09/doi-cho-sach-jack-cho-thom-350x250.jpg"}
                alt="Avatar"
                className="avatar"
              />
              <div className="request-info">
                <p className="name">{request.sender[0]?.name || "Không có tên"}</p>
                <div className="actions">
                  <button className="accept">Xác nhận</button>
                  <button className="reject">Xóa</button>
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
