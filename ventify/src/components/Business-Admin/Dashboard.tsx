import { useEffect, useState } from "react";
import DashboardMenu from "./DashboardMenu";
import Messages from "./Messages";
import AllRaised from "./AllRaised";
import Upload from "./Upload";
import Applications from "./Applications";
import { Link, useNavigate } from "react-router-dom";
import { BiCog, BiLogOut } from "react-icons/bi";
import Invites from "./Invites";

interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
}

const DashboardBusinessAdmin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [userData, setUserData] = useState<UserData | null>(null);
  //const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(error);

  const sections: Record<string, JSX.Element> = {
    Dashboard: <DashboardMenu />,
    Applications: <Applications />,
    Messages: <Messages />,
    "All Raised": <AllRaised />,
    Upload: <Upload />,
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
  }, []);

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
          <Link to="/">
            <img src="/logo.png" alt="logo" />
          </Link>
        </div>

        <div className="flex gap-4 flex-grow min-h-screen">
          {/* Sidebar */}
          <div className="relative w-[15%] bg-[#00B38F] text-white flex flex-col items-center py-10 min-h-screen">
            {/* Settings Icon (Top Right Corner) */}
            <BiCog
              className="absolute top-6 right-6 text-white bg-[#00B38F] p-1 rounded-full cursor-pointer hover:bg-yellow-400 transition"
              size={26}
              onClick={() => {
                navigate("/settings");
              }}
            />
            <div className="w-20 h-20 rounded-full bg-green-400 mb-2 overflow-hidden">
              <img
                src={userData?.profile_picture || "/resize.png"}
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>
            <p>{userData?.name || ""}</p>
            <p>{userData?.email || ""}</p>

            <nav className="mt-4 w-full flex flex-col gap-2">
              {Object.keys(sections).map((section) => (
                <button
                  key={section}
                  className={`px-5 py-2 w-full text-left ${
                    activeSection === section
                      ? "bg-yellow-400 text-black font-bold"
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

export default DashboardBusinessAdmin;
