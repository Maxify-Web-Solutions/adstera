import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store.js' 
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import MagicCursor from './Components/MagicCursor.jsx'
import { ThemeProvider } from './Pages/Dashboard/DashboardPages/ThemeContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    {/* <MagicCursor /> */}
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
    </BrowserRouter>

  </StrictMode>,
)
