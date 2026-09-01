import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-ivory relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-3 md:mb-4">
            Stay Connected
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4 md:mb-6">
            Join Our Inner Circle
          </h2>
          <p className="text-medium-gray font-light max-w-xl mx-auto mb-8 md:mb-10 text-sm md:text-base">
            Be the first to discover new collections, exclusive offers, and
            insider access to the world of MJ.
          </p>

          {/* Email Form */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="luxury-input flex-1 min-w-0"
            />
            <button className="btn-luxury flex items-center justify-center gap-2 shrink-0">
              <span>Subscribe</span>
              <Send size={16} />
            </button>
          </div>

          <p className="text-medium-gray/60 text-xs mt-4">
            By subscribing, you agree to receive our newsletter. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
