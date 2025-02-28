// ... Other Imports ...
import { useCallback, useEffect, useState } from "react";

// Define the shape of the Application object
interface Application {
  id: string;
  status: string;
  submitted_at: string;
  tracking_id: number;
  message: string;
}

// Define the structure of the API response
interface ApiResponse {
  results: Application[];
}

// Define the structure for the token refresh response
interface TokenResponse {
  access: string;
}

const Applications = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const defaultStatus = "Pending"; // Default status for new applications

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async (): Promise<string> => {
    const refresh_token = localStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }
    console.log("Now to refresh the token");

    const response = await fetch(
      "https://ventify-backend.onrender.com/api/auth/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh_token }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: TokenResponse = await response.json();
    console.log("Refreshed token successfully");
    localStorage.setItem("authToken", data.access);
    return data.access;
  }, []);

  // Function to fetch applications data
  const fetchData = useCallback(async (): Promise<void> => {
    const demoApplication: Application = {
      id: "demo-123",
      status: "Pending",
      submitted_at: "2025-01-01",
      tracking_id: 9999,
      message: "This is a demo application.",
    };

    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/investors/applications/list-all/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data: ApiResponse | Application[] = await response.json();
      console.log("Fetched data: ", data);

      if (Array.isArray(data)) {
        setApplications([demoApplication, ...data]);
      } else if (data && Array.isArray(data.results)) {
        setApplications([demoApplication, ...data.results]);
      } else {
        setApplications([demoApplication]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch applications. Please try again later.");
      setLoading(false);
    }
  }, [refreshAccessToken]);

  // Add New Application with Authorization Header
  const addApplication = useCallback(async () => {
    setSubmitting(true);
    try {
      const token = await refreshAccessToken(); // Get fresh access token
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/investors/applications/apply/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include the token in header
          },
          body: JSON.stringify({
            status: defaultStatus,
            message: newMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add application");
      }

      alert("Application added successfully!");
      setShowModal(false);
      setNewMessage("");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error adding application:", error);
      alert("Failed to add application. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }, [newMessage, refreshAccessToken, fetchData, defaultStatus]);

  // Fetch applications on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <p className="text-2xl font-bold mb-4">Applications</p>
      <div>
        {applications.map((item) => (
          <div
            key={item.id}
            className="shadow-lg w-[80%] py-8 flex px-6 justify-between items-center mb-4"
          >
            <div>
              <p className="font-semibold">ID: {item.id}</p>
              <p>Tracking ID: {item.tracking_id}</p>
              <p>Created: {item.submitted_at}</p>
              <p>Message: {item.message}</p>
              <p>
                Status: <span className="text-orange-500">{item.status}</span>
              </p>
            </div>
          </div>
        ))}
        {applications.length === 0 && !loading && <p>No applications found.</p>}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          New Application
        </button>
      </div>

      {/* Modal for Adding New Application */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-[80%] max-w-md">
            <h2 className="text-2xl mb-4">New Application</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Status</label>
              <input
                type="text"
                value={defaultStatus}
                readOnly
                className="border p-2 w-full bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Message</label>
              <input
                type="text"
                placeholder="Enter your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <button
              onClick={addApplication}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Applications;
