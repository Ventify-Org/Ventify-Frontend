import { useParams, Link } from "react-router-dom";

const Signin = () => {
  const { type } = useParams();

  const titles = {
    "vc-firm": "VC Firm",
    "private-investor": "Private Investor",
    business: "Business",
  };

  return (
    <section className="flex justify-center items-center">
      <div className="bg-[#00378B] flex flex-col justify-center items-center text-white w-1/2 h-screen px-16">
        <div className="mt-[25%] flex flex-col justify-center items-center">
          <p className="text-4xl font-bold">SIGN IN AS A</p>
          <p className="text-4xl font-bold">
            {titles[type as keyof typeof titles] || "Sign up"}
          </p>

          <p className="text-lg my-6 text-center">
            A simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting,{" "}
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
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="eg. hello@gmail.com"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="surname"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="surname"
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
  );
};

export default Signin;
