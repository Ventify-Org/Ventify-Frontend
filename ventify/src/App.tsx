import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Landing page/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import DashboardFirmAdmin from "./components/VC-Firm-Admin/Dashboard";
import DashboardInvestor from "./components/Private-Investor-Admin/Dashboard";
import DashboardBusiness from "./components/Business-Admin/Dashboard";
import DashboardFirmPC from "./components/VC-Firm-PC/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin/:type" element={<Signin />} />
        <Route path="/signup/:type" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard/vc-firm/admin"
          element={<DashboardFirmAdmin />}
        />
        <Route path="/dashboard/vc-firm/pc" element={<DashboardFirmPC />} />
        <Route
          path="/dashboard/private-investor"
          element={<DashboardInvestor />}
        />
        <Route path="/dashboard/business" element={<DashboardBusiness />} />
      </Routes>
    </Router>
  );
};

export default App;
