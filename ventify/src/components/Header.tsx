import { Link } from "react-router-dom";

const Header = () => {
  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" alt="logo" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-18">
            {["Home", "About us", "Services", "Contact us"].map((item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase()}`}
                className="text-black transition duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(item.toLowerCase());
                }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
