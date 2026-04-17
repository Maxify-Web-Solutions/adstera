import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'; // ✅ ADD THIS

import App from './App.jsx'
import { store } from './redux/store.js' 
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import MagicCursor from './Components/MagicCursor.jsx'
import { ThemeProvider } from './Pages/Dashboard/DashboardPages/ThemeContext.jsx' 

import { ToastContainer } from 'react-toastify' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <MagicCursor /> */}
      <ThemeProvider>
        <Provider store={store}>
          <App />
          
          {/* ✅ GLOBAL TOAST CONTAINER */}
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            theme="dark"
          />

        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)