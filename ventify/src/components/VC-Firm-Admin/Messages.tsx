import { useState, useEffect } from "react";
import { BiArrowFromRight, BiMicrophone, BiSend, BiPlus } from "react-icons/bi";

interface VCResponse {
  results: {
    data: { id: number; name: string }[];
  };
}

const refreshAccessToken = async () => {
  const refresh_token = sessionStorage.getItem("refreshToken");
  if (!refresh_token) throw new Error("No refresh token available");

  const response = await fetch(
    "https://ventify-backend.up.railway.app/api/auth/token/refresh/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refresh_token }),
    }
  );

  if (!response.ok) throw new Error("Failed to refresh token");

  const data: { access: string } = await response.json();
  sessionStorage.setItem("authToken", data.access);
  return data.access;
};

const Messages = () => {
  const yourIdentifier = 25;

  const [selectedCompany, setSelectedCompany] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [vcFirms, setVcFirms] = useState<{ id: number; name: string }[]>([]);
  const [messages, setMessages] = useState<
    { message: string; sender: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { id: number; name: string }[]
  >([]);

  // Fetch messages for selected company
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCompany) return;

      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(
          `https://ventify-backend.up.railway.app/api/messages/get-messages?user=${selectedCompany.id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          const retryResponse = await fetch(
            `https://ventify-backend.up.railway.app/api/messages/get-messages?user=${selectedCompany.id}`,
            {
              headers: {
                Authorization: `Token ${newToken}`,
              },
            }
          );

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setMessages(data.messages || []);
          }
        } else if (response.ok) {
          const data = await response.json();
          setMessages(data.results?.data || []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedCompany]);

  // Fetch VC Firms
  const fetchVCFirms = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/vcfirms/list-all/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseData: VCResponse = await response.json();
      const firms = responseData.results.data.map((firm) => ({
        id: firm.id,
        name: firm.name,
      }));
      setVcFirms(firms);
    } catch (err) {
      console.error("Failed to load VC firms:", err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCompany) return;

    const messageData = {
      message: newMessage,
      receiver: selectedCompany.id,
    };

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/messages/send-message/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        const retryResponse = await fetch(
          "https://ventify-backend.up.railway.app/api/messages/send-message/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${newToken}`,
            },
            body: JSON.stringify(messageData),
          }
        );

        if (retryResponse.ok) {
          const data = await retryResponse.json();
          setMessages((prev) => [
            ...prev,
            {
              message: data.message,
              sender: data.sender.toString(),
            },
          ]);
          setNewMessage("");
        }
      } else if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Send message error:", err);
    }

    // Add to history if not already present
    if (!chatHistory.find((c) => c.id === selectedCompany.id)) {
      setChatHistory((prev) => [...prev, selectedCompany]);
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {selectedCompany ? (
        // Chat Interface
        <div className="flex flex-col h-full relative">
          <div className="flex justify-between px-6 py-3 border-b items-center">
            <div className="flex gap-5 items-center">
              <BiArrowFromRight
                size={18}
                onClick={() => setSelectedCompany(null)}
                className="cursor-pointer"
              />
              <div className="bg-red-500 rounded-full w-10 h-10"></div>
              <p>{selectedCompany.name}</p>
            </div>
            <BiMicrophone size={18} />
          </div>

          <div className="flex flex-col flex-grow p-4 pb-20 overflow-y-auto">
            {messages.length > 0 ? (
              [...messages].reverse().map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] px-4 py-2 my-1 rounded-lg ${
                    msg.sender?.toString() === yourIdentifier.toString()
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black self-start"
                  }`}
                >
                  {msg.message}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )}
          </div>

          <div className="absolute left-0 right-0 px-4 mt-[70vh] pt-3 bg-white border-t">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full border outline-0 rounded-sm px-3 py-2 pr-10"
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
        // Main view: Chat history or VC selection
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Your Conversations</h1>
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No conversations yet. Tap + to start one.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {chatHistory.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className="p-4 shadow rounded cursor-pointer hover:bg-gray-100"
                >
                  <p className="text-lg font-medium">{company.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAB: Floating Action Button */}
      {!selectedCompany && (
        <button
          onClick={fetchVCFirms}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        >
          <BiPlus size={24} />
        </button>
      )}

      {/* VC Firm selection modal-ish list */}
      {!selectedCompany && vcFirms.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/70 mt-55 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md max-h-[80vh] border-[1px] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Choose a VC Firm
            </h2>
            <div className="divide-y">
              {vcFirms.map((firm) => (
                <div
                  key={firm.id}
                  onClick={() => {
                    setSelectedCompany(firm);
                    setVcFirms([]);
                  }}
                  className="py-3 px-2 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  {firm.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
