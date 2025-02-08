const About = () => {
  return (
    <section className="p-15">
      <div className="flex flex-row gap-12 mx-8 items-center justify-center">
        <div className="w-1/3 flex flex-col items-center justify-center">
          <img src="/group63.png" />
        </div>

        <div className="w-2/3">
          <p className="text-4xl text-center pb-2">About Ventify</p>
          <p>
            At Ventify, we’re transforming the way VC firms manage their
            portfolio companies. Our platform is designed to simplify complex
            workflows, provide actionable insights, and empower better
            decision-making.
          </p>
          <p>
            We believe in enabling venture capitalists to focus on what matters
            most: growing successful companies. From real-time performance
            tracking to seamless collaboration and reporting tools, Ventify
            provides everything you need to stay ahead in a fast-paced industry.
            Join us in redefining portfolio management and take your investments
            to the next level.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
