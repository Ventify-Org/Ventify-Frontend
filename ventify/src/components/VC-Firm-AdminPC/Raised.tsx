import { useState, ChangeEvent, FC } from "react";

// Define the row structure
interface Row {
  year: string;
  month: string;
  amt_raised: number;
  day: string;
  investors: string;
  dilution: string;
  isEditable: boolean;
}

const Raised: FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");

  const handleAddClick = (): void => {
    if (year && month) {
      setRows((prevRows) => [
        ...prevRows,
        {
          year,
          month,
          amt_raised: 0,
          day: "",
          investors: "",
          dilution: "",
          isEditable: true,
        },
      ]);
      setYear("");
      setMonth("");
    }
  };

  // Handle row field updates
  const handleRowChange = (
    index: number,
    field: keyof Row,
    value: string
  ): void => {
    const updatedRows = [...rows];
    (updatedRows[index][field] as string) = value;

    setRows(updatedRows);
  };

  // Handle saving (disable editing for all rows)
  const handleSave = (): void => {
    const updatedRows = rows.map((row) => ({
      ...row,
      isEditable: false,
    }));
    setRows(updatedRows);
  };

  // Handle select input changes
  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setMonth(e.target.value);
  };

  return (
    <div>
      {/* Year and Month Selectors */}
      <div className="flex my-4 gap-4">
        <select
          className="px-2 py-1 rounded-md border-2 border-gray-300 hover:cursor-pointer"
          value={year}
          onChange={handleYearChange}
        >
          <option value="">Select Year</option>
          {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          className="px-2 py-1 rounded-md border-2 border-gray-300 hover:cursor-pointer"
          value={month}
          onChange={handleMonthChange}
        >
          <option value="">Select Month</option>
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
          disabled={!year || !month}
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead className="bg-[#4D7ABF] text-white">
            <tr>
              <th className="py-2 px-4 border">Year</th>
              <th className="py-2 px-4 border">Month</th>
              <th className="py-2 px-4 border">Amount Raised</th>
              <th className="py-2 px-4 border">Day</th>
              <th className="py-2 px-4 border">Investors</th>
              <th className="py-2 px-4 border">Dilution</th>
            </tr>
          </thead>
          <tbody className="text-center bg-[#88A8DC]">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{row.year}</td>
                <td className="py-2 px-4 border">{row.month}</td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.amt_raised}
                      onChange={(e) =>
                        handleRowChange(index, "amt_raised", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                    />
                  ) : (
                    row.amt_raised
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.day}
                      onChange={(e) =>
                        handleRowChange(index, "day", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                    />
                  ) : (
                    row.day
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.investors}
                      onChange={(e) =>
                        handleRowChange(index, "investors", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                    />
                  ) : (
                    row.investors
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.dilution}
                      onChange={(e) =>
                        handleRowChange(index, "dilution", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                    />
                  ) : (
                    row.dilution
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      {rows.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 rounded-md border-2 bg-blue-600 hover:cursor-pointer border-gray-300 text-white"
            onClick={handleSave}
            disabled={rows.every((row) => !row.isEditable)} // Disable if all rows are already saved
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Raised;
