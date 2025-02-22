import { useState } from "react";

const AllRaised = () => {
  const [showTable, setShowTable] = useState(false);

  const handleAddClick = () => {
    setShowTable(true);
  };
  const demoData = [
    {
      id: 1,
      investors: "VC Firm A",
      stage: "Stage 3",
      amountRaised: "$5M",
      investmentType: "Equity",
      dilution: "15%",
      dateRaised: "2024-06-01",
      maturityDate: "2027-06-01",
    },
    {
      id: 2,
      investors: "Angel Investors",
      stage: "Seed",
      amountRaised: "$1M",
      investmentType: "Convertible Note",
      dilution: "10%",
      dateRaised: "2023-11-10",
      maturityDate: "2026-11-10",
    },
    {
      id: 3,
      investors: "VC Firm B",
      stage: "Stage 2",
      amountRaised: "$8M",
      investmentType: "Equity",
      dilution: "20%",
      dateRaised: "2022-03-15",
      maturityDate: "2025-03-15",
    },
  ];

  const headers = [
    "Investors",
    "Stage",
    "Amount Raised",
    "Type of Investment",
    "Dilution",
    "Date Raised",
    "Maturity Date",
  ];

  return (
    <>
      <div className="flex my-4 gap-4">
        <select className="px-2 py-1 rounded-md border-2 border-gray-300 hover:cursor-pointer">
          <option>Select Year</option>
          {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select className="px-2 py-1 rounded-md border-2 border-gray-300 hover:cursor-pointer">
          <option>Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-1 rounded-md border-2 bg-green-600 hover:cursor-pointer border-gray-300 text-white"
          onClick={handleAddClick}
        >
          Add
        </button>
      </div>

      {showTable && (
        <div className="overflow-x-auto w-full mt-20">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {headers.map((header, i) => (
                <tr key={i} className="text-center">
                  <td className="border border-gray-300 p-4 bg-[#4D7ABF] text-white font-semibold">
                    {header}
                  </td>
                  {demoData.map((item) => (
                    <td
                      key={item.id}
                      className="border border-gray-300 p-4 bg-[#88A8DC]"
                    >
                      {header === "Investors"
                        ? item.investors
                        : header === "Stage"
                        ? item.stage
                        : header === "Amount Raised"
                        ? item.amountRaised
                        : header === "Type of Investment"
                        ? item.investmentType
                        : header === "Dilution"
                        ? item.dilution
                        : header === "Date Raised"
                        ? item.dateRaised
                        : header === "Maturity Date"
                        ? item.maturityDate
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AllRaised;
