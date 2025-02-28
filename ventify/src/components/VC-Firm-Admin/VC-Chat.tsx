import { useState, useEffect } from "react";
import { BiBell, BiChat, BiLike, BiSearch, BiTrash } from "react-icons/bi";

const demoForums = [
  { id: "demo-1", title: "Forum 1" },
  { id: "demo-2", title: "Forum 2" },
  { id: "demo-3", title: "Forum 3" },
];

const VcChat = () => {
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const [forums, setForums] = useState(demoForums);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the forum! Feel free to post your thoughts.",
      likes: 0,
    },
    {
      id: 2,
      text: "This is another example message.",
      likes: 2,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch forums from backend
  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await fetch(
          "https://ventify-backend.onrender.com/pi/vcfirms/forum/get-forum"
        );
        if (response.ok) {
          const data = await response.json();
          const backendForums = data.map(
            (forum: { id: number; name: string }) => ({
              id: forum.id.toString(),
              title: forum.name,
            })
          );
          setForums([...demoForums, ...backendForums]);
        } else {
          console.error("Failed to fetch forums");
        }
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, []);

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

  // Handle Forum Click
  const handleForumClick = (id: string) => {
    // Navigate to the forum details page using the ID
    window.location.href = `https://ventify-backend.onrender.com/api/investors/forum/${id}/get-forum`;
  };

  // When no forum is selected, show the selection screen
  if (selectedForum === null) {
    return (
      <div className="flex flex-col items-center w-full h-full p-4 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Select a Forum</h1>
        <div className="flex flex-col gap-4 w-full max-w-md">
          {forums.map((forum) => (
            <button
              key={forum.id}
              onClick={() => handleForumClick(forum.id)}
              className="bg-white shadow-md rounded-lg py-4 px-6 text-xl text-gray-800 border border-gray-200 hover:bg-gray-50"
            >
              {forum.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // If a forum is selected, show the chat interface
  const selectedForumTitle = forums.find((f) => f.id === selectedForum)?.title;

  return (
    <div className="flex flex-col items-center w-full h-full p-4 bg-gray-100">
      {/* Forum Title and Back Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{selectedForumTitle}</h1>
        <button
          onClick={() => setSelectedForum(null)}
          className="text-blue-600 hover:underline"
        >
          Back to Forums
        </button>
      </div>

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
          <div key={msg.id} className="flex gap-4 items-center">
            <div className="w-15 h-15 bg-red-500 rounded-full"></div>
            <div className="bg-white w-full shadow-md rounded-lg py-4 border border-gray-200">
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
