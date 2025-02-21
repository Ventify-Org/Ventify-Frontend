import { useState } from "react";

const Raised = () => {
  const [showTable, setShowTable] = useState(false);

  const handleAddClick = () => {
    setShowTable(true);
  };

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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead className="bg-[#4D7ABF]">
              <tr>
                <th className="py-2 px-4 border">Amount Raised</th>
                <th className="py-2 px-4 border">Day</th>
                <th className="py-2 px-4 border">Investors</th>
                <th className="py-2 px-4 border">Dilution</th>
              </tr>
            </thead>
            <tbody className="text-center bg-[#88A8DC]">
              <tr>
                <td className="py-2 px-4 border">100,000</td>
                <td className="py-2 px-4 border">Quarterly Review</td>
                <td className="py-2 px-4 border">High Engagement</td>
                <td className="py-2 px-4 border">75%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">200,000</td>
                <td className="py-2 px-4 border">Monthly Growth</td>
                <td className="py-2 px-4 border">Steady Increase</td>
                <td className="py-2 px-4 border">85%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Raised;
