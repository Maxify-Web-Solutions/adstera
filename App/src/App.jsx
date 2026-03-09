import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./Pages/HomePage";
import { useEffect } from "react";
import { getUser } from "./redux/slice/authSlice";
import { useDispatch } from "react-redux";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";

function App() {


  const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);


  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
        <Route path="/" element={<HomePage />} />

    </Routes>
  );
}

export default App;