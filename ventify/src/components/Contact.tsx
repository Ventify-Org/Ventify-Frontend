const Contact = () => {
  return (
    <section className="p-15">
      <div className="flex flex-row gap-12 mx-8 items-center justify-center">
        <div className="w-1/3 flex flex-col items-center justify-center">
          <div className="border-2 w-full">
            <form className="max-w-lg mx-auto p-6 bg-white rounded-md">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="eg. John"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="surname"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="eg. Joshua"
                  required
                />
              </div>
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
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  style={{ resize: "none" }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Message"
                  required
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-black text-white rounded-md py-2 px-4 w-full hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-2/3">
          <p className="text-4xl text-center pb-2">Contact Us</p>
          <p>Have questions or want to learn more about Ventify?</p>
          <p>
            We are here to help! Whether you are looking for a demo, need
            support, or want to explore partnership opportunities, our team is
            ready to assist you.
          </p>
          <p>Address: 123 Venture Lane, Innovation City, CA 90210</p>
          <p>
            Let's connect and take your portfolio management to the next level.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
