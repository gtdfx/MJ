import { motion } from 'framer-motion';
import { Phone, Mail, Send, Clock, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Newsletter from '../components/Newsletter';
import usePageMeta from '../hooks/usePageMeta';

export default function ContactPage() {
  usePageMeta('Contact Us', 'Get in touch with Etho-Can Gemstones — our team responds within 24 hours.');

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Honeypot: bots fill this hidden field — silently ignore them
    if (formData.website) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setError('Your message should be at least 10 characters.');
      return;
    }

    setError('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '', website: '' });
  };

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-center">
        <img
          src="/images/opal-show.jpg"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-gold-light text-xs tracking-[4px] uppercase mb-3">Get in Touch</p>
            <h1 className="font-playfair text-4xl md:text-6xl text-white font-light">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-2xl md:text-3xl text-charcoal mb-2">Send Us a Message</h2>
              <p className="text-medium-gray text-sm font-light mb-8">
                Our concierge team typically responds within 24 hours.
              </p>

              {submitted && (
                <div className="bg-green-50 border border-green-200 p-4 mb-6 text-green-700 text-sm">
                  Thank you! Your message has been sent. We'll be in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot — hidden from humans, filled by bots */}
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="luxury-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="luxury-input"
                    required
                  />
                </div>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="luxury-input"
                  required
                >
                  <option value="">Select a Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="appointment">Book an Appointment</option>
                  <option value="bespoke">Bespoke Design</option>
                  <option value="press">Press & Media</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="luxury-input resize-none"
                  required
                />
                <button type="submit" className="btn-luxury flex items-center gap-2">
                  <span>Send Message</span>
                  <Send size={16} />
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-playfair text-2xl md:text-3xl text-charcoal mb-2">Get in Touch</h2>
              <p className="text-medium-gray text-sm font-light mb-8">
                We're an online boutique — reach us any way that suits you.
              </p>

              <div className="space-y-5">
                <div className="p-6 bg-white border border-light-gray flex items-start gap-4">
                  <div className="w-11 h-11 bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-charcoal mb-1">Email Us</h3>
                    <p className="text-medium-gray font-light text-sm mb-1">For orders, questions, or custom requests</p>
                    <a href="mailto:mesfinkibret@yahoo.com" className="text-gold text-sm hover:text-gold-light transition-colors">
                      mesfinkibret@yahoo.com
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-white border border-light-gray flex items-start gap-4">
                  <div className="w-11 h-11 bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-charcoal mb-1">Call Us</h3>
                    <p className="text-medium-gray font-light text-sm mb-1">Mon–Sat, 10am–7pm</p>
                    <a href="tel:+16477193169" className="text-gold text-sm hover:text-gold-light transition-colors">
                      +1 647-719-3169
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-white border border-light-gray flex items-start gap-4">
                  <div className="w-11 h-11 bg-gold/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-charcoal mb-1">Response Time</h3>
                    <p className="text-medium-gray font-light text-sm mb-1">We reply to every message</p>
                    <p className="text-charcoal text-sm">Within 24 hours</p>
                  </div>
                </div>

                <div className="p-6 bg-white border border-light-gray flex items-start gap-4">
                  <div className="w-11 h-11 bg-gold/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-charcoal mb-1">Everywhere Online</h3>
                    <p className="text-medium-gray font-light text-sm">
                      Shop from anywhere — we ship worldwide with tracked, insured delivery.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
