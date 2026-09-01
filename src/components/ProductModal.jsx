import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Heart, Truck, Shield, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const features = [
    { icon: Truck, text: "Free Express Shipping" },
    { icon: Shield, text: "Lifetime Warranty" },
    { icon: Gift, text: "Luxury Gift Packaging" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full hover:bg-gold hover:text-white transition-all duration-300"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto bg-ivory">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-6 left-6 badge-gold">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-gold text-xs tracking-[3px] uppercase mb-3">
                  {product.collection} Collection
                </p>
                <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">
                  {product.name}
                </h2>
                <p className="font-cormorant text-3xl text-charcoal mb-6">
                  ${product.price.toLocaleString()}
                </p>

                <div className="w-12 h-[1px] bg-gold mb-6" />

                <p className="text-medium-gray font-light leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-cream">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-1">Material</p>
                    <p className="font-cormorant text-lg text-charcoal">{product.material}</p>
                  </div>
                  <div className="p-4 bg-cream">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-1">Stone</p>
                    <p className="font-cormorant text-lg text-charcoal">{product.stone}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-6 mb-8">
                  <p className="text-sm uppercase tracking-wider text-charcoal">Quantity</p>
                  <div className="flex items-center border border-light-gray">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-cream transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 font-cormorant text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-cream transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="btn-luxury flex-1"
                  >
                    Add to Cart
                  </button>
                  <button className="p-4 border border-light-gray hover:border-gold hover:text-gold transition-all duration-300">
                    <Heart size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-medium-gray">
                      <feature.icon size={18} className="text-gold" />
                      <span className="text-sm font-light">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
