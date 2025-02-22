import { useState } from "react";
import Raised from "./Raised";
import Messages from "./Messages";
import Report from "./Report";
import { Link } from "react-router-dom";

const DashboardFirmPC = () => {
  const [activeSection, setActiveSection] = useState<string>("Report");

  const sections: Record<string, JSX.Element> = {
    Report: <Report />,
    Messages: <Messages />,
    Raised: <Raised />,
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

      <Link to="/dashboard/vc-firm/admin" className="fixed bottom-10 right-10">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Sign out to Admin
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

export default DashboardFirmPC;
