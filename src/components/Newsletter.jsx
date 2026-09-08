import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Honeypot: bots fill this hidden field — silently ignore them
    if (honeypot) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

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

          {subscribed ? (
            <div className="max-w-lg mx-auto bg-white border border-gold/30 p-6 flex items-center justify-center gap-3">
              <CheckCircle size={24} className="text-gold shrink-0" />
              <p className="text-charcoal font-light">Welcome to the MJ inner circle — check your inbox!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto">
              {/* Honeypot — hidden from humans, filled by bots */}
              <input
                type="text"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="luxury-input flex-1 min-w-0"
                aria-label="Email address"
                required
              />
              <button type="submit" className="btn-luxury flex items-center justify-center gap-2 shrink-0">
                <span>Subscribe</span>
                <Send size={16} />
              </button>
            </form>
          )}

          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

          <p className="text-medium-gray/60 text-xs mt-4">
            By subscribing, you agree to receive our newsletter. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;