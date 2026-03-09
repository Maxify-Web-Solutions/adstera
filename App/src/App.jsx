import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Pages/AuthContext'   
import ProtectedRoute from './Components/ProtectedRoute' 
import Login from './Pages/Login'
import Register from './Pages/Register'
import HomePage from './Pages/HomePage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/" element={<HomePage />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
