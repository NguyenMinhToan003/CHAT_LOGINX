
import { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter"
import { socket } from "./socket";
const App = () => {
  const socketClient = socket
  const [isConnected, setIsConnected] = useState(socketClient.connected)
  const user = JSON.parse(localStorage.getItem('user'))|| null
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
    };
  }, [])
  
  useEffect(() => {
    if (isConnected && user) {
      socket.emit('addNewUser', {
        userId: user?._id,
        name: user?.name,
        picture: user?.picture
      })
      socket.emit('getListUsers', (data) => {
        console.log(data)
      })
    }
  }, [isConnected])
  

  useEffect(() => {
    if (isConnected) {
      socket.on('inCommingCall', (data) => {
        window.confirm(`${data.sender.name} is calling you`)
      })
    }
  },[socket])
  return <>
    <AppRouter/>
  </>
}
export default App