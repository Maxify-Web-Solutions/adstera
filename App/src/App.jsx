import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./Pages/HomePage";
import { useEffect } from "react";
import { getUser } from "./redux/slice/authSlice";
import { useDispatch } from "react-redux";
// import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import CookiePolicy from "./Pages/CookiePollicy";
import ContactUs from "./Pages/ContactUs";
import AboutUs from "./Pages/AboutUs";
import MagicCursor from "./Components/MagicCursor";
import Dashboard from "./Pages/Dashboard/DashboardPages/Dashboard";
import Websites from "./Pages/Dashboard/DashboardPages/Websites";
import Layout from "./Pages/Dashboard/Layout";
import Overview from "./Pages/Dashboard/Overview";
import Statistics from "./Pages/Dashboard/DashboardPages/Statistics";
import Smartlinks from "./Pages/Dashboard/DashboardPages/Smartlinks";
import Refrels from "./Pages/Dashboard/DashboardPages/Refrels";
import ApiPage from "./Pages/Dashboard/DashboardPages/ApiPage";
import FAQCaseStudies from "./Pages/Dashboard/DashboardPages/FAQCaseStudies";
import PayoutInformation from "./Pages/Dashboard/DashboardPages/PayoutInformation";
import Payouts from "./Pages/Dashboard/DashboardPages/Payouts";
import DashboardProfile from "./Pages/Dashboard/DashboardPages/DashboardProfile";

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
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/profile" element={<Profile />} />
      
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-pollicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfservice" element={<TermsOfService />} />
        <Route path="/cookiePollicy" element={<CookiePolicy />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
       <Route path="/profile" element={<Profile />} />

    <Route path="/dashboard" element={<Layout />}>
    <Route path="dash-board" element={<Dashboard />} />
      <Route index element={<Overview />} />
      <Route path="websites" element={<Websites />} />
      <Route path="statistics" element={<Statistics />} />
      <Route path="smartlinks" element={<Smartlinks />} />
      <Route path="referrals" element={<Refrels />} />
      <Route path="api" element={<ApiPage />} />
      <Route path="faq-case-studies" element={<FAQCaseStudies />} />
      <Route path="Dashboard-Profile" element={<DashboardProfile />} />
      <Route path="payout-information" element={<PayoutInformation />} />
      <Route path="payouts" element={<Payouts />} />
    </Route>
        </Route>

    </Routes>
  );
}

export default App;