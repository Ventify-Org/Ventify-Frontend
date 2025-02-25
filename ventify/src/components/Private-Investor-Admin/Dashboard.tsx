import { useState } from "react";
import DashboardMenu from "./DashboardMenu";
import Messages from "./Messages";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const DashboardInvestor = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("Dashboard");

  const sections: Record<string, JSX.Element> = {
    Dashboard: <DashboardMenu />,
    Messages: <Messages />,
    "All Investments": (
      <div>
        <h1 className="text-3xl font-bold">Investor Insights</h1>
        <p>Track your investments and market trends.</p>
      </div>
    ),
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
        //localStorage.removeItem('refresh_token');
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      //localStorage.removeItem('refresh_token');
      navigate("/");
    }
  };

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <div className="border-b-[1.5px] flex items-center justify-center py-1">
          <img src="/logo.png" />
        </div>

        <div className="flex gap-4 flex-grow min-h-screen">
          {/* Sidebar */}
          <div className="w-[15%] bg-[#4D4D4D] text-white flex flex-col items-center py-4 min-h-screen">
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
    </>
  );
};

export default DashboardInvestor;
