import { useParams } from "react-router-dom";
import Header from "./Header";
import vcFirmImage from "/vc-firm.png";
import privateInvestorImage from "/private-investor.png";
import businessImage from "/business.png";

const Signup = () => {
  const { type } = useParams();
  const titles = {
    "vc-firm": "VC FIRM",
    "private-investor": "PRIVATE INVESTOR",
    business: "BUSINESS",
  };

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
        <div className="w-1/2 mt-5 flex justify-center items-center flex-col h-screen border-l-2 border-gray-200">
          <p className="text-3xl">
            SIGN UP AS A{" "}
            <span className="text-3xl">
              {titles[type as keyof typeof titles] || "Sign up"}
            </span>
          </p>

          <div className="mt-3 w-[80%]">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="">Choose an option</option>
                  <option className="hover:bg-yellow-500" value="option1">
                    VC Firm
                  </option>
                  <option value="option2">Private Investor</option>
                  <option value="option3">Business</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p>
                  Already have a account?
                  <a href={`/signin/${type}`} className="underline">
                    {" "}
                    Sign In
                  </a>
                </p>
                <button
                  type="submit"
                  className="w-1/2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
