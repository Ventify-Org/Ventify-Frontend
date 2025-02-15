const Investments = () => {
  const demoData = [
    {
      id: 1,
      company: "TechCorp",
      founders: "Alice & Bob",
      investors: "VC Firm A",
      round: "Series A",
      amountInvested: "$5M",
      investmentType: "Equity",
      shareOfInvestment: "15%",
      dateOfInvestment: "2024-06-01",
      maturityDate: "2027-06-01",
      ipoOrSold: "N/A",
      acquirer: "N/A",
      ipoOrSoldDate: "N/A",
    },
    {
      id: 2,
      company: "HealthX",
      founders: "John Doe",
      investors: "Angel Investors",
      round: "Seed",
      amountInvested: "$1M",
      investmentType: "Convertible Note",
      shareOfInvestment: "10%",
      dateOfInvestment: "2023-11-10",
      maturityDate: "2026-11-10",
      ipoOrSold: "N/A",
      acquirer: "N/A",
      ipoOrSoldDate: "N/A",
    },
    {
      id: 3,
      company: "EduNext",
      founders: "Jane Smith",
      investors: "VC Firm B",
      round: "Series B",
      amountInvested: "$8M",
      investmentType: "Equity",
      shareOfInvestment: "20%",
      dateOfInvestment: "2022-03-15",
      maturityDate: "2025-03-15",
      ipoOrSold: "N/A",
      acquirer: "N/A",
      ipoOrSoldDate: "N/A",
    },
    {
      id: 4,
      company: "AgroTech",
      founders: "Chris Green",
      investors: "VC Firm C",
      round: "Series A",
      amountInvested: "$3M",
      investmentType: "Debt",
      shareOfInvestment: "N/A",
      dateOfInvestment: "2021-08-25",
      maturityDate: "2024-08-25",
      ipoOrSold: "N/A",
      acquirer: "N/A",
      ipoOrSoldDate: "N/A",
    },
    {
      id: 5,
      company: "FinPro",
      founders: "Mike Blue",
      investors: "Private Equity",
      round: "Series C",
      amountInvested: "$10M",
      investmentType: "Equity",
      shareOfInvestment: "30%",
      dateOfInvestment: "2020-01-05",
      maturityDate: "2023-01-05",
      ipoOrSold: "Sold",
      acquirer: "Big Corp",
      ipoOrSoldDate: "2023-01-05",
    },
  ];

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
      <table className="border-collapse border border-gray-300">
        <tbody>
          {headers.map((header, i) => (
            <tr key={i} className="text-center">
              <td className="border border-gray-300 p-2 bg-[#4D7ABF]">
                {header}
              </td>
              {demoData.map((item) => (
                <td
                  key={item.id}
                  className="border bg-[#88A8DC] border-gray-300 p-2"
                >
                  {header === "Company"
                    ? item.company
                    : header === "Founder(s)"
                    ? item.founders
                    : header === "Investors"
                    ? item.investors
                    : header === "Round"
                    ? item.round
                    : header === "Amount Invested"
                    ? item.amountInvested
                    : header === "Type of Investment"
                    ? item.investmentType
                    : header === "Share of Investment"
                    ? item.shareOfInvestment
                    : header === "Date of Investment"
                    ? item.dateOfInvestment
                    : header === "Maturity Date"
                    ? item.maturityDate
                    : header === "IPO or Sold"
                    ? item.ipoOrSold
                    : header === "Acquirer"
                    ? item.acquirer
                    : header === "IPO or Sold Date"
                    ? item.ipoOrSoldDate
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Investments;
