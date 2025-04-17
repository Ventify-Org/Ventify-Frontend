import { useState, useCallback, useEffect } from "react";
import { BiBell, BiSearch } from "react-icons/bi";

const VcChat = () => {
  interface Message {
    id: number;
    title: string;
    content: string;
    likes: number;
    comments?: string[];
  }

  interface VisibleComments {
    [postId: number]: boolean;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentForumId, setCurrentForumId] = useState(null);
  const [authorId, setAuthorId] = useState<number | null>(null);

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

  const [visibleComments, setVisibleComments] = useState<
    Record<number, boolean>
  >({});
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  const toggleComments = (postId: number) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  interface ReplyInputs {
    [postId: number]: string;
  }

  const handleReplyChange = (postId: number, value: string): void => {
    setReplyInputs((prev: ReplyInputs) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddReply = async (postId: number) => {
    const reply = replyInputs[postId];
    if (!reply?.trim()) return;

    const accessToken = sessionStorage.getItem("authToken");
    if (!accessToken || authorId === null) {
      console.error("Missing token or authorId");
      return;
    }

    try {
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/forum-posts/make-comment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({
            post_id: postId,
            title: "Reply",
            content: reply,
            author_id: authorId,
          }),
        }
      );

      if (response.ok) {
        console.log("Comment added");

        // Optionally update UI immediately
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === postId
              ? {
                  ...msg,
                  comments: [...(msg.comments || []), reply],
                }
              : msg
          )
        );

        // Clear input
        setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDelete = (postId: number): void => {
    setMessages((prevMessages: Message[]) =>
      prevMessages.filter((msg: Message) => msg.id !== postId)
    );

    // Optional: clean up related states
    setVisibleComments((prev: VisibleComments) => {
      const newState: VisibleComments = { ...prev };
      delete newState[postId];
      return newState;
    });

    setReplyInputs((prev: ReplyInputs) => {
      const newState: ReplyInputs = { ...prev };
      delete newState[postId];
      return newState;
    });
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
        const authorId = responseData.data.owner;
        console.log(authorId);
        setAuthorId(authorId);
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
          <div key={msg.id} className="flex gap-4 items-start">
            <div className="w-15 h-15 bg-red-500 rounded-full"></div>
            <div className="bg-white w-full shadow-md rounded-lg py-4 border border-gray-200">
              <p className="mb-2 text-gray-800 px-4">{msg.content}</p>

              <div className="flex items-center justify-between pt-2 px-6 border-t text-gray-600 text-sm">
                <button
                  onClick={() => toggleComments(msg.id)}
                  className="text-blue-600 hover:underline"
                >
                  {visibleComments[msg.id] ? "Hide Comments" : "View Comments"}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(msg.id)}
                >
                  Delete
                </button>
              </div>

              {/* Comments Section */}
              {visibleComments[msg.id] && (
                <div className="px-6 pt-4 pb-2 space-y-2">
                  {msg.comments?.map((comment, index) => (
                    <div
                      key={index}
                      className="text-gray-700 text-sm border-l-2 pl-2 border-gray-300"
                    >
                      {comment}
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Write a reply..."
                      value={replyInputs[msg.id] || ""}
                      onChange={(e) =>
                        handleReplyChange(msg.id, e.target.value)
                      }
                    />
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      onClick={() => handleAddReply(msg.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VcChat;
