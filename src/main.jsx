import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from './context/UserContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { i18nReady } from './i18n/i18n.js'; // ✅ importer la Promise, plus l'import side-effect
import initLanguage from './utils/initLanguage.js'

initLanguage();

// ✅ React ne monte qu'après que i18n soit prêt
i18nReady.then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <UserProvider>
          <GoogleOAuthProvider clientId="974675121498-ic32r1j1ooto7eq0bnohkh8dk4vfrsgo.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </UserProvider>
      </BrowserRouter>
    </StrictMode>
  )
});