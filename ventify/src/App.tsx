import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Services from "./components/Services";

const App = () => {
  return (
    <div>
      <Header />
      <Intro />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
