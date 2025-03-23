import { useState } from "react";

const DashboardMenu = () => {
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const companies = ["Company A", "Company B", "Company C", "Company D"];
  const details = [
    "Report",
    "Revenue",
    "Traction",
    "Raised",
    "Update",
    "KPI",
    "ROI",
  ];

  return (
    <div className="flex flex-col px-10 py-4">
      {selectedDetail ? (
        <div>
          <p>{selectedDetail}.</p>
          <div className="my-5 text-sm">
            <p>Revenue</p>
            <p>Expenses</p>
            <p>Traction</p>
            <p>Dilution</p>
            <p>Update: Staff Costs, New Consumer</p>
            <p>Additional details</p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-[#00378B] text-white rounded"
            onClick={() => setSelectedDetail(null)}
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {companies.map((company) => (
            <div key={company} className="flex flex-col">
              <p className="mb-1 font-semibold px-6">{company}</p>
              <div className="flex gap-8 px-5 items-center py-2">
                <div className="bg-red-500 w-30 h-20 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-x-10 gap-y-3 items-center">
                  {details.map((detail) => (
                    <button
                      key={detail}
                      className="border-[1.5px] w-25 py-1 rounded-md cursor-pointer"
                      onClick={() =>
                        setSelectedDetail(`${detail} for ${company}`)
                      }
                    >
                      {detail}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;
