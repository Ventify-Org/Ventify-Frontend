import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Invite {
  id: string;
  status: string;
  company_name?: string;
  sender_name?: string;
}

interface InvitesResponse {
  received_invites?: {
    data?: Invite[];
  };
}
const DashboardMenu = () => {
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [acceptedInvites, setAcceptedInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const companies = ["Company A", "Company B"];
  const details = [
    "Report",
    "Revenue",
    "Traction",
    "Raised",
    "Update",
    "KPI",
    "ROI",
    "Message",
  ];

  const refreshAccessToken = useCallback(async () => {
    const refresh_token = sessionStorage.getItem("refreshToken");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

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
    sessionStorage.setItem("authToken", data.access);
    return data.access;
  }, []);

  const fetchAcceptedInvites = useCallback(async () => {
    try {
      setLoading(true);
      const token = await refreshAccessToken();
      const response = await fetch(
        "https://ventify-backend.up.railway.app/api/users/invitations/all/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: InvitesResponse = await response.json();
        console.log("Fetched invites data:", data.received_invites?.data);
        const accepted: Invite[] =
          data.received_invites?.data?.filter(
            (invite) => invite.status === "accepted"
          ) || [];

        setAcceptedInvites(accepted);
        setLoading(false);
      } else {
        console.error("Failed to fetch invites:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  }, [refreshAccessToken]);

  interface DemoItem {
    id: string;
    name: string;
    isDemo: boolean;
  }

  interface ApiItem {
    id: string;
    name: string;
    isDemo: boolean;
    invite: Invite;
  }

  type DropdownItem = DemoItem | ApiItem;

  const handleSelectCompany = (item: DropdownItem | string) => {
    if (item === "Switch to Portfolio View") {
      navigate("/dashboard/private-investor/pc");
    } else if (typeof item !== "string") {
      console.log("Selected company:", item);
      navigate("/dashboard/private-investor/pc");
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);

      // Fetch data when dropdown opens
      fetchAcceptedInvites();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, fetchAcceptedInvites]);

  const allItems = [
    { id: "demo", name: "Switch to Portfolio View", isDemo: true },
    ...acceptedInvites.map((invite) => ({
      id: invite.id,
      name: invite.company_name || invite.sender_name || "Unknown Company",
      isDemo: false,
      invite: invite,
    })),
  ];

  return (
    <div className="relative flex flex-col px-10 py-4 min-h-screen">
      {/* Switch button - just below navbar */}
      <div className="mt-4 mb-6">
        <button
          className="px-5 py-[5px] bg-transparent text-black border rounded hover:bg-[#0049b3] flex items-center gap-2"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          Switch
          <span
            className={`transform transition-transform duration-200 ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          >
            <FaArrowDown />
          </span>
        </button>
      </div>

      {/* Centered Dropdown */}
      {showDropdown && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
          <div
            ref={dropdownRef}
            className="bg-white border border-gray-300 shadow-xl p-5 rounded-lg w-72 z-50"
          >
            <h3 className="font-semibold mb-3 text-lg text-[#00378B]">
              Select a Company
            </h3>

            <ul className="space-y-2">
              {/* First display demo entry */}

              <ul className="space-y-2">
                {loading ? (
                  <li className="px-3 py-2 text-gray-500">Loading...</li>
                ) : (
                  allItems.map((item) => (
                    <li
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded transition flex items-center"
                      onClick={() => handleSelectCompany(item)}
                    >
                      <span className="flex-grow">{item.name}</span>
                      {item.isDemo && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Demo
                        </span>
                      )}
                    </li>
                  ))
                )}

                {!loading &&
                  acceptedInvites.length === 0 &&
                  allItems.length === 0 && (
                    <li className="px-3 py-2 text-gray-500">
                      No accepted invitations found
                    </li>
                  )}
              </ul>
            </ul>
          </div>
        </div>
      )}

      {/* Main content */}
      {selectedDetail ? (
        <div>
          <p>{selectedDetail}.</p>
          <div className="my-5 text-sm">
            <p>Revenue</p>
            <p>Expenses</p>
            <p>Traction</p>
            <p>Dilution</p>
            <p>Update: Staff Costs, New Consumer</p>
            <p>Additional details</p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-[#00378B] text-white rounded"
            onClick={() => setSelectedDetail(null)}
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {companies.map((company) => (
            <div key={company} className="flex flex-col">
              <p className="mb-1 font-semibold pr-6">{company}</p>
              <div className="flex gap-8 pr-5 items-center py-2">
                <div className="bg-red-500 w-30 h-20 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-x-10 gap-y-3 items-center">
                  {details.map((detail) => (
                    <button
                      key={detail}
                      className="border-[1.5px] w-25 py-1 rounded-md cursor-pointer"
                      onClick={() =>
                        setSelectedDetail(`${detail} for ${company}`)
                      }
                    >
                      {detail}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;
