import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Truck, Shield, Gift, Star } from 'lucide-react';
import { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../admin/AdminContext';
import ReviewSection from '../components/ReviewSection';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getReviewStats } = useAdmin();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-3xl text-charcoal mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-luxury inline-block">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
    .slice(0, 3);

  const sizes = ['XS', 'S', 'M', 'L', 'One Size'];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="pt-24 md:pt-28 bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center gap-2 text-sm text-medium-gray">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden bg-ivory">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <div className="absolute top-4 left-4 badge-gold">
                {product.badge}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="text-gold text-xs tracking-[3px] uppercase mb-3">
              {product.collection} Collection
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {(() => {
              const reviewStats = getReviewStats(product.id);
              return (
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      className={i <= Math.round(reviewStats.avg) ? 'text-gold fill-gold' : 'text-light-gray'}
                    />
                  ))}
                  <span className="text-medium-gray text-sm ml-2">
                    ({reviewStats.avg > 0 ? reviewStats.avg : '0.0'} · {reviewStats.count} {reviewStats.count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              );
            })()}

            <p className="font-cormorant text-3xl md:text-4xl text-charcoal mb-6">
              ${product.price.toLocaleString()}
            </p>

            <div className="w-16 h-[1px] bg-gold mb-6" />

            <p className="text-medium-gray font-light leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white border border-light-gray">
                <p className="text-[10px] text-medium-gray uppercase tracking-wider mb-1">Material</p>
                <p className="font-cormorant text-lg text-charcoal">{product.material}</p>
              </div>
              <div className="p-4 bg-white border border-light-gray">
                <p className="text-[10px] text-medium-gray uppercase tracking-wider mb-1">Stone</p>
                <p className="font-cormorant text-lg text-charcoal">{product.stone}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[2px] text-charcoal mb-3">Size</p>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs tracking-wider border transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-gold text-white border-gold'
                        : 'bg-white text-charcoal border-light-gray hover:border-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8">
              <p className="text-xs uppercase tracking-[2px] text-charcoal">Quantity</p>
              <div className="flex items-center border border-light-gray">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-cream transition-colors text-lg"
                >
                  −
                </button>
                <span className="px-5 py-3 font-cormorant text-xl border-x border-light-gray">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-cream transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="btn-luxury flex-1">
                Add to Cart
              </button>
              <button className="p-4 border border-light-gray hover:border-gold hover:text-gold transition-all duration-300">
                <Heart size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-light-gray">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: Shield, text: 'Lifetime Warranty' },
                { icon: Gift, text: 'Gift Packaging' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center gap-2">
                  <Icon size={18} className="text-gold" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-medium-gray">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24 pt-12 border-t border-light-gray">
            <h2 className="font-playfair text-2xl md:text-3xl text-charcoal text-center mb-10">
              You May Also Love
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map(rp => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group bg-white overflow-hidden hover:shadow-lg transition-shadow duration-500"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-gold text-[10px] tracking-[2px] uppercase mb-1">{rp.collection}</p>
                    <h3 className="font-playfair text-sm text-charcoal group-hover:text-gold transition-colors">{rp.name}</h3>
                    <p className="font-cormorant text-lg text-charcoal mt-1">${rp.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
