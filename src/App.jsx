import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import ProductsViewer from "./components/ProductsViewer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
const App = () => {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProductsViewer />
    </main>
  );
};

export default App;
