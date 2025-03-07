
import AppRouter from './router/AppRouter'
import { useSocket } from './provider/SocketProvider';
import IsCommingCall from './components/IsCommingCall';
const App = () => {
  const { onCommingCall, handleAcceptCall, handleHangupCall } = useSocket();

  return <>
   
      {onCommingCall.isRinging && (
          <IsCommingCall
            handleAcceptCall={handleAcceptCall}
            handleHangup={handleHangupCall}
            onCommingCall={onCommingCall}
          />
        )}
      <AppRouter/>
   
  </>
}
export default App