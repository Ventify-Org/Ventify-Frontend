import { FaCamera } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
}

const Settings = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log(error);

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
          setLoggedIn(true);
        } else {
          console.warn("User data invalid or missing:", data);
          setLoggedIn(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching user data:", err.message);
          setError(err.message || "An error occurred");
        } else {
          setError("An unknown error occurred");
        }
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        "https://ventify-backend.onrender.com/api/users/upload-profile-image/",
        {
          method: "POST",
          headers: { Authorization: `Token ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Failed to upload");

      // 🔄 Fetch updated user data
      const userResponse = await fetch(
        "https://ventify-backend.onrender.com/api/users/me",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const userData = await userResponse.json();
      if (userResponse.ok && userData.data) {
        setUserData(userData.data);
      } else {
        console.warn("Failed to refresh user data");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setUploading(false);
      setMenuVisible(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        "https://ventify-backend.onrender.com/api/users/remove-profile-image/",
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to remove profile picture");

      setUserData((prev) =>
        prev ? { ...prev, profile_picture: "/resize.png" } : null
      );
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setMenuVisible(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="border-b-[1.5px] flex items-center justify-center py-1">
        <Link to="/">
          <img src="/logo.png" alt="logo" />
        </Link>
      </div>
      <div className="flex flex-col w-[80%] mx-auto items-center my-10 py-10 shadow-lg">
        <div className="relative w-full flex justify-center items-center px-8 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-8 text-gray-700 hover:text-black text-lg"
          >
            ← Back
          </button>
          <p className="text-3xl">Settings</p>
        </div>

        <div className="relative w-40 h-40">
          {/* Profile Picture */}
          <div className="bg-green-500 rounded-full w-full h-full overflow-hidden">
            <img
              src={userData?.profile_picture || "/resize.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Camera Icon & Menu */}
          <div className="absolute bottom-2 right-2">
            <FaCamera
              className="text-white bg-gray-800 p-2 rounded-full cursor-pointer text-3xl"
              onClick={() => setMenuVisible((prev) => !prev)}
            />

            {menuVisible && (
              <div className="absolute right-0 bottom-12 bg-white shadow-md rounded-lg p-2 w-32">
                <label className="block text-sm text-gray-800 cursor-pointer hover:bg-gray-100 p-2">
                  Upload Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={removeProfilePicture}
                  className="block w-full text-left text-sm text-red-600 hover:bg-gray-100 p-2"
                >
                  Remove Picture
                </button>
              </div>
            )}
          </div>

          {/* Uploading Indicator */}
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}
        </div>

        {/* Form Fields or Not Logged In */}
        <div className="w-[100%] gap-4 flex flex-col mt-8 px-8">
          {loggedIn ? (
            <>
              {/* Name */}
              <div className="flex w-[70%] items-center gap-4">
                <label className="w-32 text-left">Name</label>
                <input
                  className="w-full px-3 py-2 rounded-md text-gray-400 italic border border-black"
                  value={userData?.name || ""}
                  disabled
                />
              </div>

              {/* Username */}
              <div className="flex w-[70%] items-center gap-4">
                <label className="w-32 text-left">Username</label>
                <input
                  className="w-full px-3 py-2 rounded-md text-gray-400 italic border border-black"
                  value={userData?.name || ""}
                  disabled
                />
              </div>

              {/* Email */}
              <div className="flex w-[70%] items-center gap-4">
                <label className="w-32 text-left">Email</label>
                <input
                  className="w-full px-3 py-2 text-gray-400 italic rounded-md border border-black"
                  value={userData?.email || ""}
                  disabled
                />
              </div>

              {/* Phone */}
              <div className="flex w-[70%] items-center gap-4">
                <label className="w-32 text-left">Phone</label>
                <input
                  className="w-full px-3 py-2 rounded-md text-gray-400 italic border border-black"
                  value={userData?.phone || ""}
                  disabled
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center w-full py-10 border border-gray-300 rounded-md">
              <p className="text-xl text-gray-500">Not logged in</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
