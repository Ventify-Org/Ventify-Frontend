import { useCallback, useEffect, useState } from "react";

const Invites = () => {
  interface Invite {
    id: number;
    email: string;
    status: string;
    created_at: string;
    expires_at: string;
    receipient_type: string;
  }

  // Separate states for sent and received invites
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [receipientType, setReceipientType] = useState("portfolio");
  const [expiresAt, setExpiresAt] = useState("");
  const [activeMainSection, setActiveMainSection] =
    useState<string>("Received Invites");

  const refreshAccessToken = useCallback(async () => {
    const refresh_token = sessionStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

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
    sessionStorage.setItem("authToken", data.access);
    return data.access;
  }, []);

  // Fetch both sent and received invites
  const fetchInvites = useCallback(async () => {
    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/users/invitations/all/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched invites data:", data);

        setSentInvites(data.sent_invites?.data || []);

        // Ensure receivedInvites always has at least one item
        if (data.received_invites?.data?.length > 0) {
          setReceivedInvites(data.received_invites.data);
        } else {
          // Add demo invite if none exist
          setReceivedInvites([
            {
              id: 999,
              email: "demo@example.com",
              receipient_type: "portfolio",
              created_at: new Date().toISOString(),
              expires_at: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              status: "pending",
            },
          ]);
        }
      } else {
        console.error("Failed to fetch invites:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    fetchInvites();

    // If no received invites, add a demo invite
    setReceivedInvites((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: 999, // Demo ID
            email: "demo@example.com",
            receipient_type: "portfolio",
            created_at: new Date().toISOString(),
            expires_at: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "pending",
          },
        ];
      }
      return prev;
    });
  }, [fetchInvites]);

  // Generate new invite
  const generateInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestBody = {
      email: newInviteEmail,
      receipient_type: receipientType,
      expires_at: expiresAt,
    };

    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/users/invitations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data: Invite = await response.json();
        console.log(data);
        setNewInviteEmail("");
        setReceipientType("portfolio");
        setExpiresAt("");
        setShowModal(false);
        setSentInvites((prev) => [...prev, data]); // Update only sentInvites
      } else {
        console.error("Failed to generate invite:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating invite:", error);
    }
  };

  const revokeInvite = async (id: number) => {
    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        `https://ventify-backend.onrender.com/api/users/invitations/${id}/revoke`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Update the UI to reflect the revoked status
        setSentInvites((prev) =>
          prev.map((invite) =>
            invite.id === id ? { ...invite, status: "revoked" } : invite
          )
        );
      } else {
        console.error("Failed to revoke invite:", response.statusText);
      }
    } catch (error) {
      console.error("Error revoking invite:", error);
    }
  };

  const acceptInvite = async (id: number) => {
    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        `https://ventify-backend.onrender.com/api/users/invitations/${id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setReceivedInvites((prev) =>
          prev.map((invite) =>
            invite.id === id ? { ...invite, status: "accepted" } : invite
          )
        );
      } else {
        console.error("Failed to accept invite:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const declineInvite = async (id: number) => {
    try {
      const token = await refreshAccessToken();
      const response = await fetch(
        `https://ventify-backend.onrender.com/api/users/invitations/${id}/decline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setReceivedInvites((prev) =>
          prev.map((invite) =>
            invite.id === id ? { ...invite, status: "declined" } : invite
          )
        );
      } else {
        console.error("Failed to decline invite:", response.statusText);
      }
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Section Navigation */}
      <nav className="w-full flex gap-2 items-center justify-between py-2 px-4">
        {["Received Invites", "Sent Invites"].map((section) => (
          <button
            key={section}
            className={`px-5 py-2 w-full border-[0.5px] border-gray-500 outline-none rounded-md text-center shadow-md ${
              activeMainSection === section ? "bg-[#FFD700] text-black" : ""
            }`}
            onClick={() => setActiveMainSection(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      {/* Invite List */}
      <ul className="list-disc pl-5 mb-4">
        {activeMainSection === "Sent Invites" ? (
          sentInvites.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date Sent
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sentInvites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-gray-100">
                      {/* Company Name */}
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                        {invite.email}
                      </td>

                      {/* Date Sent */}
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {new Date(invite.created_at).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td
                        className={`border border-gray-300 px-4 py-2 text-sm font-medium capitalize ${
                          invite.status === "accepted"
                            ? "text-green-600"
                            : invite.status === "declined"
                            ? "text-red-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {invite.status}
                      </td>

                      {/* Revoke Button */}
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {invite.status === "revoked" ? (
                          <span className="text-red-500 font-semibold">
                            Revoked
                          </span>
                        ) : (
                          <button
                            onClick={() => revokeInvite(invite.id)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded-md transition"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-gray-500 text-center">
              No sent invites found.
            </p>
          )
        ) : (
          <div className="mt-4 space-y-4">
            {receivedInvites.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <tbody>
                  {receivedInvites.map((invite) => (
                    <tr key={invite.id} className="border-b">
                      {/* Company Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {invite.email}
                      </td>

                      {/* Date Received */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(invite.created_at).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {invite.status === "pending" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => acceptInvite(invite.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => declineInvite(invite.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          invite.status === "accepted"
                            ? "text-green-600"
                            : invite.status === "declined"
                            ? "text-red-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {invite.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No received invites.
              </p>
            )}
          </div>
        )}
      </ul>

      {/* Invite User Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => setShowModal(true)}
      >
        Invite User
      </button>

      {/* Modal for Creating Invite */}
      {showModal && (
        <div
          className="fixed w-[1000px] inset-0 flex items-center justify-center bg-black/70"
          onClick={() => setShowModal(false)} // Close modal on background click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3 className="text-xl font-semibold mb-4">Create Invite</h3>
            <form onSubmit={generateInvite}>
              <input
                type="text"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                placeholder="Name/Business Name"
                required
                className="w-full p-2 border rounded mb-4"
              />

              <input
                type="email"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                placeholder="Recepient Email"
                required
                className="w-full p-2 border rounded mb-4"
              />

              <select
                value={receipientType}
                onChange={(e) => setReceipientType(e.target.value)}
                required
                className="w-full p-2 border rounded mb-4"
              >
                <option value="investor">Investor</option>
              </select>

              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                placeholder="Expires At"
                required
                className="w-full p-2 border rounded mb-4"
              />

              <textarea
                placeholder="Add message"
                className="w-full p-2 border rounded mb-4 resize-none placeholder:italic"
                rows={4}
                cols={50}
              ></textarea>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Send Invite
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invites;
