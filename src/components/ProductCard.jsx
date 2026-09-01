import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="product-card group flex flex-col sm:flex-row bg-white overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-ivory sm:w-80 md:w-96 aspect-[3/4] sm:aspect-auto sm:min-h-[320px] shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 badge-gold">
            {product.badge}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-400 flex items-end md:items-center justify-center pb-4 md:pb-0">
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => onViewDetails(product)}
              className="bg-white p-2.5 md:p-3 rounded-full hover:bg-gold hover:text-white transition-all duration-300 shadow-lg md:shadow-none"
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => addToCart(product)}
              className="bg-white p-2.5 md:p-3 rounded-full hover:bg-gold hover:text-white transition-all duration-300 shadow-lg md:shadow-none"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
            </button>
            <button className="bg-white p-2.5 md:p-3 rounded-full hover:bg-gold hover:text-white transition-all duration-300 shadow-lg md:shadow-none hidden sm:flex">
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <p className="text-gold text-[10px] md:text-xs tracking-[2px] uppercase mb-2 md:mb-3">
          {product.collection}
        </p>
        <h3 className="font-playfair text-xl md:text-2xl lg:text-3xl text-charcoal mb-2 md:mb-3 group-hover:text-gold transition-colors duration-300 leading-tight">
          {product.name}
        </h3>
        <p className="text-medium-gray text-sm md:text-base font-light mb-4 md:mb-6 leading-relaxed max-w-md">
          {product.description}
        </p>
        <div className="flex items-center gap-4 md:gap-6">
          <p className="font-cormorant text-2xl md:text-3xl text-charcoal">
            ${product.price.toLocaleString()}
          </p>
          <span className="text-medium-gray text-xs tracking-wider uppercase">
            {product.material}
          </span>
        </div>
        <div className="mt-4 md:mt-6">
          <button
            onClick={() => onViewDetails(product)}
            className="btn-outline-luxury text-xs py-3 px-6"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
