import { useState, useCallback, useEffect } from "react";
import { BiBell, BiChat, BiLike, BiSearch, BiTrash } from "react-icons/bi";

const VcChat = () => {
  interface Message {
    id: number;
    title: string;
    content: string;
    likes: number;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentForumId, setCurrentForumId] = useState(null);

  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const refresh_token = sessionStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    try {
      console.log("Refreshing token...");
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/auth/token/refresh/",
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

      sessionStorage.setItem("authToken", newAccessToken);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    } finally {
      setIsRefreshing(false); // Reset state after attempt
    }
  }, [isRefreshing]);

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

  const getMessages = useCallback(
    async (id: number) => {
      try {
        let accessToken = sessionStorage.getItem("authToken");

        if (!accessToken) {
          if (!isRefreshing) await refreshAccessToken();
          accessToken = sessionStorage.getItem("authToken");
        }

        if (!accessToken) {
          console.error("Access token still missing after refresh attempt");
          return;
        }

        const response = await fetch(
          `https://ventify-backend.up.railway.app/api/forum-posts/${id}/get-messages/`,
          {
            headers: { Authorization: `Token ${accessToken}` },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setMessages(responseData.data);
        } else if (response.status === 401 && !isRefreshing) {
          console.log("Token expired — refreshing and retrying...");
          await refreshAccessToken();
        } else {
          console.error("Failed to fetch messages:", response.status);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [isRefreshing, refreshAccessToken]
  );

  const handleMakePost = useCallback(
    async (id: number) => {
      // Don't proceed if there's no message to post
      if (!newMessage.trim()) {
        return;
      }

      try {
        let accessToken = sessionStorage.getItem("authToken");
        if (!accessToken) {
          try {
            if (!isRefreshing) await refreshAccessToken();
            accessToken = sessionStorage.getItem("authToken");
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
          `https://ventify-backend.up.railway.app/api/forum-posts/make-post/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${accessToken}`,
            },
            body: JSON.stringify({
              forum_id: id,
              content: newMessage,
            }),
          }
        );
        if (response.ok) {
          alert("Post created successfully");
          setNewMessage("");
          // Optionally refresh messages after posting
          getMessages(id);
        } else if (response.status === 401 && !isRefreshing) {
          console.log("Token expired — refreshing and retrying...");
          try {
            await refreshAccessToken();
            // Don't auto-retry here, let the user click Post again
          } catch (refreshError) {
            console.error(
              "Failed to refresh token or retry post:",
              refreshError
            );
          }
        } else {
          console.error("Failed to make post:", response.status);
          const errorData = await response.json();
          console.error("Error details:", errorData);
        }
      } catch (error) {
        console.error("Error making post:", error);
      }
    },
    [newMessage, refreshAccessToken, isRefreshing, getMessages]
  );

  const getForum = useCallback(async () => {
    try {
      let accessToken = sessionStorage.getItem("authToken");

      if (!accessToken) {
        try {
          if (!isRefreshing) await refreshAccessToken();
          accessToken = sessionStorage.getItem("authToken");
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
        `https://ventify-backend.up.railway.app/api/vcfirms/forum/get-forum/`,
        {
          headers: { Authorization: `Token ${accessToken}` },
        }
      );

      if (response.ok) {
        console.log("Done fetching forums");
        const responseData = await response.json();
        console.log(responseData);
        console.log("ID: ", responseData.data.id);
        const forumId = responseData.data.id;
        // Store the forum ID for later use
        setCurrentForumId(forumId); // You'll need to add this state
        await getMessages(forumId);
      } else if (response.status === 401 && !isRefreshing) {
        console.log("Token expired — refreshing and retrying...");
        try {
          await refreshAccessToken();
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
  }, [getMessages, isRefreshing, refreshAccessToken]);

  useEffect(() => {
    getForum();
  }, [getForum, isRefreshing, refreshAccessToken]);

  return (
    <div className="flex flex-col items-center w-full h-full p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Forum Title</h1>
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
              onClick={() => currentForumId && handleMakePost(currentForumId)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={!currentForumId || !newMessage.trim()}
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
              <p className="mb-2 text-gray-800 px-4">{msg.content}</p>

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
