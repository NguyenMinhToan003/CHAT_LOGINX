/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomTokenStringee, getUserTokenStringee } from "../api";

const RoomChatVideoCall = () => {
  const { id } = useParams(); // Lấy roomId từ URL params
  const user = JSON.parse(localStorage.getItem("user"));
  const [userToken, setUserToken] = useState("");
  const [roomToken, setRoomToken] = useState("");
  const [room, setRoom] = useState(null);
  const [callClient, setCallClient] = useState(null);
  const videoContainerRef = useRef(null); // Tham chiếu đến container video

  // Khởi tạo và xác thực StringeeClient
  const authen = async () => {
    try {
      const userToken = await getUserTokenStringee(user._id);
      setUserToken(userToken.token);

      if (!callClient) {
        const client = new StringeeClient();
        client.on("authen", (res) => {
          console.log("on authen: ", res);
        });
        setCallClient(client);
        client.connect(userToken.token);
        return client; // Trả về client để sử dụng tiếp
      }
      return callClient;
    } catch (error) {
      console.error("Authen error:", error);
    }
  };

  // Publish local track và tham gia phòng
  const publish = async (client, roomToken, screen=true) => {
    try {
    console.log('publish', client, roomToken)
    
      const roomData = await StringeeVideo.joinRoom(client, roomToken);
      console.log('roomData', roomData)
      // console.log('roomData', roomData)
      const localTrack = await StringeeVideo.createLocalVideoTrack(client, {
        audio: true,
        video: true,
        screen: screen,
        videoDimensions: { width: 640, height: 360 },
      });

      const videoElement = localTrack.attach();
      addVideo(videoElement);

      // const roomData = await StringeeVideo.joinRoom(client, roomToken);
      // console.log('roomData', roomData)
      const roomInstance = roomData.room;

      if (!room) {
        setRoom(roomInstance);
        roomInstance.clearAllOnMethos();

        // Xử lý khi có track mới
        roomInstance.on("addtrack", (e) => {
          const track = e.info.track;
          console.log("addtrack", track);
          if (track.serverId === localTrack.serverId) {
            console.log("local track, skipping...");
            return;
          }
        });

        roomInstance.on("removetrack", (e) => {
          const track = e.track;
          if (!track) return;
          const mediaElements = track.detach();
          mediaElements.forEach((element) => element.remove());
          console.log("Removed track:", track);
        });

        roomData.listTracksInfo.forEach((info) => subscribe(info));
      }

      await roomInstance.publish(localTrack);
      console.log('publishVideoLocal', publishVideoLocal)
      console.log("Room publish successful");
    } catch (error) {
      console.error("Publish error:", error);
    }
  };

  // Tham gia phòng với roomId từ URL
  const join = async () => {
    try {
      console.log('join', id)
      const roomToken = await getRoomTokenStringee(id);
      setRoomToken(roomToken.token);
      const client = await authen();
      if (client) {
        await publish(client, roomToken.token);
      }
    } catch (error) {
      console.error("Join error:", error);
    }
  };

  // Subscribe remote track
  const subscribe = async (trackInfo) => {
    try {
      const track = await room.subscribe(trackInfo.serverId);
      track.on("ready", () => {
        const videoElement = track.attach();
        addVideo(videoElement);
        console.log("Subscribed and attached track:", track);
      });
    } catch (error) {
      console.error("Subscribe error:", error);
    }
  };

  // Thêm video vào container
  const addVideo = (video) => {
    if (videoContainerRef.current) {
      // video.setAttribute("controls", "true");
      // video.setAttribute("playsinline", "true");
      // video.setAttribute("autoplay", "true"); // Đảm bảo video tự động phát
      // video.style.width = "640px";
      // video.style.height = "360px";
      videoContainerRef.current.appendChild(video);
    } else {
      console.error("Video container not found");
    }
  };

  // Chạy khi component mount
  useEffect(() => {
    if (id) {
      join(); // Tham gia phòng nếu có roomId từ URL
    }
  }, [id]);

  useEffect(() => {
    if (callClient !== null) {
      
      callClient?.on('addtrack', (e) => {
      console.log('addtrack user orther', e)
    })
    
    }
  }, [callClient])
  return (
    <>
      <div>Room ID: {id}</div>
      <div>Room Token: {roomToken}</div>
      <div>User Token: {userToken}</div>
      <div id="videos" ref={videoContainerRef} style={{ display: "flex", flexWrap: "wrap" }} />
    </>
  );
};

export default RoomChatVideoCall;