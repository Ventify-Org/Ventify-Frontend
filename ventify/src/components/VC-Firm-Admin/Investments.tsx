import { useEffect, useState } from "react";

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
    Acquirer: string;
    IPO_or_sold_date: string;
  }

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/vcfirms/investments/all"
        );
        const data = await response.json();
        console.log(data)
        setInvestments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const headers = [
    "Company",
    "Founder(s)",
    "Investors",
    "Round",
    "Amount Invested",
    "Type of Investment",
    "Share of Investment",
    "Date of Investment",
    "Maturity Date",
    "IPO or Sold",
    "Acquirer",
    "IPO or Sold Date",
  ];

  return (
    <div className="overflow-x-auto">
      <p className="text-3xl font-bold my-2">Investments</p>
      {loading && (
        // Loading overlay
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {investments.length === 0 && !loading ? (
        <p className="italic">No data yet</p>
      ) : (
        <table className="border-collapse border border-gray-300">
          <tbody>
            {headers.map((header, i) => (
              <tr key={i} className="text-center">
                <td className="border border-gray-300 p-2 bg-[#4D7ABF]">
                  {header}
                </td>
                {investments.map((item) => (
                  <td
                    key={item.id}
                    className="border bg-[#88A8DC] border-gray-300 p-2"
                  >
                    {header === "Company"
                      ? item.startup
                      : header === "Founder(s)"
                      ? "N/A"
                      : header === "Investors"
                      ? "N/A"
                      : header === "Round"
                      ? item.round
                      : header === "Amount Invested"
                      ? item.amount
                      : header === "Type of Investment"
                      ? item.investment_type
                      : header === "Share of Investment"
                      ? item.investment_share
                      : header === "Date of Investment"
                      ? item.investment_date
                      : header === "Maturity Date"
                      ? item.maturity_date
                      : header === "IPO or Sold"
                      ? item.IPO_or_sold
                        ? "Yes"
                        : "No"
                      : header === "Acquirer"
                      ? item.Acquirer
                      : header === "IPO or Sold Date"
                      ? item.IPO_or_sold_date
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Investments;
