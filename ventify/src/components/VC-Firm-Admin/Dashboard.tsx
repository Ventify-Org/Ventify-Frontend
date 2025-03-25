import { useState } from "react";
import DashboardMenu from "./Dashboard-Menu";
import Messages from "./Messages";
import Raisings from "./Raisings";
import Applications from "./Applications";
import VcChat from "./VC-Chat";
import InvestorT from "./Investor-T";
import Investments from "./Investments";
import { useNavigate } from "react-router-dom";
import { BiLogOut, BiCog } from "react-icons/bi";
import Invites from "./Invites";

const DashboardFirmAdmin = () => {
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const navigate = useNavigate();

  const sections: Record<string, JSX.Element> = {
    Dashboard: <DashboardMenu />,
    Applications: <Applications />,
    "VC-Chat": <VcChat />,
    Messages: <Messages />,
    Raisings: (
      <Raisings
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    ),
    Investments: <Investments />,
    "Investor T. No": <InvestorT />,
    "Portfolio T. No": <InvestorT />,
    Invites: <Invites />,
  };

  const logOut = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      console.error("Refresh token not found in localStorage");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/auth/logout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (response.ok) {
        localStorage.removeItem("refresh_token");
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  return (
    <section className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b-[1.5px] flex items-center justify-center py-1">
        <img src="/logo.png" />
      </div>

      <div className="flex gap-4 flex-grow min-h-screen">
        {/* Sidebar */}
        <div className="relative w-[15%] bg-[#00378B] text-white flex flex-col items-center py-10 min-h-screen">
          {/* Settings Icon (Top Right Corner) */}
          <BiCog
            className="absolute top-6 right-6 text-white bg-[#00378B] p-1 rounded-full cursor-pointer hover:bg-yellow-400 transition"
            size={26}
            onClick={() => {
              navigate("/settings");
            }}
          />

          {/* Profile Section */}
          <div className="w-20 h-20 rounded-full bg-green-400 mb-2">
            <img src="resize.png" alt="profile pic" />
          </div>
          <p>James Gordon</p>
          <p>Microsoft</p>

          {/* Navigation */}
          <nav className="mt-4 w-full flex flex-col gap-2">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                className={`px-5 py-2 w-full text-left ${
                  activeSection === section
                    ? "bg-yellow-400 text-[#00378B]"
                    : ""
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto w-full p-4">
            <button
              onClick={logOut}
              className="flex gap-2 items-center justify-center w-full mb-5 hover:bg-yellow-400 hover:text-[#00378B] py-2 px-4 rounded-md"
            >
              <BiLogOut />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8">
          {sections[activeSection]}
        </div>
      </div>
    </section>
  );
};

export default DashboardFirmAdmin;
