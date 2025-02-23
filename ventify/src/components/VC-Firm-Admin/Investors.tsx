import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchInvestorApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/vcfirms/investor-applications/all/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setInvestorApplications(data);
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

    fetchInvestorApplications();
  }, []);

  const filterApplicationsByStatus = (status: string) => {
    return investorApplications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase()
    );
  };

  const INsubsections: Record<string, JSX.Element> = {
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
    Deleted: (
      <Subsection
        companies={filterApplicationsByStatus("deleted")}
        extraInfo={["Submitted at", "Tracking ID"]}
        showEmptyState
      />
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

      <div>{INsubsections[activeSubsection]}</div>
    </div>
  );
};

export default Investors;
