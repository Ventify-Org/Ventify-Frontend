const Raisings = ({
  selectedCompany,
  setSelectedCompany,
}: {
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
}) => {
  return selectedCompany ? (
    <div className="px-5 text-sm">
      <div className="flex items-center gap-6 py-2">
        <div className="bg-red-500 w-15 h-15 rounded-full"></div>
        <p> {selectedCompany}</p>
      </div>

      <div className="py-8">
        <p>Annual Revenue: </p>
        <p>Round: </p>
        <p>Traction</p>
        <p>Purpose</p>
        <p>Last Raised</p>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-[#00378B] text-white rounded"
        onClick={() => setSelectedCompany(null)}
      >
        Back to List
      </button>
    </div>
  ) : (
    <div>
      <h1 className="text-3xl font-bold">Raisings</h1>
      <div className="flex flex-col items-center">
        {["Company A", "Company B", "Company C", "Company D"].map((company) => (
          <div
            key={company}
            className="border-b-[1px] border-slate-400 flex py-3 gap-4 items-center w-[70%] px-10 cursor-pointer"
            onClick={() => setSelectedCompany(company)}
          >
            <div className="bg-red-500 w-15 h-15 rounded-full"></div>
            <p>{company}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Raisings;
