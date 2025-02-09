import { useState } from "react";
import { BiTrash } from "react-icons/bi";

const Applications = () => {
  const [activeMainSection, setActiveMainSection] =
    useState<string>("Applications");
  const [activeSubsection, setActiveSubsection] = useState<string>(
    "Portfolio Companies"
  );
  const [companies, setCompanies] = useState([
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" },
    { id: 3, name: "Company C" },
    { id: 4, name: "Company D" },
    { id: 5, name: "Company E" },
  ]);

  const handleDelete = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const subsections: Record<string, JSX.Element> = {
    Admitted: (
      <div
        className="w-full border-[#A09E9E] border-[1px] py-2 px-6 mt-5 rounded-md
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
      <div>
        <p>Tab 2 Content</p>
      </div>
    ),
    Declined: (
      <div>
        <p>Tab 3 Content</p>
      </div>
    ),
    "View All": (
      <div>
        <p>Tab 4 Content</p>
      </div>
    ),
    Deleted: (
      <div>
        <p>Tab 5 Content</p>
      </div>
    ),
    Raised: (
      <div>
        <p>Tab 6 Content</p>
      </div>
    ),
  };
  const sections: Record<string, JSX.Element> = {
    "Portfolio Companies": (
      <div>
        <nav className=" w-full flex gap-5 items-center justify-between py-2 px-4">
          {Object.keys(subsections).map((section) => (
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

        <div>{subsections[activeSubsection]}</div>
      </div>
    ),
    Investors: (
      <div>
        <p>Cheeee!!!</p>
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
