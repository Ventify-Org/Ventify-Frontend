import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import vcFirmImage from "/vc-firm.png";
import privateInvestorImage from "/private-investor.png";
import businessImage from "/business.png";
import { useEffect, useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    account_type: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { type } = useParams();
  const titles = {
    "vc-firm": "VC FIRM",
    "private-investor": "PRIVATE INVESTOR",
    business: "BUSINESS",
  };

  const accountType = titles[type as keyof typeof titles] || "";

  // Update the formData when the component mounts
  useEffect(() => {
    // Create a mapping for account types to match backend expectations
    const accountTypeMap: Record<string, string> = {
      "vc-firm": "vcfirm",
      "private-investor": "investor",
      business: "portfolio",
    };

    // Get the mapped value or default to lowercase
    const mappedAccountType =
      accountTypeMap[type as keyof typeof accountTypeMap] ||
      accountType.toLowerCase();

    setFormData((prev) => ({
      ...prev,
      account_type: mappedAccountType,
    }));
  }, [accountType, type]);

  const getImage = () => {
    switch (type) {
      case "vc-firm":
        return vcFirmImage;
      case "private-investor":
        return privateInvestorImage;
      case "business":
        return businessImage;
      default:
        return "";
    }
  };

  const getOverlayContent = () => {
    switch (type) {
      case "vc-firm":
        return (
          <div>
            <p className="text-2xl mb-5">
              Streamline Your Investments with Ease
            </p>
            <p className="mb-4">
              Manage your portfolio companies and investor interactions
              seamlessly in one powerful platform. Stay on top of updates, track
              performance, and engage with investors effortlessly—all from a
              single dashboard.
            </p>
            <p>
              Sign up today and take control of your venture capital operations
              with smarter, faster, and more efficient management.
            </p>
          </div>
        );
      case "private-investor":
        return (
          <div>
            <p className="text-2xl mb-5">
              Simplify Your Investments, Maximize Your Returns
            </p>
            <p className="mb-4">
              Manage your private investments and portfolio interactions
              effortlessly. Track performance, stay informed, and engage with
              companies—all from one smart and intuitive platform.
            </p>
            <p>
              Sign up today and take control of your investment journey with
              confidence!
            </p>
          </div>
        );
      case "business":
        return (
          <div>
            <p className="text-2xl mb-5">
              Effortless Investment & Portfolio Management
            </p>
            <p className="mb-4">
              Take control of your business investments and portfolio company
              interactions with ease. Track performance, streamline
              communication, and make data-driven decisions—all from one
              intuitive platform.
            </p>
            <p>
              Sign up today to simplify how you manage and grow your
              investments!
            </p>
          </div>
        );
      default:
        return "";
    }
  };

  // Automatic login function after successful signup
  const autoLogin = async (email: string, password: string) => {
    const loginUrl = "https://ventify-backend.up.railway.app/api/auth/login/";
    try {
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        console.error("Auto-login failed:", loginData);
        // Still navigate to dashboard since signup was successful
        navigate(`/dashboard/${type}/admin`);
        return;
      }

      // Save tokens from login response
      if (loginData.access && loginData.refresh) {
        sessionStorage.setItem("access_token", loginData.access);
        sessionStorage.setItem("refreshToken", loginData.refresh);
        console.log("Login successful, tokens updated");

        // Store user info if available
        if (loginData.user) {
          sessionStorage.setItem("user", JSON.stringify(loginData.user));
        }

        // Navigate to dashboard after successful login
        navigate(`/dashboard/${type}/admin`);
      }
    } catch (error) {
      console.error("Error during auto-login:", error);
      // Still navigate to dashboard since signup was successful
      navigate(`/dashboard/${type}/admin`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = "https://ventify-backend.up.railway.app/api/auth/signup/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    console.log("Formdata sent", formData);
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      console.log("Full Response:", responseData);

      if (!response.ok) {
        const errorMessage =
          responseData.message || "Signup failed. Please check your inputs.";

        if (errorMessage.includes("Email already exists")) {
          alert(
            "This email is already registered. Please use a different email or try logging in."
          );
        } else {
          alert(errorMessage);
        }
        setIsLoading(false);
        return;
      }

      // Save tokens if returned from signup
      if (responseData.access && responseData.refresh) {
        sessionStorage.setItem("access_token", responseData.access);
        sessionStorage.setItem("refreshToken", responseData.refresh);
        console.log("Tokens saved to sessionStorage");

        // Store user info if available
        if (responseData.user) {
          sessionStorage.setItem("user", JSON.stringify(responseData.user));
        }

        // Navigate to dashboard after signup
        navigate(`/dashboard/${type}/admin`);
      } else {
        // If tokens are not provided in signup response, perform auto-login
        console.log("No tokens in signup response, performing auto-login");
        await autoLogin(formData.email, formData.password);
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-1/2 h-screen relative" id="left-div">
          {getImage() && (
            <>
              <img
                src={getImage()}
                alt={titles[type as keyof typeof titles] || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm py-10 px-4 bg-black/50 w-3/4 text-left">
                {getOverlayContent()}
              </div>
            </>
          )}
        </div>
        <div className="w-1/2 mt-8 flex justify-center items-center flex-col h-screen border-l-2 border-gray-200">
          <p className="text-3xl">
            SIGN UP AS A{" "}
            <span className="text-3xl">
              {titles[type as keyof typeof titles] || "Sign up"}
            </span>
          </p>

          <div className="mt-3 w-[80%]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="account_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Type
                </label>
                <input
                  id="account"
                  name="account_type"
                  value={accountType}
                  disabled
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <input type="hidden" name="account_type" value={accountType} />

              <div className="flex justify-between items-center mt-3">
                <p>
                  Already have a account?{" "}
                  <Link to={`/signin/${type}/`} className="underline">
                    Sign In
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-1/2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default Signup;
