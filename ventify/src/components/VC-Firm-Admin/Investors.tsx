import { useEffect, useState, useCallback } from "react";
import Subsection from "./ApplicationSubs";

interface InvestorApplication {
  id: number;
  status: string;
  submitted_at: string;
  tracking_id: string;
}

const Investors = () => {
  const [activeSubsection, setActiveSubsection] = useState<string>("Admitted");
  const [investorApplications, setInvestorApplications] = useState<
    InvestorApplication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh access token
  const refreshAccessToken = useCallback(async () => {
    const refresh_token = localStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }
    console.log("Refreshing token...");

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

    const data: { access: string } = await response.json();
    localStorage.setItem("authToken", data.access);
    console.log("Token refreshed successfully");
    return data.access;
  }, []);

  // Function to get investor applications
  const getInvestorApplications = useCallback(
    async (token: string, retry: boolean = true) => {
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/vcfirms/investor-applications/all/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 401 && retry) {
        console.log("Access token expired. Refreshing...");
        try {
          const newToken = await refreshAccessToken();
          return getInvestorApplications(newToken, false);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          throw new Error("Token refresh failed. Please log in again.");
        }
      }

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = (await response.json()) as {
        results?: { data?: InvestorApplication[] };
      };
      if (data.results && data.results.data) {
        setInvestorApplications(data.results.data);
      } else {
        setInvestorApplications([]); // Ensure it's always an array
      }

      setError(null);
    },
    [refreshAccessToken]
  );

  useEffect(() => {
    const fetchInvestorApplications = async () => {
      setLoading(true);
      try {
        const access_token = localStorage.getItem("authToken");
        if (access_token) {
          await getInvestorApplications(access_token);
        } else {
          throw new Error("No access token available");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorApplications();
  }, [getInvestorApplications]);

  const filterApplicationsByStatus = (status: string) => {
    const filtered = investorApplications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase()
    );
    return filtered.length > 0 ? filtered : [];
  };

  const INsubsections: Record<string, JSX.Element> = {
    Admitted: (
      <>
        {filterApplicationsByStatus("admitted").length === 0 ? (
          <p className="text-center text-gray-500">No admitted applications.</p>
        ) : (
          <Subsection
            companies={filterApplicationsByStatus("admitted")}
            extraInfo={["Submitted at", "Tracking ID"]}
            showEmptyState
          />
        )}
      </>
    ),
    Pending: (
      <>
        {filterApplicationsByStatus("pending").length === 0 ? (
          <p className="text-center text-gray-500">No pending applications.</p>
        ) : (
          <Subsection
            companies={filterApplicationsByStatus("pending")}
            actions={[
              { label: "Pending", type: "button", style: "bg-red-400" },
              { label: "Decline", type: "button", style: "bg-green-400" },
            ]}
            extraInfo={["Submitted at", "Tracking ID"]}
            showEmptyState
          />
        )}
      </>
    ),
    Declined: (
      <>
        {filterApplicationsByStatus("declined").length === 0 ? (
          <p className="text-center text-gray-500">No declined applications.</p>
        ) : (
          <p>Declined applications exist!</p>
        )}
      </>
    ),
    Deleted: (
      <>
        {filterApplicationsByStatus("declined").length === 0 ? (
          <p className="text-center text-gray-500">No deleted applications.</p>
        ) : (
          <Subsection
            companies={filterApplicationsByStatus("declined")}
            extraInfo={["Submitted at", "Tracking ID"]}
            showEmptyState
          />
        )}
      </>
    ),
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <nav className="w-full flex gap-5 items-center justify-between py-2 px-4">
        {Object.keys(INsubsections).map((section) => (
          <button
            key={section}
            className={`px-1 py-1 w-full text-center border-[1.5px] rounded-md ${
              activeSubsection === section
                ? "border-none outline-none text-black"
                : ""
            }`}
            onClick={() => setActiveSubsection(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      <div className="mt-4 italic">{INsubsections[activeSubsection]}</div>
    </div>
  );
};

export default Investors;
