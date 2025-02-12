import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Landing page/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import DashboardFirm from "./components/VC-Firm/Dashboard";
import DashboardInvestor from "./components/Private-Investor/Dashboard";
import DashboardBusiness from "./components/Business/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin/:type" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard/vc-firm" element={<DashboardFirm />} />
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
