import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedCollections from '../components/FeaturedCollections';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import usePageMeta from '../hooks/usePageMeta';

export default function HomePage() {
  usePageMeta(null, 'Discover exquisite handcrafted fine jewelry by MJ. Timeless elegance, exceptional craftsmanship.');

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
