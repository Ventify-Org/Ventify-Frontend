import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { FormEvent, useState } from "react";

const Signin = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  console.log("Type from URL Params: ", type);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const titles = {
    "vc-firm": { title: "VC FIRM", accountType: "vcfirm" },
    "private-investor": { title: "PRIVATE INVESTOR", accountType: "investor" },
    business: { title: "BUSINESS", accountType: "portfolio" },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    setLoading(true);

    try {
      const response = await fetch(
        "https://ventify-backend.onrender.com/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);
      const account_type = data.data.user.account_type;
      console.log(account_type);

      if (response.ok) {
        const refreshToken = data.data.refresh_token;
        const accessToken = data.data.access_token;

        if (refreshToken && accessToken) {
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("authToken", accessToken);
        } else {
          console.error("Tokens are missing in the response.");
          alert("Failed to retrieve tokens. Please try again.");
          setLoading(false);
          return;
        }

        if (type === "vc-firm") {
          navigate("/dashboard/vc-firm/admin");
        } else if (type === "private-investor") {
          navigate("/dashboard/private-investor/admin");
        } else if (type === "business") {
          navigate("/dashboard/business/admin");
        } else {
          // If none of the types match, fallback to a default page
          console.warn("Unknown type, redirecting to default page.");
          navigate("/signin");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <section className="flex flex-grow justify-center items-center pt-20">
          <div className="bg-[#00378B] flex flex-col justify-center items-center text-white w-1/2 min-h-full px-16">
            <div className="flex flex-col justify-center items-center pt-15">
              <p className="text-4xl font-bold">SIGN IN AS A</p>
              <p className="text-4xl font-bold">
                {titles[type as keyof typeof titles]?.title || "Sign In"}
              </p>

              <p className="text-lg my-6 text-center">
                Welcome back! Please sign in to continue managing your account.
              </p>
            </div>

            <p className="mt-auto pb-10">
              Don't have an account?
              <Link
                className="text-yellow-500 hover:underline"
                to={`/signup/${type}/`}
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="w-1/2 flex flex-col items-center">
            <p className="text-center text-4xl my-8">Sign In</p>
            <div className="w-[70%] mx-auto text-lg">
              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="eg. hello@gmail.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-yellow-400 text-black rounded-md py-2 px-4 w-full hover:bg-yellow-600 focus:outline-none focus:shadow-outline"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
            <p className="text-left w-[70%] mt-16">
              <Link className="text-gray-500 underline" to="/forgot-password">
                Forgot password?
              </Link>
            </p>
          </div>
        </section>

        {/* Footer always at bottom */}
        <footer className="bg-[#00B38F] flex justify-end text-white py-4 pr-10 gap-3">
          <FaFacebook size={20} />
          <FaLinkedin size={20} />
          <FaTwitter size={20} />
        </footer>
      </div>

      {loading && ( // Loading overlay
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </>
  );
};

export default Signin;
