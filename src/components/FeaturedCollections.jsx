import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Diamond } from 'lucide-react';
import { useAdmin } from '../admin/AdminContext';

const FeaturedCollections = () => {
  const { products, collections } = useAdmin();
  // Live collections: prefer context; fall back to deriving from active products
  const visibleCollections = (collections && collections.length > 0)
    ? collections
    : [...new Set(products.filter(p => p.active !== false).map(p => p.type))].map((type, i) => {
        const sample = products.find(p => p.type === type);
        return { id: `t-${i}`, name: type, description: sample?.description?.slice(0, 60) || '', image: sample?.image };
      });

  return (
    <section id="collections" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-gold text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-3 md:mb-4">
            From Our Mines
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-charcoal mb-4 md:mb-6">
            Choose Your Opal
          </h2>
          <div className="elegant-divider max-w-xs mx-auto">
            <Diamond className="text-gold w-4 h-4" />
          </div>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {visibleCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden cursor-pointer aspect-[3/4]"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                <p className="text-gold-light text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-1 md:mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  Discover
                </p>
                <h3 className="font-playfair text-lg md:text-2xl lg:text-3xl text-white mb-1 md:mb-2">
                  {collection.name}
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-light mb-2 md:mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="text-[10px] md:text-xs tracking-[2px] uppercase">View Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Border Effect */}
              <Link to="/shop" className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
