import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedCollections from '../components/FeaturedCollections';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import usePageMeta from '../hooks/usePageMeta';

export default function HomePage() {
  usePageMeta(null, 'Hand-selected Ethiopian Welo opals — rough, crystal, and polished. Sold by gram and carat with certified origin.');

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
