import { useState, useEffect, useCallback } from "react";
import { BiBell, BiChat, BiLike, BiSearch, BiTrash } from "react-icons/bi";

const demoForums = [
  { id: "112", title: "Forum 1" },
  { id: "122", title: "Forum 2" },
  { id: "123", title: "Forum 3" },
];

const VcChat = () => {
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const [forums, setForums] = useState(demoForums);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the forum!! Feel free to post your thoughts.",
      likes: 0,
    },
    {
      id: 2,
      text: "This is another example message.",
      likes: 2,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const refresh_token = localStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    try {
      console.log("Refreshing token...");
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/auth/token/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refresh_token }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: { access: string } = await response.json();
      const newAccessToken = data.access;

      localStorage.setItem("authToken", newAccessToken);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    } finally {
      setIsRefreshing(false); // Reset state after attempt
    }
  }, [isRefreshing]);

  const fetchForums = useCallback(async () => {
    try {
      let accessToken = localStorage.getItem("authToken");

      if (!accessToken) {
        try {
          if (!isRefreshing) await refreshAccessToken();
          accessToken = localStorage.getItem("authToken");
        } catch (refreshError) {
          console.error(
            "Failed to refresh token before fetching forums:",
            refreshError
          );
          return;
        }
      }

      if (!accessToken) {
        console.error("Access token still missing after refresh attempt");
        return;
      }

      const response = await fetch(
        "https://ventify-backend.onrender.com/api/vcfirms/forum/get-forum/",
        {
          headers: { Authorization: `Token ${accessToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched successfully:", data);

        const backendForums = Array.isArray(data)
          ? data.map((forum) => ({
              id: forum.id,
              title: forum.name,
            }))
          : [{ id: data.id, title: data.name }];

        setForums([...demoForums, ...backendForums]);
      } else if (response.status === 401 && !isRefreshing) {
        console.log("Token expired — refreshing and retrying...");
        try {
          await refreshAccessToken();
          await fetchForums(); // Retry after refresh
        } catch (refreshError) {
          console.error(
            "Failed to refresh token or retry fetch:",
            refreshError
          );
        }
      } else {
        console.error("Failed to fetch forums:", response.status);
      }
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  }, [refreshAccessToken, isRefreshing]); // Add only necessary dependencies

  useEffect(() => {
    fetchForums();
  }, [fetchForums]); // Now fetchForums is stable and won't recreate on every render

  const handleMakePost = async () => {
    try {
      let accessToken = localStorage.getItem("authToken");

      if (!accessToken) {
        try {
          if (!isRefreshing) await refreshAccessToken();
          accessToken = localStorage.getItem("authToken");
        } catch (refreshError) {
          console.error(
            "Failed to refresh token before making post:",
            refreshError
          );
          return;
        }
      }

      if (!accessToken) {
        console.error("Access token still missing after refresh attempt");
        return;
      }

      const response = await fetch(
        `https://ventify-backend.onrender.com/api/forum-posts/make-post/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({
            forum_id: Number(selectedForum), // Use selected forum id
            title: "New Post", // Default uneditable title
            content: newMessage, // User inputted content
            author_id: "4",
          }),
        }
      );

      if (response.ok) {
        alert("Post created successfully");
        setNewMessage(""); // Clear input after successful post
      } else if (response.status === 401 && !isRefreshing) {
        console.log("Token expired — refreshing and retrying...");
        try {
          await refreshAccessToken();
          await handleMakePost(); // Retry after refresh
        } catch (refreshError) {
          console.error("Failed to refresh token or retry post:", refreshError);
        }
      } else {
        console.error("Failed to make post:", response.status);
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error making post:", error);
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

  const handleForumClick = async (id: string) => {
    alert(id);
    try {
      let accessToken = localStorage.getItem("authToken");

      if (!accessToken) {
        try {
          if (!isRefreshing) await refreshAccessToken();
          accessToken = localStorage.getItem("authToken");
        } catch (refreshError) {
          console.error(
            "Failed to refresh token before fetching forums:",
            refreshError
          );
          return;
        }
      }

      if (!accessToken) {
        console.error("Access token still missing after refresh attempt");
        return;
      }

      const response = await fetch(
        `https://ventify-backend.onrender.com/api/investors/forum/${id}/get-forum/`,
        {
          headers: { Authorization: `Token ${accessToken}` },
        }
      );
      setSelectedForum(id);

      if (response.ok) {
        alert("done");
      } else if (response.status === 401 && !isRefreshing) {
        console.log("Token expired — refreshing and retrying...");
        try {
          await refreshAccessToken();
          await fetchForums(); // Retry after refresh
        } catch (refreshError) {
          console.error(
            "Failed to refresh token or retry fetch:",
            refreshError
          );
        }
      } else {
        console.error("Failed to fetch forums:", response.status);
      }
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };

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

  const selectedForumTitle = forums.find((f) => f.id === selectedForum)?.title;

  return (
    <div className="flex flex-col items-center w-full h-full p-4 bg-gray-100">
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
              onClick={() => handleMakePost()}
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
