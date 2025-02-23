import { BiTrash } from "react-icons/bi";

interface SubsectionProps {
  companies: {
    id: number;
    status: string;
    submitted_at: string;
    tracking_id: string;
  }[];
  actions?: { label: string; type: string; style?: string }[];
  extraInfo?: string[];
  showEmptyState?: boolean;
}

const Subsection = ({
  companies,
  actions = [],
  extraInfo = [],
  showEmptyState = false,
}: SubsectionProps) => {
  return (
    <div className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-6 mt-5 rounded-md flex flex-col flex-grow min-h-[60vh]">
      {companies.length === 0 && showEmptyState ? (
        <p className="text-center text-gray-500 py-10">No data yet</p>
      ) : (
        companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 justify-between items-center mb-3"
          >
            <p>{company.status}</p>
            {extraInfo.includes("Submitted at") && (
              <p>{new Date(company.submitted_at).toLocaleDateString()}</p>
            )}
            {extraInfo.includes("Tracking ID") && <p>{company.tracking_id}</p>}
            {actions.map((action, index) => (
              <button
                key={index}
                className={`mr-4 border-[0.5px] rounded-md px-18 ${
                  action.style || ""
                }`}
              >
                {action.label}
              </button>
            ))}
            <BiTrash
              size={24}
              className="cursor-pointer text-black hover:text-gray-300"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Subsection;
