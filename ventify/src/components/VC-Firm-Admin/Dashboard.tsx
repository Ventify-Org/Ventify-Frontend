import { useEffect, useState } from "react";
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

interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
}

const DashboardFirmAdmin = () => {
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  //const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(error);

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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        let token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        let response = await fetch(
          "https://ventify-backend.onrender.com/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json", // ✅ Add Accept header
            },
          }
        );

        // 🔥 If 401, try refreshing the token
        if (response.status === 401) {
          console.log("Access token expired, attempting to refresh...");
          const refresh_token = localStorage.getItem("refreshToken");
          if (!refresh_token) throw new Error("No refresh token available");

          const refreshResponse = await fetch(
            "https://ventify-backend.onrender.com/api/auth/token/refresh/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json", // ✅ Add Accept header
              },
              body: JSON.stringify({ refresh: refresh_token }),
            }
          );

          if (!refreshResponse.ok) {
            const refreshError = await refreshResponse.json();
            console.error("Failed to refresh token:", refreshError);
            throw new Error(refreshError?.detail || "Failed to refresh token");
          }

          const data = await refreshResponse.json();
          token = data.access;

          if (token) {
            localStorage.setItem("access_token", token);
            console.log("New access token saved");
          } else {
            throw new Error("New access token missing in response");
          }

          // 🔄 Retry with the new token
          response = await fetch(
            "https://ventify-backend.onrender.com/api/users/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json", // ✅ Add Accept header
              },
            }
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch data: ${errorText}`);
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data?.success && data?.data?.id) {
          setUserData(data.data); // ✅ Set data from `data.data`
          //setLoggedIn(true);
        } else {
          console.warn("User data invalid or missing:", data);
          //setLoggedIn(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching user data:", err.message);
          setError(err.message || "An error occurred");
        } else {
          setError("An unknown error occurred");
        }
        //setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // ✅ No dependency on refreshAccessToken needed

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
        <div className="relative w-[16%] bg-[#00378B] text-white flex flex-col items-center py-10 min-h-screen">
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
            <img src="/resize.png" alt="profile pic" />
          </div>
          <p>{userData?.name || ""}</p>
          <p>{userData?.email || ""}</p>

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
