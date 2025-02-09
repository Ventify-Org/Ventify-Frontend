import { useState } from "react";
import DashboardMenu from "./Dashboard-Menu";
import Messages from "./Messages";
import Raisings from "./Raisings";
import Applications from "./Applications";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const sections: Record<string, JSX.Element> = {
    Dashboard: <DashboardMenu />,
    Applications: <Applications />,
    "VC-Chat": (
      <div>
        <p>Chat shii</p>
      </div>
    ),
    Messages: <Messages />,
    Raisings: (
      <Raisings
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    ),
    Investments: (
      <div>
        <h1 className="text-3xl font-bold">Portfolio Overview</h1>
        <p>View and manage your portfolio here.</p>
      </div>
    ),
    "Investor T. No": (
      <div>
        <h1 className="text-3xl font-bold">Investor Insights</h1>
        <p>Track your investments and market trends.</p>
      </div>
    ),
    "Portfolio T. No": (
      <div>
        <h1 className="text-3xl font-bold">Investor Insights</h1>
        <p>Track your investments and market trends.</p>
      </div>
    ),
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
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col p-8">
            {sections[activeSection]}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
