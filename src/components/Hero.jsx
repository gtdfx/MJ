import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80&fit=crop",
      title: "Timeless",
      subtitle: "Elegance",
      tagline: "Where artistry meets eternity"
    },
    {
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80&fit=crop",
      title: "Radiant",
      subtitle: "Brilliance",
      tagline: "Crafted for the extraordinary"
    },
    {
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80&fit=crop",
      title: "Eternal",
      subtitle: "Luxury",
      tagline: "Your story, our creation"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>
      ))}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rotate-45" />
        <div className="absolute bottom-32 right-20 w-24 h-24 border border-white/5 rotate-12" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center pt-28 md:pt-36">
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 w-full">
          <div className="max-w-3xl">
            {/* Tagline */}
            <motion.p
              key={`tagline-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold-light text-xs md:text-sm tracking-[4px] md:tracking-[5px] uppercase mb-4 md:mb-6"
            >
              {slides[currentSlide].tagline}
            </motion.p>

            {/* Main Title */}
            <div className="overflow-hidden mb-2 md:mb-4">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
    className="font-playfair text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] text-white font-light leading-[0.85]"
              >
                {slides[currentSlide].title}
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-6 md:mb-8">
              <motion.h1
                key={`subtitle-${currentSlide}`}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
className="font-playfair text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] text-gold font-light italic leading-[0.85]"
              >
                {slides[currentSlide].subtitle}
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-white/70 text-base md:text-xl font-light max-w-lg mb-8 md:mb-12 leading-relaxed"
            >
              Discover our exquisite collection of handcrafted fine jewelry,
              where each piece tells a story of unparalleled craftsmanship.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/shop"
                className="btn-luxury text-center block sm:inline-block"
              >
                Explore Collection
              </Link>
              <Link to="/about" className="btn-outline-luxury border-white/40 text-white hover:bg-white hover:text-charcoal flex items-center justify-center gap-3">
                <Play size={16} fill="currentColor" />
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-[2px] transition-all duration-500 ${
                index === currentSlide ? 'w-12 bg-gold' : 'w-6 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 md:bottom-12 right-6 md:right-12 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-white/50 text-[10px] tracking-[3px] uppercase rotate-90 origin-center translate-y-8 whitespace-nowrap">
            Scroll
          </span>
          <ArrowDown size={20} className="text-gold" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
