
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Facilities from "../components/Facilities";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Facilities />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
