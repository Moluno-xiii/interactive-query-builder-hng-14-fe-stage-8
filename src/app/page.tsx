import LandingPageHeader from "@/components/landing-page/LandingPageHeader";
import Features from "@/components/landing-page/Features";
import HowItWorks from "@/components/landing-page/HowItWorks";
import CTASection from "@/components/landing-page/CTASection";
import Footer from "@/components/landing-page/Footer";
import HeroSection from "@/components/landing-page/HeroSection";

const LandingPage = () => {
  return (
    <div className="qf-scroll min-h-screen bg-background text-foreground">
      <LandingPageHeader />
      <HeroSection />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
