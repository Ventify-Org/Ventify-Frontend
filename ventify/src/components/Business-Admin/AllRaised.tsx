const AllRaised = () => {
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
  );
};

export default AllRaised;
