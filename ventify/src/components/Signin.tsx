import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

const Signin = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const titles = {
    "vc-firm": "VC Firm",
    "private-investor": "Private Investor",
    business: "Business",
  };

  const submitForm = () => {
    //console.log("Sign in successful");
    navigate("/homepage", { replace: true });
  };

  return (
    <>
      <Header />
      {/* Full-page layout with flexbox */}
      <div className="flex flex-col h-screen">
        {/* Main content section */}
        <section className="flex flex-grow justify-center items-center pt-20">
          <div className="bg-[#00378B] flex flex-col justify-center items-center text-white w-1/2 min-h-full px-16">
            <div className="flex flex-col justify-center items-center pt-15">
              <p className="text-4xl font-bold">SIGN IN AS A</p>
              <p className="text-4xl font-bold">
                {titles[type as keyof typeof titles] || "Sign up"}
              </p>

              <p className="text-lg my-6 text-center">
                A simple dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting.
              </p>
            </div>

            <p className="mt-auto pb-10">
              Don't have an account?{" "}
              <Link className="text-yellow-500" to="/signup">
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
    </>
  );
};

export default Signin;
