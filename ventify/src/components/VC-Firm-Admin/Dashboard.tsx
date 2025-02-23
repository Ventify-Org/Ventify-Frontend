import { useState } from "react";
import DashboardMenu from "./Dashboard-Menu";
import Messages from "./Messages";
import Raisings from "./Raisings";
import Applications from "./Applications";
import VcChat from "./VC-Chat";
import InvestorT from "./Investor-T";
import Investments from "./Investments";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

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
  };

  const logOut = () => {
    navigate("/");
  };

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <div className="border-b-[1.5px] flex items-center justify-center py-1">
          <img src="/logo.png" />
        </div>

        <div className="flex gap-4 flex-grow min-h-screen">
          {/* Sidebar */}
          <div className="w-[15%] bg-[#00378B] text-white flex flex-col items-center py-4 min-h-screen">
            <div className="w-20 h-20 rounded-full bg-green-400"></div>
            <p>James Gordon</p>
            <p>Microsoft</p>

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

      <Link to="/dashboard/vc-firm/pc" className="fixed bottom-10 right-10">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Sign out to PC
        </button>
      </Link>
      <Link to="/dashboard/vc-firm/in" className="fixed bottom-10 right-10">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Sign out to Investor
        </button>
      </Link>
    </>
  );
};

export default DashboardFirmAdmin;
