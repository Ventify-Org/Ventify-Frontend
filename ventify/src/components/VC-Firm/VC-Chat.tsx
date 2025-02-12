import { useState } from "react";
import { BiBell, BiChat, BiLike, BiSearch, BiTrash } from "react-icons/bi";

const VcChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "dfdsLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      likes: 0,
    },
    {
      id: 2,
      text: "dfdsLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      likes: 2,
    },
    {
      id: 3,
      text: "dfdsLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      likes: 1,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handlePostMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: Date.now(), text: newMessage, likes: 0 },
      ]);
      setNewMessage("");
    }
  };

  const handleLike = (id: number) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  const handleDelete = (id: number) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-4 bg-gray-100">
      {/* Input Bar */}

      <div className="w-full flex px-5 items-center justify-between mb-4">
        <div className="flex items-center gap-4 w-[70%]">
          <div className="bg-red-500 rounded-full w-15 h-15"></div>
          <div className="flex w-[60%] items-center gap-2">
            <input
              type="text"
              className="w-full border-[1.5px] border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              placeholder="Post something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handlePostMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>
        <div className="flex gap-5 px-5">
          <BiBell size={24} />
          <BiSearch size={24} />
        </div>
      </div>

      {/* Messages List */}
      <div className="w-full px-5 flex flex-col gap-4">
        {messages.map((msg) => (
          <div className="flex gap-4 items-center">
            <div className="w-15 h-15 bg-red-500 rounded-full"></div>
            <div
              key={msg.id}
              className="bg-white w-full shadow-md rounded-lg py-4 border border-gray-200"
            >
              <p className="mb-2 text-gray-800 px-4">{msg.text}</p>

              <div className="flex items-center justify-between pt-2 px-10 border-t-[1px] text-gray-600">
                <button
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => handleLike(msg.id)}
                >
                  <BiLike size={20} /> Like ({msg.likes})
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  <BiChat size={20} /> Reply
                </button>
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => handleDelete(msg.id)}
                >
                  <BiTrash size={20} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VcChat;
