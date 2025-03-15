
import AppRouter from './router/AppRouter'
import { useSocket } from './provider/SocketProvider';
import IsComingCall from './components/isComingCall/IsComingCall'
const App = () => {
  const { onCommingCall, handleAcceptCall, handleHangupCall } = useSocket();

  return <>
   
      {onCommingCall.isRinging && (
          <IsComingCall
            handleAcceptCall={handleAcceptCall}
            handleHangup={handleHangupCall}
            onCommingCall={onCommingCall}
          />
        )}
      <AppRouter/>
   
  </>
}
export default App