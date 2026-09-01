import { motion } from 'framer-motion';
import { Award, Sparkles, Gem, Clock, Heart, Eye } from 'lucide-react';
import Newsletter from '../components/Newsletter';

const values = [
  {
    icon: Gem,
    title: 'Ethical Sourcing',
    description: 'Every gemstone is responsibly sourced from certified mines, ensuring full traceability from earth to setting.'
  },
  {
    icon: Heart,
    title: 'Master Craftsmanship',
    description: 'Our artisans combine centuries-old techniques with modern precision, creating pieces that last generations.'
  },
  {
    icon: Eye,
    title: 'Uncompromising Quality',
    description: 'Each piece undergoes 47 individual quality checks before earning the MJ hallmark.'
  },
  {
    icon: Sparkles,
    title: 'Timeless Design',
    description: 'We create jewelry that transcends trends — pieces that feel as relevant in fifty years as they do today.'
  },
];

const timeline = [
  { year: '1874', title: 'Founded', description: 'Master jeweler Henri MJ opens his first atelier on Place Vendôme, Paris.' },
  { year: '1923', title: 'Royal Warrant', description: 'Granted the Royal Warrant as official jeweler to three European courts.' },
  { year: '1961', title: 'New York Atelier', description: 'Opens the iconic Madison Avenue salon, bringing European artistry to America.' },
  { year: '1998', title: 'Sustainability Pledge', description: 'First major jeweler to commit to 100% ethically sourced materials.' },
  { year: '2024', title: 'Digital Atelier', description: 'Launches virtual try-on and personalized design consultation experience.' },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80&fit=crop"
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
            <p className="text-gold-light text-xs tracking-[4px] uppercase mb-4">Our Heritage</p>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-light leading-tight mb-4">
              A Legacy of<br />
              <span className="text-gold italic">Extraordinary</span><br />
              Craftsmanship
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
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop"
                  alt="Jewelry Craftsmanship"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-gold p-6 text-center hidden md:block">
                  <p className="font-playfair text-3xl text-white">Est.</p>
                  <p className="font-playfair text-3xl text-white">1874</p>
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
                Where Passion Meets Precision
              </h2>
              <div className="w-16 h-[1px] bg-gold mb-6" />
              <p className="text-medium-gray font-light leading-relaxed mb-6">
                For over a century, MJ has been synonymous with exceptional artistry
                and uncompromising quality. What began as a small atelier on Place Vendôme
                has grown into one of the world's most revered jewelry houses.
              </p>
              <p className="text-medium-gray font-light leading-relaxed mb-6">
                Each piece in our collection is a testament to the dedication of our master
                jewelers, who combine time-honored techniques with contemporary design to
                create works of lasting beauty.
              </p>
              <p className="text-medium-gray font-light leading-relaxed">
                From selecting the finest gemstones to the final polish, every step of our
                creation process is guided by a passion for perfection and a deep respect
                for the materials we work with.
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
            <p className="text-gold text-xs tracking-[3px] uppercase mb-3">Through the Decades</p>
            <h2 className="font-playfair text-3xl md:text-4xl">Our Journey</h2>
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
              { icon: Clock, value: '150+', label: 'Years of Excellence' },
              { icon: Gem, value: '10K+', label: 'Unique Pieces' },
              { icon: Award, value: '50+', label: 'Awards Won' },
              { icon: Sparkles, value: '100%', label: 'Ethically Sourced' },
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
