import { useState } from "react";
import { BiTrash } from "react-icons/bi";

interface Company {
  id: number;
  name: string;
  status: string;
  submitted_at: string;
  tracking_id: string;
}

interface SubsectionProps {
  companies: Company[];
  actions?: {
    label: string;
    type: string;
    style?: string;
    onClick?: (id: number) => void;
  }[];
  showActionsOnly?: boolean;
  showTrashIcon?: boolean;
  showEmptyState?: boolean;
  onDelete?: (id: number, newStatus: string) => void;
  isViewAll?: boolean;
  isDeleted?: boolean;
  isRaised?: boolean;
}

// Define the shape of the company details response
interface CompanyDetails {
  id: number;
  status: string;
  submitted_at: string;
  admitted_at: string;
  tracking_id: string;
  application_documents: string[];
  message: string;
  investor: number;
  vc_firm: number;
}

const Subsection = ({
  companies,
  actions = [],
  showActionsOnly = false,
  showTrashIcon = false,
  showEmptyState = false,
  onDelete,
  isViewAll = false,
  isDeleted = false,
  isRaised = false,
}: SubsectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(
    null
  );

  const fetchCompanyDetails = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(
        `https://ventify-backend.onrender.com/api/vcfirms/investor-applications/${id}/fetch/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanyDetails(data);
        setShowModal(true);
      } else {
        const errorDetails = await response.json();
        console.error("Error Details:", errorDetails);

        if (
          errorDetails.message &&
          errorDetails.message.includes("does not exist")
        ) {
          alert("Company with this ID does not exist.");
        } else {
          alert("Failed fetch company details. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-[95%] mx-auto border-[#A09E9E] border-[1px] py-5 px-6 mt-5 rounded-md flex flex-col flex-grow min-h-[60vh]">
      {companies.length === 0 && showEmptyState ? (
        <p className="text-center text-gray-500 py-10">No data yet</p>
      ) : (
        companies.map((company) => (
          <div
            key={company.id}
            className="mb-4 font-bold py-4 px-6 border-b-[1px] flex justify-between rounded-md"
          >
            <span
              className="cursor-pointer hover:underline"
              onClick={() => fetchCompanyDetails(company.id)}
            >
              {company.name}
            </span>

            {isViewAll && (
              <>
                <p className="text-sm border-[1.5px] px-5 rounded-lg">
                  {company.status}
                </p>
                <p className="text-sm">{company.tracking_id}</p>
              </>
            )}
            {(isViewAll ||
              company.status === "declined" ||
              isDeleted ||
              isRaised) && (
              <p className="text-sm">
                {new Date(company.submitted_at).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-6">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`border-[0.5px] rounded-md px-10 ${
                    action.style || ""
                  }`}
                  onClick={() => {
                    console.log(
                      `Clicked ${action.label} for company ID: ${company.id}`
                    );
                    action.onClick?.(company.id);
                  }}
                >
                  {action.label}
                </button>
              ))}
              {!showActionsOnly && showTrashIcon && (
                <BiTrash
                  size={24}
                  className="cursor-pointer text-black hover:text-gray-300"
                  onClick={() => {
                    console.log(`Deleting company ID: ${company.id}`);
                    onDelete?.(company.id, "deleted");
                  }}
                />
              )}
            </div>
          </div>
        ))
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        details={companyDetails}
      />
    </div>
  );
};

const Modal = ({
  show,
  onClose,
  details,
}: {
  show: boolean;
  onClose: () => void;
  details: CompanyDetails | null;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Company Details</h2>
        {details ? (
          <>
            <p>
              <strong>ID:</strong> {details.id}
            </p>
            <p>
              <strong>Status:</strong> {details.status}
            </p>
            <p>
              <strong>Submitted At:</strong> {details.submitted_at}
            </p>
            <p>
              <strong>Admitted At:</strong> {details.admitted_at}
            </p>
            <p>
              <strong>Tracking ID:</strong> {details.tracking_id}
            </p>
            <p>
              <strong>Message:</strong> {details.message}
            </p>
            <p>
              <strong>Investor:</strong> {details.investor}
            </p>
            <p>
              <strong>VC Firm:</strong> {details.vc_firm}
            </p>
            <p>
              <strong>Documents:</strong>{" "}
              {details.application_documents.join(", ")}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Subsection;
