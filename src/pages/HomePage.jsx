import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedCollections from '../components/FeaturedCollections';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedCollections />
      <Testimonials />
      <Newsletter />
    </>
  );
}
