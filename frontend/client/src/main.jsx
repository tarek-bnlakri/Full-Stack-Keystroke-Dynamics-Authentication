import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './context/authContext.jsx'
import './index.css'
import App from './App.jsx'
import Profile from './Components/Profile/Profile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
     
      <App />
    </AuthContextProvider>
  </StrictMode>,
)
