import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    clearCart 
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-light-gray flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-playfair text-xl">Your Cart</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-cream rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-light-gray mb-4" />
                  <p className="font-playfair text-xl text-charcoal mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-medium-gray text-sm font-light mb-6">
                    Discover our exquisite collection
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-luxury"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-24 h-28 bg-ivory overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-gold tracking-wider uppercase">
                              {item.collection}
                            </p>
                            <h3 className="font-playfair text-sm text-charcoal">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-medium-gray hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-light-gray">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-cream transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-cream transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-cormorant text-lg">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-light-gray bg-cream/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm uppercase tracking-wider text-medium-gray">
                    Subtotal
                  </span>
                  <span className="font-cormorant text-2xl">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-medium-gray mb-4 font-light">
                  Shipping calculated at checkout
                </p>
                <Link to="/checkout" onClick={() => setIsOpen(false)} className="btn-luxury w-full mb-3 block text-center">
                  Proceed to Checkout
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-medium-gray hover:text-charcoal transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
