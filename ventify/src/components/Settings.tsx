import { useEffect, useState } from "react";

interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
}

const Settings = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(error);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          "https://ventify-backend.onrender.com/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data?.id) {
          setUserData(data);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        if (err instanceof Error) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[80%] mx-auto items-center my-10 py-10 shadow-lg">
      <p className="text-3xl pb-5">Settings</p>

      {/* Profile Picture */}
      <div className="bg-green-500 rounded-full w-40 h-40 mx-auto overflow-hidden">
        {userData?.profile_picture ? (
          <img
            src={userData.profile_picture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="../src/assets/resize.png"
            alt="Default Profile"
            className="w-full h-full object-cover"
          />
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
                className="w-full px-3 py-2 rounded-md border border-black"
                value={userData?.name || ""}
                disabled
              />
            </div>

            {/* Username */}
            <div className="flex w-[70%] items-center gap-4">
              <label className="w-32 text-left">Username</label>
              <input
                className="w-full px-3 py-2 rounded-md border border-black"
                value={userData?.name || ""}
                disabled
              />
            </div>

            {/* Email */}
            <div className="flex w-[70%] items-center gap-4">
              <label className="w-32 text-left">Email</label>
              <input
                className="w-full px-3 py-2 rounded-md border border-black"
                value={userData?.email || ""}
                disabled
              />
            </div>

            {/* Phone */}
            <div className="flex w-[70%] items-center gap-4">
              <label className="w-32 text-left">Phone</label>
              <input
                className="w-full px-3 py-2 rounded-md border border-black"
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
  );
};

export default Settings;
