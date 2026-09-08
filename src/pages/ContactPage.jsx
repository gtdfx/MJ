import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import Newsletter from '../components/Newsletter';

const storeLocations = [
  {
    name: 'MJ Flagship Store',
    address: '1504-25 Richview Rd, Etobicoke, ON M9A 4Y3, Canada',
    phone: '+1 647-719-3169',
    hours: 'Mon–Sat 10am–7pm, Sun 12pm–6pm',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80&fit=crop"
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

            {/* Store Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-playfair text-2xl md:text-3xl text-charcoal mb-2">Visit Our Ateliers</h2>
              <p className="text-medium-gray text-sm font-light mb-8">
                Experience our collections in person with a private consultation.
              </p>

              <div className="space-y-8">
                {storeLocations.map((store, i) => (
                  <div key={store.name} className="p-6 bg-white border border-light-gray">
                    <h3 className="font-playfair text-lg text-charcoal mb-4">{store.name}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                        <span className="text-medium-gray font-light">{store.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gold shrink-0" />
                        <span className="text-medium-gray font-light">{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-gold shrink-0" />
                        <span className="text-medium-gray font-light">{store.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-charcoal text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Mail size={18} className="text-gold" />
                  <h3 className="font-playfair text-lg">Private Concierge</h3>
                </div>
                <p className="text-white/60 text-sm font-light mb-2">
                  For urgent inquiries or private viewings:
                </p>
                <a href="mailto:mesfinkibret@yahoo.com" className="text-gold text-sm hover:text-gold-light transition-colors">
                  mesfinkibret@yahoo.com
                </a>
                <p className="text-white/60 text-sm font-light mt-1">+1 647-719-3169</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
