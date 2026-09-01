import { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from './ProductCard';

const ProductGrid = ({ onViewDetails }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="py-16 md:py-24 lg:py-32 bg-cream">
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
            Exquisite Craftsmanship
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-charcoal mb-4 md:mb-6">
            The Collection
          </h2>
          <div className="elegant-divider max-w-xs mx-auto">
            <Diamond className="text-gold w-4 h-4" />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm tracking-[1px] uppercase transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gold text-white'
                  : 'bg-white text-charcoal hover:bg-gold/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-16"
        >
          <a href="#" className="btn-outline-luxury inline-block">
            View All Jewelry
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;
