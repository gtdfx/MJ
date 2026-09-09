import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../admin/AdminContext';
import usePageMeta from '../hooks/usePageMeta';

export default function ShopPage() {
  usePageMeta('Shop', 'Shop Ethiopian Welo opals — rough opal by the gram, crystal and polished opal by the carat. Certified origin.');

  const { products } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  // Keep the URL in sync so footer/deep links and in-page filters share one state
  const setActiveCategory = useCallback(
    (category) => {
      setSearchParams(category === 'All' ? {} : { category }, { replace: true });
    },
    [setSearchParams]
  );

  // Live categories — new admin-added product types appear automatically
  const categories = ['All', ...new Set(products.map(p => p.type).filter(Boolean))];
  const visibleProducts = products.filter(p => p.active !== false);

  const filteredProducts = activeCategory === 'All'
    ? visibleProducts
    : visibleProducts.filter(p => p.type === activeCategory);

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <p className="text-gold text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-3 md:mb-4">
            Hand-Selected from Welo, Ethiopia
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4 md:mb-6">
            Ethiopian Opals
          </h1>
          <div className="elegant-divider max-w-xs mx-auto">
            <Diamond className="text-gold w-4 h-4" />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block bg-white overflow-hidden hover:shadow-xl transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'opacity-60 grayscale' : ''}`}
                    loading="lazy"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white text-xs tracking-[2px] uppercase font-medium bg-charcoal/90 px-4 py-2">Out of Stock</span>
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-3 left-3 badge-gold">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-white text-xs tracking-[2px] uppercase font-medium">
                      View Details →
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-center">
                  <p className="text-gold text-[10px] md:text-xs tracking-[2px] uppercase mb-2">
                    {product.type}
                  </p>
                  <h3 className="font-playfair text-base md:text-lg text-charcoal mb-1 group-hover:text-gold transition-colors duration-300 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-medium-gray text-xs font-light mb-3">
                    {product.grade || product.origin}
                  </p>
                  <p className="font-cormorant text-xl text-charcoal">
                    ${product.pricePerUnit} <span className="text-sm text-medium-gray">/ {product.soldBy}</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
