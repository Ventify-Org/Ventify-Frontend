const Upload = () => {
  return (
    <>
      <div className="flex gap-1 flex-col my-20 mx-auto">
        <div>
          <button className="bg-[#88A8DC] mx-2 w-[180px] py-2">
            Valuation
          </button>
          <button className="bg-[#88A8DC] mx-2 w-[180px] py-2">Revenue</button>
        </div>
        <div>
          <button className="bg-[#C8DDFF] mx-2 w-[180px] py-2">
            Number of staffs
          </button>
          <button className="bg-[#C8DDFF] mx-2 w-[180px] py-2">Expenses</button>
        </div>
        <div>
          <button className="bg-[#88A8DC] mx-2 w-[180px] py-2">
            Last Raised
          </button>
          <button className="bg-[#88A8DC] mx-2 w-[180px] py-2">
            Current Round
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
