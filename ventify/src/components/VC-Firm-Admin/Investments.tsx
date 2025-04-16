import { useState, useCallback, useEffect } from "react";

const Investments = () => {
  interface Investment {
    id: number;
    startup: string;
    round: string;
    amount: number;
    investment_type: string;
    investment_share: string;
    investment_date: string;
    maturity_date: string;
    IPO_or_sold: boolean;
    acquirer: string;
    IPO_or_sold_date: string;
  }

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInvestment, setNewInvestment] = useState<Investment | null>(null);
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
        "https://ventify-backend.up.railway.app/api/vcfirms/investments/all",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched data: ", data);

      if (Array.isArray(data)) {
        setInvestments((prev) => [...prev, ...data]);
      } else if (data && Array.isArray(data.results)) {
        setInvestments((prev) => [...prev, ...data.results]);
      } else {
        setInvestments((prev) => [...prev]);
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

  // Handle Add Button Click
  const handleAddClick = () => {
    const newRow: Investment = {
      id: investments.length + 1,
      startup: "",
      round: "",
      amount: 0,
      investment_type: "",
      investment_share: "",
      investment_date: "",
      maturity_date: "",
      IPO_or_sold: false,
      acquirer: "",
      IPO_or_sold_date: "",
    };
    setNewInvestment(newRow);
    setIsSaved(false);
  };

  const handleSaveClick = async () => {
    if (newInvestment) {
      try {
        // Function to convert date from DD/MM/YYYY to YYYY-MM-DD
        const formatDate = (dateStr: string): string | null => {
          if (dateStr) {
            const [day, month, year] = dateStr.split("/");
            return `${year}-${month}-${day}`;
          }
          return null;
        };

        // Create a new object with formatted dates
        const formattedInvestment = {
          ...newInvestment,
          investment_date: formatDate(newInvestment.investment_date),
          maturity_date: formatDate(newInvestment.maturity_date),
          IPO_or_sold_date: formatDate(newInvestment.IPO_or_sold_date),
        };

        const token = await refreshAccessToken();
        const response = await fetch(
          "https://ventify-backend.up.railway.app/api/vcfirms/investments/create/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(formattedInvestment),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to save investment:", {
            status: response.status,
            statusText: response.statusText,
            errorData,
          });
          alert(
            `Error: ${response.status} - ${
              response.statusText
            }\nDetails: ${JSON.stringify(errorData)}`
          );
          return;
        }

        const savedInvestment = await response.json();
        setInvestments((prev) => [...prev, savedInvestment]);
        setNewInvestment(null);
        setIsSaved(true);
      } catch (error) {
        console.error("Network or server error:", error);
        if (error instanceof Error) {
          alert(`Network or server error: ${error.message}`);
        } else {
          alert("An unknown error occurred");
        }
      }
    }
  };

  // Handle Input Changes
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: keyof Investment
  ) => {
    if (newInvestment) {
      const value =
        field === "IPO_or_sold" ? e.target.value === "True" : e.target.value;
      setNewInvestment({
        ...newInvestment,
        [field]: value,
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <p className="text-3xl font-bold my-2">Investments</p>

      {loading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <table className="border-collapse border border-gray-300 text-sm w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Company
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Round
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Amount Invested
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Type of Investment
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Share of Investment
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Investment Date
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Maturity Date
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              IPO or Sold
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              Acquirer
            </th>
            <th className="border border-gray-300 p-2 bg-[#4D7ABF] text-white">
              IPO or Sold Date
            </th>
          </tr>
        </thead>
        <tbody>
          {investments.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.startup}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.round}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.amount}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.investment_type}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.investment_share}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.investment_date}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.maturity_date}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.IPO_or_sold ? "True" : "False"}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.acquirer}
              </td>
              <td className="border bg-[#88A8DC] border-gray-300 p-2">
                {item.IPO_or_sold_date}
              </td>
            </tr>
          ))}
          {newInvestment && (
            <tr className="text-center">
              <td className="border p-2">
                <input
                  type="text"
                  value={newInvestment.startup}
                  onChange={(e) => handleInputChange(e, "startup")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                  required
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.round}
                  onChange={(e) => handleInputChange(e, "round")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.amount}
                  onChange={(e) => handleInputChange(e, "amount")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.investment_type}
                  onChange={(e) => handleInputChange(e, "investment_type")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.investment_share}
                  onChange={(e) => handleInputChange(e, "investment_share")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.investment_date}
                  onChange={(e) => handleInputChange(e, "investment_date")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.maturity_date}
                  onChange={(e) => handleInputChange(e, "maturity_date")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <select
                  required
                  value={newInvestment.IPO_or_sold ? "True" : "False"}
                  onChange={(e) =>
                    handleInputChange(
                      e as React.ChangeEvent<HTMLSelectElement>,
                      "IPO_or_sold"
                    )
                  }
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                >
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.acquirer}
                  onChange={(e) => handleInputChange(e, "acquirer")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  required
                  type="text"
                  value={newInvestment.IPO_or_sold_date}
                  onChange={(e) => handleInputChange(e, "IPO_or_sold_date")}
                  disabled={isSaved}
                  className="w-full border rounded p-1"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Add
        </button>
        <button
          onClick={handleSaveClick}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isSaved}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Investments;
