
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './provider/SocketProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import theme from './theme.js'
import { CssBaseline } from '@mui/material'

const user = JSON.parse(localStorage.getItem('user')) || null
createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>


    <SocketProvider user={user}>
        <App />
    </SocketProvider>
        </BrowserRouter>

    </ThemeProvider>

)
