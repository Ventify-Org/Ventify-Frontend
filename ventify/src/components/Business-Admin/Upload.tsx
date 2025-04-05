import { useState } from "react";

const Upload = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const handleClick = (title: string) => {
    setSelectedPage(title);
  };

  const handleBack = () => {
    setSelectedPage(null);
  };

  const buttonData = [
    { title: "Valuation", color: "#88A8DC" },
    { title: "Revenue", color: "#88A8DC" },
    { title: "Number of staffs", color: "#C8DDFF" },
    { title: "Expenses", color: "#C8DDFF" },
    { title: "Last Raised", color: "#88A8DC" },
    { title: "Current Round", color: "#88A8DC" },
  ];

  // Show selected page content
  if (selectedPage) {
    return (
      <div className="p-6">
        <button
          className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={handleBack}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4">{selectedPage}</h1>
        <p>
          This is the section for <strong>{selectedPage}</strong>.
        </p>
        {/* You can add form, content, or upload section here */}
      </div>
    );
  }

  return (
    <div className="flex gap-1 flex-col my-20 mx-auto w-fit">
      {[0, 2, 4].map((startIndex) => (
        <div key={startIndex} className="flex">
          {buttonData.slice(startIndex, startIndex + 2).map((btn) => (
            <button
              key={btn.title}
              className="mx-1 w-[180px] py-2 text-black font-semibold rounded"
              style={{ backgroundColor: btn.color }}
              onClick={() => handleClick(btn.title)}
            >
              {btn.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Upload;
