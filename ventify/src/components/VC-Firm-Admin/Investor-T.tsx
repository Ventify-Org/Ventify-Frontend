const InvestorT = () => {
  const demoData = [
    {
      id: 1,
      name: "John Doe",
      country: "Argentina",
      investment: "$10,000",
      portfolio: "$5,000",
      ROI: "10%",
      tracking_ID: "123456",
    },
    {
      id: 2,
      name: "Jane Smith",
      country: "Argentina",
      investment: "$10,000",
      portfolio: "$5,000",
      ROI: "10%",
      tracking_ID: "123456",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full mt-10 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="bg-[#4D7ABF] p-2 py-4">No.</th>
            <th className="bg-[#4D7ABF] p-2 py-4">Name</th>
            <th className="bg-[#4D7ABF] p-2 py-4">Country</th>
            <th className="bg-[#4D7ABF] p-2 py-4">Invested Amount</th>
            <th className="bg-[#4D7ABF] p-2 py-4">Portfolio Invested</th>
            <th className="bg-[#4D7ABF] p-2 py-4">ROI</th>
            <th className="bg-[#4D7ABF] p-2 py-4">Tracking ID</th>
          </tr>
        </thead>
        <tbody>
          {demoData.map((item, index) => (
            <tr key={item.id} className="text-center">
              <td className="border border-gray-300 bg-[#4D7ABF] p-2">
                {index + 1}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.name}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.country}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.investment}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.portfolio}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.ROI}
              </td>
              <td className="border border-gray-300 bg-[#88A8DC] p-2">
                {item.tracking_ID}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestorT;
