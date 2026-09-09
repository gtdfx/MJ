import { motion } from 'framer-motion';
import { Award, Sparkles, Gem, Clock, Heart, Eye } from 'lucide-react';
import Newsletter from '../components/Newsletter';
import usePageMeta from '../hooks/usePageMeta';

const values = [
  {
    icon: Gem,
    title: 'Authentic Ethiopian Opal',
    description: 'Every stone is sourced directly from the Welo region of Ethiopia, with certified origin and full traceability.'
  },
  {
    icon: Heart,
    title: 'Hand-Selected Fire',
    description: 'Each stone is individually inspected and graded for its play of color, clarity, and brilliance.'
  },
  {
    icon: Eye,
    title: 'Transparent Pricing',
    description: 'Sold honestly by gram and carat — you pay exactly for the weight and grade you receive.'
  },
  {
    icon: Sparkles,
    title: 'From Stone to Jewelry',
    description: 'Rough, crystal, and polished — ready for collectors, lapidaries, and bespoke commissions.'
  },
];

const timeline = [
  { year: '2008', title: 'The Discovery', description: 'Major opal deposits found in the Welo district of Ethiopia, revealing fire rivaling Australian opals.' },
  { year: '2012', title: 'Etho-Can Is Born', description: 'We begin sourcing directly from Welo miners — authentic rough, crystal, and polished opal, with no middlemen.' },
  { year: '2016', title: 'Trusted Wholesale', description: 'Our hand-selected opals become a trusted supply for jewelers, lapidaries, and gem collectors.' },
  { year: '2020', title: 'Crystal Opal Focus', description: 'Rare transparent crystal opal parcels become our signature — the most prized of Ethiopian stones.' },
  { year: '2026', title: 'Online Boutique', description: 'Launching our digital storefront from Toronto — every stone now available worldwide, sold by gram and carat.' },
];

export default function AboutPage() {
  usePageMeta('About Us', 'The story of Etho-Can Gemstones — ethical sourcing of Ethiopian Welo opals, from the mines to collectors worldwide.');

  return (
    <div className="bg-cream">
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center">
        <img
          src="/images/opal-hands.jpg"
          alt="Master Jeweler"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-light text-xs tracking-[4px] uppercase mb-4">Our Story</p>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-light leading-tight mb-4">
              Born of<br />
              <span className="text-gold italic">Fire</span> &
              Water
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src="/images/gemstones.jpg"
                  alt="Jewelry Craftsmanship"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-gold p-6 text-center hidden md:block">
                  <p className="font-playfair text-3xl text-white">Since</p>
                  <p className="font-playfair text-3xl text-white">2012</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-gold text-xs tracking-[3px] uppercase mb-4">The Beginning</p>
              <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-6 leading-tight">
                The Fire of Ethiopia
              </h2>
              <div className="w-16 h-[1px] bg-gold mb-6" />
              <p className="text-medium-gray font-light leading-relaxed mb-6">
                Etho-Can Gemstones began in 2012 with a simple mission: bring authentic
                Ethiopian opal — in its raw, crystal, and polished forms — straight from
                the source to the people who love it. No inflated retail markups, no
                mystery about where your stone came from.
              </p>
              <p className="text-medium-gray font-light leading-relaxed mb-6">
                We work directly with miners in the Welo region to bring you rough stones,
                rare transparent crystal opal, and beautifully polished cabochons — each
                hand-selected for its fire.
              </p>
              <p className="text-medium-gray font-light leading-relaxed">
                Whether you're a collector, a lapidary, or dreaming of bespoke jewelry,
                every stone is sold by gram and carat, with honest grading and
                certified Ethiopian origin.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gold text-xs tracking-[3px] uppercase mb-3">What We Stand For</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-charcoal">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-gold/30">
                  <v.icon size={24} className="text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair text-lg text-charcoal mb-3">{v.title}</h3>
                <p className="text-medium-gray text-sm font-light leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gold text-xs tracking-[3px] uppercase mb-3">Through the Years</p>
            <h2 className="font-playfair text-3xl md:text-4xl">From Mine to You</h2>
          </div>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gold/30 -translate-x-1/2" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-12 last:mb-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gold rounded-full -translate-x-1/2 mt-1.5 z-10" />

                {/* Content */}
                <div className={`flex-1 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <p className="font-playfair text-2xl text-gold mb-1">{item.year}</p>
                  <h3 className="font-playfair text-xl mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm font-light">{item.description}</p>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Clock, value: '2012', label: 'Sourcing Since' },
              { icon: Gem, value: '3', label: 'Forms — Rough, Crystal, Polished' },
              { icon: Award, value: '100%', label: 'Certified Ethiopian Origin' },
              { icon: Sparkles, value: '100%', label: 'Hand-Selected Fire' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <stat.icon size={28} className="text-gold mx-auto mb-3" />
                <p className="font-playfair text-3xl md:text-4xl text-charcoal mb-1">{stat.value}</p>
                <p className="text-medium-gray text-xs tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
