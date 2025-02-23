import { useState } from "react";
import PortfolioCompanies from "./ApplicationsPC";
import Investors from "./Investors";

const Applications = () => {
  const [activeMainSection, setActiveMainSection] = useState<string>(
    "Portfolio Companies"
  );

  const sections: Record<string, JSX.Element> = {
    "Portfolio Companies": <PortfolioCompanies />,
    Investors: <Investors />,
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
