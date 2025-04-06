import { useState, useEffect } from "react";
import { BiArrowFromRight, BiMicrophone, BiSend } from "react-icons/bi";

// Refresh access token
const refreshAccessToken = async () => {
  const refresh_token = sessionStorage.getItem("refreshToken");
  if (!refresh_token) {
    throw new Error("No refresh token available");
  }
  console.log("Now to refresh the token");

  const response = await fetch(
    "https://ventify-backend.onrender.com/api/auth/token/refresh/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data: { access: string } = await response.json();
  console.log("Refreshed token successfully");
  const newAccessToken = data.access;
  console.log("New access token: ", newAccessToken);
  sessionStorage.setItem("authToken", newAccessToken);
  return newAccessToken;
};

const Messages = () => {
  const yourIdentifier = 15;

  const [selectedCompany, setSelectedCompany] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    { message: string; sender: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");

  // Sample Companies with IDs
  const companies = [{ id: 1, name: "Company A" }];

  // Fetch messages when a company is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedCompany) {
        try {
          const token = sessionStorage.getItem("authToken");
          const response = await fetch(
            `https://ventify-backend.onrender.com/api/messages/get-messages?user=${selectedCompany.id}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (response.status === 401) {
            const newToken = await refreshAccessToken();
            const retryResponse = await fetch(
              `https://ventify-backend.onrender.com/api/messages/get-messages?user=${selectedCompany.id}`,
              {
                headers: {
                  Authorization: `Token ${newToken}`,
                },
              }
            );
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setMessages(data.messages);
            }
          } else if (response.ok) {
            const data = await response.json();
            setMessages(data.results?.data || []);

            console.log("Fetched messages:", data.messages);
          } else {
            console.error("Failed to fetch messages:", response.status);
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedCompany]);

  // Send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedCompany) {
      const messageData = {
        message: newMessage,
        receiver: selectedCompany.id, // Using receiver as per the docs
      };

      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/messages/send-message/",
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
          // Token expired, refresh and retry
          const newToken = await refreshAccessToken();
          const retryResponse = await fetch(
            "https://ventify-backend.onrender.com/api/messages/send-message/",
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

            setMessages([
              ...messages,
              {
                message: data.message,
                sender: data.sender.toString(), // Ensure it's a string to match your checks
              },
            ]);
            setNewMessage(""); // Clear input
          } else {
            console.error("Failed to send message on retry");
          }
        } else if (response.ok) {
          const data = await response.json();
          setMessages([...messages, data]);
          setNewMessage(""); // Clear input
        } else {
          console.error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {selectedCompany ? (
        // Chat Interface
        <div className="flex flex-col h-full">
          <div className="flex justify-between px-6 py-3 border-b-[1.5px] items-center">
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

          <div id="msg" className="flex flex-col flex-grow p-4 overflow-y-auto">
            {messages?.length > 0 ? (
              [...messages].reverse().map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`max-w-[70%] px-4 py-2 my-1 rounded-lg ${
                      msg.sender?.toString() === yourIdentifier.toString()
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 text-black self-start"
                    }`}
                  >
                    {msg.message}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )}
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
            {companies.map((company) => (
              <div
                key={company.id}
                className="border-b-[1px] border-slate-400 flex py-3 gap-4 items-center w-[70%] px-10 cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <div className="bg-red-500 w-15 h-15 rounded-full"></div>
                <p>{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
