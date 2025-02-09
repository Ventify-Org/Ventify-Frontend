import { useState } from "react";
import { BiTrash } from "react-icons/bi";

const Applications = () => {
  const [activeMainSection, setActiveMainSection] = useState<string>(
    "Portfolio Companies"
  );
  const [activeSubsection, setActiveSubsection] = useState<string>("Admitted");
  const [companies, setCompanies] = useState([
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" },
    { id: 3, name: "Company C" },
    { id: 4, name: "Company D" },
    { id: 5, name: "Company E" },
  ]);
  const raisedAmt = [
    { id: 1, amount: "$400" },
    { id: 2, amount: "$200" },
    { id: 3, amount: "$100" },
    { id: 4, amount: "$500" },
    { id: 5, amount: "$800" },
  ];

  const handleDelete = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const PCsubsections: Record<string, JSX.Element> = {
    Admitted: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-6 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 justify-between items-center mb-3"
          >
            <p>{company.name}</p>
            <button className="mr-4 border-[0.5px] rounded-md px-18">
              Request for more documents
            </button>
            <BiTrash
              size={24}
              className="cursor-pointer text-black hover:text-gray-300"
              onClick={() => handleDelete(company.id)}
            />
          </div>
        ))}
      </div>
    ),
    Pending: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-12 items-center mb-3"
          >
            <p>{company.name}</p>
            <button className="mr-4 border-[0.5px] rounded-md py-1 bg-red-400 px-20 hover:cursor-pointer hover:bg-red-200">
              Pending
            </button>
            <button className="mr-4 border-[0.5px] rounded-md py-1 bg-green-400 px-20 hover:cursor-pointer hover:bg-green-200">
              Decline
            </button>
          </div>
        ))}
      </div>
    ),
    Declined: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-20 items-center mb-3"
          >
            <p>{company.name}</p>
            <p>01/24/2025</p>
          </div>
        ))}
      </div>
    ),
    "View All": (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 justify-between items-center mb-3"
          >
            <p>{company.name}</p>
            <p className="border-[0.5px] px-10 py-1 rounded-md">Declined</p>
            <p>01/24/2025</p>
            <p>12ADG2020</p>
          </div>
        ))}
      </div>
    ),
    Deleted: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-20 items-center mb-3"
          >
            <p>{company.name}</p>
            <p>01/24/2025</p>
          </div>
        ))}
      </div>
    ),
    Raised: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] text-center border-[1px] pb-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        <div className="flex py-4 gap-4 justify-between mb-3 items-center font-bold border-b-[1px] border-gray-400">
          <p className="w-1/4">Company Name</p>
          <p className="w-1/4">Stage</p>
          <p className="w-1/4">Date</p>
          <p className="w-1/4">Amount</p>
        </div>
        {companies.map((company, index) => (
          <div
            key={company.id}
            className="flex gap-4 py-2 justify-between items-center mb-3"
          >
            <p className="w-1/4">{company.name}</p>
            <p className="border-[0.5px] w-1/4 py-1 rounded-md">Declined</p>
            <p className="w-1/4">01/24/2025</p>
            <p className="w-1/4">{raisedAmt[index]?.amount || "N/A"}</p>
          </div>
        ))}
      </div>
    ),
  };

  const INsubsections: Record<string, JSX.Element> = {
    Admitted: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-6 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 justify-between items-center mb-3"
          >
            <p>{company.name}</p>
            <button className="mr-4 border-[0.5px] rounded-md px-18">
              Request for more documents
            </button>
            <BiTrash
              size={24}
              className="cursor-pointer text-black hover:text-gray-300"
              onClick={() => handleDelete(company.id)}
            />
          </div>
        ))}
      </div>
    ),
    Pending: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-12 items-center mb-3"
          >
            <p>{company.name}</p>
            <button className="mr-4 border-[0.5px] rounded-md py-1 bg-red-400 px-20 hover:cursor-pointer hover:bg-red-200">
              Pending
            </button>
            <button className="mr-4 border-[0.5px] rounded-md py-1 bg-green-400 px-20 hover:cursor-pointer hover:bg-green-200">
              Decline
            </button>
          </div>
        ))}
      </div>
    ),
    Declined: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-20 items-center mb-3"
          >
            <p>{company.name}</p>
            <p>01/24/2025</p>
          </div>
        ))}
      </div>
    ),
    "View All": (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 justify-between items-center mb-3"
          >
            <p>{company.name}</p>
            <p className="border-[0.5px] px-10 py-1 rounded-md">Declined</p>
            <p>01/24/2025</p>
            <p>12ADG2020</p>
          </div>
        ))}
      </div>
    ),
    Deleted: (
      <div
        className="w-[90%] mx-auto border-[#A09E9E] border-[1px] py-5 px-12 mt-5 rounded-md
        flex flex-col flex-grow min-h-[60vh]"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex px-3 py-2 gap-20 items-center mb-3"
          >
            <p>{company.name}</p>
            <p>01/24/2025</p>
          </div>
        ))}
      </div>
    ),
  };

  const sections: Record<string, JSX.Element> = {
    "Portfolio Companies": (
      <div>
        <nav className=" w-full flex gap-5 items-center justify-between py-2 px-4">
          {Object.keys(PCsubsections).map((section) => (
            <button
              key={section}
              className={`px-1 py-1 w-full text-center border-[1.5px] rounded-md ${
                activeSubsection === section
                  ? "border-none outline-none text-black"
                  : ""
              }`}
              onClick={() => setActiveSubsection(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        <div>{PCsubsections[activeSubsection]}</div>
      </div>
    ),
    Investors: (
      <div>
        <nav className=" w-full flex gap-5 items-center justify-between py-2 px-4">
          {Object.keys(INsubsections).map((section) => (
            <button
              key={section}
              className={`px-1 py-1 w-full text-center border-[1.5px] rounded-md ${
                activeSubsection === section
                  ? "border-none outline-none text-black"
                  : ""
              }`}
              onClick={() => setActiveSubsection(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        <div>{INsubsections[activeSubsection]}</div>
      </div>
    ),
  };
  return (
    <section>
      <nav className="w-full flex gap-2 items-center justify-between py-2 px-4">
        {Object.keys(sections).map((section) => (
          <button
            key={section}
            className={`px-5 py-2 w-full border-[0.5px] border-[#75757] outline-none rounded-md text-center shadow-md ${
              activeMainSection === section ? "bg-[#FFD700] text-black" : ""
            }`}
            onClick={() => setActiveMainSection(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      <div>{sections[activeMainSection]}</div>
    </section>
  );
};

export default Applications;
