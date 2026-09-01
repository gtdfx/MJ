import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Victoria Sterling",
    title: "Collector",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "The craftsmanship of MJ pieces is unparalleled. Each jewel tells a story of dedication and artistry that transcends generations.",
    rating: 5
  },
  {
    id: 2,
    name: "Alexander Chen",
    title: "Art Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "My wife's anniversary ring from MJ took our breath away. The attention to detail is simply extraordinary.",
    rating: 5
  },
  {
    id: 3,
    name: "Isabella Romano",
    title: "Fashion Editor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote: "Working with MJ's private concierge service was a truly luxurious experience. They understood my vision perfectly.",
    rating: 5
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <p className="text-gold text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-3 md:mb-4">
            Client Stories
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-charcoal">
            Cherished by Connoisseurs
          </h2>
        </motion.div>

        {/* Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Quote Icon */}
              <Quote size={36} className="text-gold/20 mx-auto mb-6 md:mb-8" />

              {/* Quote Text */}
              <p className="font-playfair text-xl md:text-2xl lg:text-3xl text-charcoal leading-relaxed mb-8 md:mb-10 italic px-2">
                "{testimonials[current].quote}"
              </p>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-4 md:mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gold"
                />
                <div className="text-left">
                  <p className="font-playfair text-base md:text-lg text-charcoal">
                    {testimonials[current].name}
                  </p>
                  <p className="text-gold text-xs md:text-sm tracking-wider">
                    {testimonials[current].title}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-3 md:gap-4 mt-8 md:mt-12">
            <button
              onClick={prev}
              className="p-3 border border-light-gray hover:border-gold hover:text-gold transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-gold w-8' : 'bg-light-gray w-2'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 border border-light-gray hover:border-gold hover:text-gold transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
