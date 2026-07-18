import { Hero } from "../components/Hero";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Solutions } from "../components/Solutions";
import { Technology } from "../components/Technology";
import { AboutUs } from "../components/AboutUs";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";
import { Header } from "../components/Header";

export function LandingPage() {
  return (
    <div className="relative">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Solutions />
        <Technology />
        <AboutUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
