import { useEffect, useState } from "react";
import Subsection from "./ApplicationSubs";

interface PCApplication {
  id: number;
  status: string;
  submitted_at: string;
  tracking_id: string;
  text: () => Promise<string>;
}

interface FetchResponse {
  status: number;
  ok: boolean;
  json: <T>() => Promise<T>;
}

const PortfolioCompanies = () => {
  const [activeSubsection, setActiveSubsection] = useState<string>("Admitted");
  const [PCApplications, setPCApplications] = useState<PCApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPCApplications = async () => {
      setLoading(true);

      const refreshAccessToken = async () => {
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

        const data: { access: string } = await response.json();
        console.log("Refreshed token successfully");
        const newAccessToken = data.access;
        console.log("New access token: ", newAccessToken);
        localStorage.setItem("authToken", newAccessToken);
        return newAccessToken;
      };

      const getApplications = async (token: string, retry: boolean = true) => {
        const response: FetchResponse = await fetch(
          "https://ventify-backend.onrender.com/api/vcfirms/investor-applications/all/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.status === 401 && retry) {
          console.log("Access token expired. Attempting to refresh...");
          try {
            const newToken = await refreshAccessToken();
            return getApplications(newToken, false);
          } catch (err) {
            console.error("Failed to refresh token:", err);
            throw new Error("Token refresh failed. Please log in again.");
          }
        }

        if (!response.ok) {
          console.log(
            "Failed response:",
            response.status,
            await response.json()
          );
          throw new Error("Failed to fetch data");
        }

        const data = (await response.json()) as {
          results?: { data?: PCApplication[] };
        };
        if (data.results && data.results.data) {
          setPCApplications(data.results.data);
        } else {
          setPCApplications([]); // Ensure it's always an array
        }

        setError(null);
      };

      try {
        const access_token = localStorage.getItem("authToken");
        if (access_token) {
          await getApplications(access_token);
        } else {
          throw new Error("No access token available");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPCApplications();
  }, []);

  const filterApplicationsByStatus = (status: string) => {
    const filtered = PCApplications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase()
    );
    return filtered.length > 0 ? filtered : [];
  };

  const PCsubsections: Record<string, JSX.Element> = {
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
    "View All": (
      <>
        {PCApplications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications available.
          </p>
        ) : (
          <Subsection companies={PCApplications} showEmptyState />
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
    Raised: (
      <>
        {PCApplications.length === 0 ? (
          <p className="text-center text-gray-500">No records available.</p>
        ) : (
          <Subsection companies={PCApplications} showEmptyState />
        )}
      </>
    ),
  };

  if (loading)
    return (
      <>
        <p>Loading...</p>
      </>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <nav className="w-full flex gap-5 items-center justify-between py-2 px-4">
        {Object.keys(PCsubsections).map((section) => (
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

      <div className="mt-4 italic text-left">
        {PCsubsections[activeSubsection]}
      </div>
    </div>
  );
};

export default PortfolioCompanies;
