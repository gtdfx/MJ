import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check, ChevronDown, Truck, Shield, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../admin/AdminContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder, validateCoupon, recordCouponUse, settings } = useAdmin();
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirmation
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: '', zip: '', country: 'US',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, freeShipping }
  const [couponError, setCouponError] = useState('');

  const freeThreshold = Number(settings.freeShippingThreshold) || 100;
  const discount = appliedCoupon?.discount || 0;
  const afterDiscount = Math.max(0, totalPrice - discount);
  const shippingCost = shippingMethod === 'express' ? 25 : shippingMethod === 'overnight' ? 50 : (appliedCoupon?.freeShipping || afterDiscount >= freeThreshold) ? 0 : 15;
  const tax = Math.round(afterDiscount * 0.0888 * 100) / 100;
  const grandTotal = afterDiscount + shippingCost + tax;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const result = validateCoupon(couponInput, totalPrice);
    if (result.valid) {
      setAppliedCoupon({ code: result.coupon.code, discount: result.discount, freeShipping: result.freeShipping, id: result.coupon.id });
      setCouponInput('');
    } else {
      setCouponError(result.error);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (appliedCoupon?.id) recordCouponUse(appliedCoupon.id);
    // Create the real order in the store (visible in admin dashboard + order tracking)
    const order = addOrder({
      customer: `${shipping.firstName} ${shipping.lastName}`.trim(),
      email: shipping.email,
      phone: shipping.phone,
      address: [shipping.address, shipping.apartment, `${shipping.city}, ${shipping.state} ${shipping.zip}`, shipping.country]
        .filter(Boolean).join(', '),
      items: items.map(item => ({
        productId: item.id,
        name: item.weight ? `${item.name} (${item.weight} ${item.unit === 'carat' ? 'ct' : 'g'})` : item.name,
        qty: item.quantity,
        price: item.price,
      })),
      subtotal: totalPrice,
      discount,
      couponCode: appliedCoupon?.code || null,
      shipping: shippingCost,
      tax,
      total: grandTotal,
      notes: shippingMethod !== 'standard' ? `${shippingMethod} shipping requested` : '',
    });
    setPlacedOrderId(order.id);
    setStep(3);
    setOrderPlaced(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-playfair text-3xl text-charcoal mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Add some exquisite pieces before checking out.</p>
          <Link to="/shop" className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-lg font-medium tracking-wide transition-colors">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-emerald-600" />
          </div>
          <h2 className="font-playfair text-3xl text-charcoal mb-3">Order Confirmed</h2>
          <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
          <p className="text-sm text-gray-400 mb-8">Order #{placedOrderId} · Confirmation sent to {shipping.email || 'your email'}</p>
          <div className="flex gap-3">
            <Link to="/shop" className="flex-1 bg-charcoal hover:bg-charcoal/90 text-white px-6 py-3 rounded-lg font-medium tracking-wide text-sm transition-colors text-center">
              CONTINUE SHOPPING
            </Link>
            <Link to="/track-order" className="flex-1 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-6 py-3 rounded-lg font-medium tracking-wide text-sm transition-colors text-center">
              TRACK ORDER
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="font-playfair text-xl tracking-wide">Checkout</h1>
          <div className="flex items-center gap-1 text-white/50 text-xs">
            <Lock size={12} /> Secure Checkout
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-0">
            {[{ n: 1, l: 'Shipping' }, { n: 2, l: 'Payment' }, { n: 3, l: 'Confirmation' }].map((s, i) => (
              <div key={s.n} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s.n ? 'bg-gold text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.n ? <Check size={14} /> : s.n}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step >= s.n ? 'text-charcoal' : 'text-gray-400'}`}>{s.l}</span>
                </div>
                {i < 2 && <div className={`w-12 sm:w-20 h-px mx-3 ${step > s.n ? 'bg-gold' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column — Forms */}
          <div className="flex-1">
            {step === 1 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="font-playfair text-2xl text-charcoal">Shipping Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                    <input type="text" required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                    <input type="text" required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                  <input type="text" required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="Street address" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment, suite, etc.</label>
                  <input type="text" value={shipping.apartment} onChange={e => setShipping({ ...shipping, apartment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <input type="text" required value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                    <input type="text" required value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP *</label>
                    <input type="text" required value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Method</h3>
                  <div className="space-y-2">
                    {[
                      { k: 'standard', l: 'Standard Shipping', d: '5–7 business days', price: totalPrice >= 100 ? 'Free' : '$15' },
                      { k: 'express', l: 'Express Shipping', d: '2–3 business days', price: '$25' },
                      { k: 'overnight', l: 'Overnight Shipping', d: 'Next business day', price: '$50' },
                    ].map(m => (
                      <label key={m.k} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        shippingMethod === m.k ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="shipping" value={m.k} checked={shippingMethod === m.k} onChange={() => setShippingMethod(m.k)}
                          className="accent-gold" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{m.l}</p>
                          <p className="text-xs text-gray-500">{m.d}</p>
                        </div>
                        <span className="text-sm font-medium text-charcoal">{m.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white py-3.5 rounded-lg font-medium tracking-wide transition-colors">
                  CONTINUE TO PAYMENT
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-playfair text-2xl text-charcoal">Payment</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-gold hover:text-gold-dark transition-colors">
                    ← Edit Shipping
                  </button>
                </div>

                {/* Shipping Summary */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <p className="text-gray-500 mb-1">Shipping to</p>
                  <p className="text-gray-900 font-medium">{shipping.firstName} {shipping.lastName} · {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                </div>

                {/* Stripe Placeholder */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard size={20} className="text-gold" />
                    <h3 className="font-medium text-gray-900">Card Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                      <input type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                        <input type="text" placeholder="MM / YY" maxLength={7}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                        <input type="text" placeholder="123" maxLength={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                      <input type="text" placeholder="Full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <Lock size={12} />
                    <span>Payments are processed securely via Stripe. Card data is never stored on our servers.</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                  <strong>Demo mode:</strong> Clicking "Place Order" will simulate a successful payment. Connect Stripe later to process real payments.
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button type="submit" className="flex-1 bg-charcoal hover:bg-charcoal/90 text-white py-3.5 rounded-lg font-medium tracking-wide transition-colors flex items-center justify-center gap-2">
                    <Lock size={16} /> PLACE ORDER · ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Right Column — Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-4">
              <h3 className="font-playfair text-lg text-charcoal mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 shrink-0">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag size={14} className="text-emerald-600" />
                      <span className="font-mono font-medium text-emerald-700">{appliedCoupon.code}</span>
                      <span className="text-emerald-600">
                        {appliedCoupon.freeShipping ? '· Free shipping' : `· −$${appliedCoupon.discount.toFixed(2)}`}
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="p-1 hover:bg-emerald-100 rounded text-emerald-600"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Coupon code"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
                        />
                      </div>
                      <button type="button" onClick={handleApplyCoupon} className="px-4 py-2.5 bg-charcoal hover:bg-charcoal/90 text-white rounded-lg text-sm font-medium transition-colors">Apply</button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${totalPrice.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (est.)</span>
                  <span className="text-gray-900">${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-playfair text-xl text-charcoal">${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck size={14} className="text-gold shrink-0" />
                  <span>Free shipping on orders over ${freeThreshold}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield size={14} className="text-gold shrink-0" />
                  <span>30-day hassle-free returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock size={14} className="text-gold shrink-0" />
                  <span>SSL encrypted secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
