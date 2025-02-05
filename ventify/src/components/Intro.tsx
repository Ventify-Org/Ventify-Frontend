import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-black/80">
      <div className="relative h-[600px] w-full bg-[url('./assets/office-room.png')] bg-cover bg-center bg-no-repeat flex justify-center items-center">
        <div className="text-white h-[600px] px-8 gap-5 w-[70%] flex flex-row items-center justify-between">
          <div className="w-2/3 h-full flex flex-col items-center justify-center">
            <p className="text-6xl font-bold">
              Streamline, Scale, and Succeed with Smarter Portfolio Management.
            </p>
            <p className="text-lg font-roboto py-2">
              Ventify simplifies portfolio management for VC firms, giving you
              the tools to track, analyze, and grow your investments seamlessly.
              Join today and experience smarter decision-making for your
              portfolio's future.
            </p>
          </div>
          <div className="w-[1/3] gap-8 items-center p-12 flex flex-col h-full justify-center">
            <button
              className="bg-[#FFD700]/40 px-2 py-2 border-0 rounded-md min-w-[220px]"
              onClick={() => navigate("/signin/vc-firm")}
            >
              Sign up as a VC firm
            </button>
            <button
              className="bg-[#FFD700]/40 px-2 py-2 border-0 rounded-md min-w-[220px]"
              onClick={() => navigate("/signin/private-investor")}
            >
              Sign up as a Private Investor
            </button>
            <button
              className="bg-[#FFD700]/40 px-2 py-2 border-0 rounded-md min-w-[220px]"
              onClick={() => navigate("/signin/business")}
            >
              Sign up as a Business
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
