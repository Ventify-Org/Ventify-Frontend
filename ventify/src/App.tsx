import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Landing page/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import DashboardFirmAdmin from "./components/VC-Firm-Admin/Dashboard";
import DashboardInvestor from "./components/Private-Investor-Admin/Dashboard";
import DashboardFirmPC from "./components/VC-Firm-PC/Dashboard";
import DashboardFirmIN from "./components/VC-Firm-In/Dashboard";
import DashboardBusinessAdmin from "./components/Business-Admin/Dashboard";
import DashboardBusinessIn from "./components/Business-Investor/Dashboard";
import DashboardInvestorPC from "./components/Private-Investor-PC/Dashboard";

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
        <Route path="/dashboard/vc-firm/in" element={<DashboardFirmIN />} />
        <Route
          path="/dashboard/private-investor/admin"
          element={<DashboardInvestor />}
        />
        <Route
          path="/dashboard/private-investor/pc"
          element={<DashboardInvestorPC />}
        />
        <Route
          path="/dashboard/business/admin"
          element={<DashboardBusinessAdmin />}
        />
        <Route
          path="/dashboard/business/in"
          element={<DashboardBusinessIn />}
        />
      </Routes>
    </Router>
  );
};

export default App;
