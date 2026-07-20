import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Solutions } from "../components/Solutions";
import { AppShowcase } from "../components/AppShowcase";
import { Technology } from "../components/Technology";
import { AboutUs } from "../components/AboutUs";
import { ArticlesSection } from "../components/ArticlesSection";
import { GallerySection } from "../components/GallerySection";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";
import { Header } from "../components/Header";
import { fetchWebsiteContent, WebsiteContent, DEFAULT_WEBSITE_CONTENT } from "../lib/websiteService";

export function LandingPage() {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await fetchWebsiteContent();
        setContent(data);
      } catch (error) {
        // Ignore error and leave content as DEFAULT_WEBSITE_CONTENT
        console.warn("Using default content due to fetch error:", error);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="relative">
      <ScrollProgress />
      <Header />
      <main>
        <Hero content={content.hero} />
        <FeaturedProducts items={content.products} />
        <Solutions />
        <AppShowcase />
        <Technology />
        <AboutUs content={content.about} />
        <ArticlesSection articles={content.articles || []} />
        <GallerySection gallery={content.gallery || []} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

