import { useState } from "react";
import { BiArrowFromRight, BiMicrophone, BiSend } from "react-icons/bi";

const Messages = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([
    { text: "Hello, how's the update?", sender: "Company" },
    { text: "We are working on it, should be done soon!", sender: "Company" },
    { text: "Alright, keep me posted.", sender: "Me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "Me" }]);
      setNewMessage(""); // Clear input
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {selectedCompany ? (
        // Chat Interface
        <div className="flex flex-col h-full">
          {/* Navbar */}
          <div className="flex justify-between px-6 py-3 border-b-[1.5px] items-center">
            <div className="flex gap-5 items-center">
              <BiArrowFromRight
                size={18}
                onClick={() => setSelectedCompany(null)}
                className="cursor-pointer"
              />
              <div className="bg-red-500 rounded-full w-10 h-10"></div>
              <p>{selectedCompany}</p>
            </div>
            <BiMicrophone size={18} />
          </div>

          {/* Chat Messages */}
          <div id="msg" className="flex flex-col flex-grow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[70%] px-4 py-2 my-1 rounded-lg ${
                  msg.sender === "Me"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full border-[1.5px] outline-0 rounded-sm px-3 py-2 pr-10"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <BiSend
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00378B] cursor-pointer text-xl"
              />
            </div>
          </div>
        </div>
      ) : (
        // Company List
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex flex-col items-center h-full">
            {["Company A", "Company B", "Company C", "Company D"].map(
              (company) => (
                <div
                  key={company}
                  className="border-b-[1px] border-slate-400 flex py-3 gap-4 items-center w-[70%] px-10 cursor-pointer"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="bg-red-500 w-15 h-15 rounded-full"></div>
                  <p>{company}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
