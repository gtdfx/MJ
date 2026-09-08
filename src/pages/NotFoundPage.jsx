import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Diamond, Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-cream pt-28 md:pt-32 pb-20 md:pb-28 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Diamond size={40} className="text-gold mx-auto mb-6" />
          <p className="text-gold text-xs tracking-[6px] uppercase mb-4">Error 404</p>
          <h1 className="font-playfair text-6xl md:text-8xl text-charcoal mb-4">Lost?</h1>
          <p className="text-medium-gray font-light text-base md:text-lg mb-10 leading-relaxed">
            The page you're looking for has been misplaced — perhaps it's hiding among our
            treasures. Let us guide you back to something beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-luxury flex items-center justify-center gap-2">
              <Home size={16} />
              Back to Home
            </Link>
            <Link to="/shop" className="btn-outline-luxury flex items-center justify-center gap-2 border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white">
              <ShoppingBag size={16} />
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}