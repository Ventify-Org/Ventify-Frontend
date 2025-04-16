import { useEffect, useState, useCallback } from "react";
import Subsection from "./ApplicationSubs";

interface InvestorApplication {
  id: number;
  name: string;
  status: string;
  submitted_at: string;
  tracking_id: string;
  text: () => Promise<string>;
}

const Investors = () => {
  const [activeSubsection, setActiveSubsection] = useState<string>("Admitted");
  const [investorApplications, setInvestorApplications] = useState<
    InvestorApplication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  {
    /*
  const refreshAccessToken = useCallback(async () => {
    const refresh_token = sessionStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }
    console.log("Refreshing token...");

    const response = await fetch(
      "https://ventify-backend.up.railway.app/api/auth/token/refresh/",
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
    sessionStorage.setItem("authToken", data.access);
    console.log("Token refreshed successfully");
    return data.access;
  }, []);*/
  }

  // Function to get investor applications
  const getInvestorApplications = useCallback(async (token: string) => {
    const response = await fetch(
      "https://ventify-backend.up.railway.app/api/vcfirms/investor-applications/all/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    {
      /*if (response.status === 401 && retry) {
        console.log("Access token expired. Refresh");
        try {
          const newToken = await refreshAccessToken();
          return getInvestorApplications(newToken, false);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          throw new Error("Token refresh failed. Please log in again.");
        }
      */
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
  }, []);

  useEffect(() => {
    const fetchInvestorApplications = async () => {
      setLoading(true);
      try {
        const access_token = sessionStorage.getItem("access_token");
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

  const updateApplicationStatus = (id: number, newStatus: string) => {
    console.log(`Updating application ${id} to ${newStatus}`);
    setInvestorApplications((prevApps) => {
      const updatedApps = prevApps.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      );
      console.log("Updated Applications:", updatedApps);
      return updatedApps;
    });
  };

  const INsubsections: Record<string, JSX.Element> = {
    Admitted: (
      <>
        <Subsection
          companies={[
            {
              id: 999,
              name: "Demo Company",
              status: "admitted",
              submitted_at: "2025-02-22T09:00:00Z",
              tracking_id: "DEMO-ADM-00001",
            },
            ...filterApplicationsByStatus("admitted"),
          ]}
          actions={[
            {
              label: "Request for Documents",
              type: "button",
              style: "bg-blue-400 text-white",
              onClick: async (id: number) => {
                const requestDocs = async (token: string) => {
                  const response = await fetch(
                    `https://ventify-backend.up.railway.app/api/vcfirms/investor-applications/${id}/request-docs/`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                      },
                      body: JSON.stringify({
                        message:
                          "Please provide additional financial documents.",
                      }),
                    }
                  );

                  if (response.ok) {
                    const data = await response.json();
                    console.log("Response Data:", data);
                    alert("Request for documents sent successfully!");

                    if (data.status === "pending") {
                      updateApplicationStatus(id, "pending");
                    }
                  } else {
                    const errorDetails = await response.json();
                    console.error("Error Details:", errorDetails);

                    if (
                      errorDetails.message &&
                      errorDetails.message.includes("does not exist")
                    ) {
                      alert("Company with this ID does not exist.");
                    } else {
                      alert("Failed to request documents. Please try again.");
                    }
                  }
                };

                try {
                  const token = sessionStorage.getItem("authToken");
                  if (!token) {
                    alert("No authentication token found. Please log in.");
                    return;
                  }
                  await requestDocs(token);
                } catch (error) {
                  console.error("Error requesting documents:", error);
                  alert("An error occurred. Please try again.");
                }
              },
            },
          ]}
          showTrashIcon
          showEmptyState
          onDelete={updateApplicationStatus}
        />
      </>
    ),

    Pending: (
      <>
        <Subsection
          companies={[
            {
              id: 0,
              name: "Demo Company",
              status: "pending",
              submitted_at: "2025-02-24T10:00:00Z",
              tracking_id: "DEMO-12345",
            },
            ...filterApplicationsByStatus("pending"),
          ]}
          actions={[
            {
              label: "Admit",
              type: "button",
              style: "bg-green-400",
              onClick: (id: number) => updateApplicationStatus(id, "admitted"),
            },
            {
              label: "Decline",
              type: "button",
              style: "bg-red-400",
              onClick: (id: number) => updateApplicationStatus(id, "declined"),
            },
          ]}
          showActionsOnly
          showEmptyState
        />
      </>
    ),

    Declined: (
      <>
        <Subsection
          companies={[
            {
              id: 888, // Unique ID for demo data
              name: "Demo Company",
              status: "declined",
              submitted_at: "2025-02-20T10:00:00Z",
              tracking_id: "DEMO-DEC-00001",
            },
            ...filterApplicationsByStatus("declined"),
          ]}
          showEmptyState
        />
      </>
    ),

    "View All": (
      <>
        <Subsection
          companies={[
            {
              id: 777,
              name: "Demo Company",
              status: "admitted",
              submitted_at: "2025-02-18T09:00:00Z",
              tracking_id: "DEMO-ALL-00001",
            },
            ...investorApplications,
          ]}
          showEmptyState
          isViewAll
        />
      </>
    ),

    Deleted: (
      <>
        <Subsection
          companies={[
            {
              id: 888, // Unique ID for demo data
              name: "Demo Company",
              status: "deleted",
              submitted_at: "2025-02-15T09:00:00Z",
              tracking_id: "DEMO-DEL-00001",
            },
            ...filterApplicationsByStatus("deleted"),
          ]}
          showEmptyState
          isDeleted
        />
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
