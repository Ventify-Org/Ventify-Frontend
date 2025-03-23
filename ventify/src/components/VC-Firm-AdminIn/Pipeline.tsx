import { useState, FC } from "react";

// Define the row structure
interface Row {
  company: string;
  country: string;
  invested_capital: 0;
  share: string;
  valuation: 0;
  isEditable: boolean;
}

const Pipeline: FC = () => {
  const [rows, setRows] = useState<Row[]>([]);

  // Handle adding a new row
  const handleAddClick = (): void => {
    setRows((prevRows) => [
      ...prevRows,
      {
        company: "",
        country: "",
        invested_capital: 0,
        share: "",
        valuation: 0,
        isEditable: true, // New row is editable by default
      },
    ]);
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

  return (
    <div>
      <button
        className="px-4 py-1 rounded-md border-2 bg-green-600 hover:cursor-pointer border-gray-300 mt-6 text-white"
        onClick={handleAddClick}
      >
        Add
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <p className="text-center italic mt-6">Pending Portfolio</p>
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead className="bg-[#4D7ABF] text-white">
            <tr>
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Country</th>
              <th className="py-2 px-4 border">Invested Capital</th>
              <th className="py-2 px-4 border">Share</th>
              <th className="py-2 px-4 border">Valuation</th>
            </tr>
          </thead>
          <tbody className="text-center bg-[#88A8DC]">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.company}
                      onChange={(e) =>
                        handleRowChange(index, "company", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                      required
                    />
                  ) : (
                    row.company
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.country}
                      onChange={(e) =>
                        handleRowChange(index, "country", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                      required
                    />
                  ) : (
                    row.country
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.invested_capital}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "invested_capital",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                      required
                    />
                  ) : (
                    row.invested_capital
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.share}
                      onChange={(e) =>
                        handleRowChange(index, "share", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                      required
                    />
                  ) : (
                    row.share
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {row.isEditable ? (
                    <input
                      type="text"
                      value={row.valuation}
                      onChange={(e) =>
                        handleRowChange(index, "valuation", e.target.value)
                      }
                      className="w-full bg-gray-100 border px-2 py-1"
                      required
                    />
                  ) : (
                    row.valuation
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

export default Pipeline;
