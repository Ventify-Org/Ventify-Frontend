import { useEffect, useState } from "react";
import Subsection from "./ApplicationSubs";

interface PCApplication {
  id: number;
  status: string;
  submitted_at: string;
  tracking_id: string;
}

const PortfolioCompanies = () => {
  const [activeSubsection, setActiveSubsection] = useState<string>("Admitted");
  /*const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Company A",
      status: "admitted",
      submitted_at: "2025-02-22T10:00:00.000Z",
      tracking_id: "COMP-A-2025",
    },
    {
      id: 2,
      name: "Company B",
      status: "pending",
      submitted_at: "2025-02-21T09:00:00.000Z",
      tracking_id: "COMP-B-2025",
    },
    {
      id: 3,
      name: "Company C",
      status: "declined",
      submitted_at: "2025-02-20T08:00:00.000Z",
      tracking_id: "COMP-C-2025",
    },
  ]); */

  const [PCApplications, setPCApplications] = useState<PCApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPCApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/vcfirms/investor-applications/all/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPCApplications(data);
        setError(null);
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

    fetchPCApplications();
  }, []);

  const filterApplicationsByStatus = (status: string) => {
    return PCApplications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase()
    );
  };

  const PCsubsections: Record<string, JSX.Element> = {
    Admitted: (
      <Subsection
        companies={filterApplicationsByStatus("admitted")}
        extraInfo={["Submitted at", "Tracking ID"]}
        showEmptyState
      />
    ),
    Pending: (
      <Subsection
        companies={filterApplicationsByStatus("pending")}
        actions={[
          { label: "Pending", type: "button", style: "bg-red-400" },
          { label: "Decline", type: "button", style: "bg-green-400" },
        ]}
        extraInfo={["Submitted at", "Tracking ID"]}
        showEmptyState
      />
    ),
    Declined: (
      <Subsection
        companies={filterApplicationsByStatus("declined")}
        extraInfo={["Submitted at", "Tracking ID"]}
        showEmptyState
      />
    ),
    "View All": <Subsection companies={PCApplications} showEmptyState />,
  };

  if (loading) return <p>Loading...</p>;
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

      {/*<div>
        {PCsubsections[activeSubsection]}
        <button onClick={() => handleDelete(1)}>Delete Company A</button>
      </div>*/}
    </div>
  );
};

export default PortfolioCompanies;
