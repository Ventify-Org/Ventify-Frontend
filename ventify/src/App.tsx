import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import SigninVC from "./components/Signin-VC";
import SigninInvestor from "./components/Signin-Investor";
import SigninBusiness from "./components/Signin-Business";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin/vc-firm" element={<SigninVC />} />
        <Route path="/signin/private-investor" element={<SigninInvestor />} />
        <Route path="/signin/business" element={<SigninBusiness />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default App;
