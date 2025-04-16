import { useCallback, useEffect, useState } from "react";

interface AllRaised {
  id: number;
  investors: string;
  stage: string;
  amount: number;
  investment_type: string;
  dilution: string;
  date_raised: string;
  maturity_date: string;
}

const AllRaised = () => {
  const [raisedTable, setRaisedTable] = useState<AllRaised[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRaised, setNewRaised] = useState<AllRaised | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const refreshAccessToken = useCallback(async () => {
    const refresh_token = sessionStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

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
    const newAccessToken = data.access;
    sessionStorage.setItem("authToken", newAccessToken);
    return newAccessToken;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/startups/investments/list-all/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched data: ", data);

      if (Array.isArray(data)) {
        setRaisedTable((prev) => [...prev, ...data]);
      } else if (data && Array.isArray(data.results)) {
        setRaisedTable((prev) => [...prev, ...data.results]);
      } else {
        setRaisedTable((prev) => [...prev]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClick = () => {
    const newRow: AllRaised = {
      id: raisedTable.length + 1,
      investors: "",
      stage: "",
      amount: 0,
      investment_type: "",
      dilution: "",
      date_raised: "",
      maturity_date: "",
    };
    setNewRaised(newRow);
    setIsSaved(false);
  };

  const handleSave = (): void => {
    if (newRaised) {
      setRaisedTable((prev) => [
        ...prev.map((row) => ({
          ...row,
          isEditable: false,
        })),
        { ...newRaised, isEditable: false },
      ]);
      setNewRaised(null);
      setIsSaved(true);
    } else {
      // If no new row, just set existing rows to non-editable
      setRaisedTable((prev) =>
        prev.map((row) => ({
          ...row,
          isEditable: false,
        }))
      );
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: keyof AllRaised
  ) => {
    if (newRaised) {
      setNewRaised({
        ...newRaised,
        [field]: e.target.value,
      });
    }
  };

  return (
    <div className="overflow-x-auto">
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
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <table className="border-collapse border border-gray-300 text-sm w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Investor
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Stage
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Amount Invested
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Type of Investment
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Dilution
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Date Raised
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Maturity Date
            </th>
          </tr>
        </thead>
        <tbody>
          {raisedTable.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.investors}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.stage}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.amount}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.investment_type}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.dilution}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.date_raised}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.maturity_date}
              </td>
            </tr>
          ))}
          {newRaised && (
            <tr className="text-center">
              <td className="border p-2">
                <input
                  type="text"
                  value={newRaised.investors}
                  onChange={(e) => handleInputChange(e, "investors")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                  required
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.stage}
                  onChange={(e) => handleInputChange(e, "stage")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.amount}
                  onChange={(e) => handleInputChange(e, "amount")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.investment_type}
                  onChange={(e) => handleInputChange(e, "investment_type")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.dilution}
                  onChange={(e) => handleInputChange(e, "dilution")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.date_raised}
                  onChange={(e) => handleInputChange(e, "date_raised")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newRaised.maturity_date}
                  onChange={(e) => handleInputChange(e, "maturity_date")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex mt-8 justify-end gap-5">
        <button
          className="px-3 border rounded-md hover:text-white hover:bg-black"
          onClick={handleAddClick}
        >
          Add
        </button>
        <button
          className="px-3 border rounded-md hover:text-white hover:bg-black"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AllRaised;
