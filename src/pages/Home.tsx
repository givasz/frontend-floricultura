import HeroSection from '../components/HeroSection';
import BenefitsBar from '../components/BenefitsBar';
import AboutSection from '../components/AboutSection';
import ProductsSection from '../components/ProductsSection';
import CategoriesSection from '../components/CategoriesSection';
import DifferentialsSection from '../components/DifferentialsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsBar />
      <AboutSection />
      <ProductsSection />
      <CategoriesSection />
      <DifferentialsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
