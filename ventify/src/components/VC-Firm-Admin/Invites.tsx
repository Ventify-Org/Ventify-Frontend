import { useEffect, useState } from "react";

const Invites = () => {
  interface Invite {
    email: string;
    status: string;
  }

  const [invites, setInvites] = useState<Invite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");

  // Fetch list of invites
  useEffect(() => {
    const getListofInvites = async () => {
      try {
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/users/invitations/all/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setInvites(data); // Assuming data is an array of invites
        } else {
          console.error("Failed to fetch invites:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching invites:", error);
      }
    };

    getListofInvites();
  }, []);

  // Generate new invite
  const generateInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/users/invitations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({ email: newInviteEmail }), // Assuming the backend expects an email
        }
      );

      if (response.ok) {
        const data: Invite = await response.json();
        console.log(data);
        setNewInviteEmail(""); // Clear input
        setShowModal(false); // Close modal
        setInvites((prev) => [...prev, data]); // Update invite list
      } else {
        console.error("Failed to generate invite:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating invite:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invites</h2>
      <ul className="list-disc pl-5 mb-4">
        {invites.length > 0 ? (
          invites.map((invite, index) => (
            <li key={index} className="mb-2">
              {invite.email} - {invite.status}
            </li>
          ))
        ) : (
          <p>No invites found.</p>
        )}
      </ul>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => setShowModal(true)}
      >
        Invite User
      </button>

      {/* Modal for creating invite */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create Invite</h3>
            <form onSubmit={generateInvite}>
              <input
                type="email"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                placeholder="User's Email"
                required
                className="w-full p-2 border rounded mb-4"
              />
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
