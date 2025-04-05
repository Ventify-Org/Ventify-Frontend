import { useEffect, useState } from "react";

type PipelineData = {
  id: number;
  company: string;
  country: string;
  fund_request: string;
  share: string;
  valuation: string;
};

const refreshAccessToken = async (): Promise<string> => {
  const refresh_token = localStorage.getItem("refreshToken");
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
  localStorage.setItem("authToken", newAccessToken);
  return newAccessToken;
};

const Pipeline = () => {
  const [data, setData] = useState<PipelineData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await refreshAccessToken();
        const response = await fetch(
          "https://ventify-backend.onrender.com/api/pipeline/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }

        const result: PipelineData[] = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
        } else {
          console.error("An unknown error occurred");
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border">S/N</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Fund Request</th>
                <th className="px-4 py-2 border">Share</th>
                <th className="px-4 py-2 border">Valuation</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 border"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border">{item.company}</td>
                    <td className="px-4 py-2 border">{item.country}</td>
                    <td className="px-4 py-2 border">{item.fund_request}</td>
                    <td className="px-4 py-2 border">{item.share}</td>
                    <td className="px-4 py-2 border">{item.valuation}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
