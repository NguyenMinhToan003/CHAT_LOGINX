
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './provider/SocketProvider.jsx'
import { BrowserRouter } from 'react-router-dom'

const user = JSON.parse(localStorage.getItem('user')) || null
createRoot(document.getElementById('root')).render(
    <BrowserRouter>


    <SocketProvider user={user}>
        <App />
    </SocketProvider>
            </BrowserRouter>

)
