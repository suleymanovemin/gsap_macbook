import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import ProductsViewer from "./components/ProductsViewer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ShowCase from "./components/ShowCase";
import Performance from "./components/Performance";
import Features from "./components/Features";
import HighLights from "./components/HighLights";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);
const App = () => {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProductsViewer />
      <ShowCase />
      <Performance />
      <Features />
      <HighLights />
      <Footer />
    </main>
  );
};

export default App;
