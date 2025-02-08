const Services = () => {
  return (
    <section className="py-15">
      <div className="flex flex-row gap-12 mx-8 items-center justify-center">
        <div className="w-fit p-10 text-lg">
          <p className="text-4xl text-center pb-2">Our Services</p>
          <p>
            Portfolio Management: Organize and track all your investments in one
            place.
          </p>
          <p>
            Performance Insights: Real-time analytics to drive smarter
            decisions.
          </p>
          <p>
            Custom Reporting: Share tailored reports with stakeholders
            effortlessly.
          </p>
          <p>
            Financial Tracking: Monitor key metrics and valuations with ease.
          </p>
          <p>
            Collaboration Tools: Streamline communication with portfolio
            companies.
          </p>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-center">
          <img src="/chart.png" alt="Chart" />
        </div>
      </div>
    </section>
  );
};

export default Services;
