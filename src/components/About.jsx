import { motion } from 'framer-motion';
import { Award, Sparkles, Gem, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Clock, value: "150+", label: "Years of Excellence" },
    { icon: Gem, value: "10K+", label: "Unique Pieces" },
    { icon: Award, value: "50+", label: "Awards Won" },
    { icon: Sparkles, value: "100%", label: "Ethically Sourced" }
  ];

  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 bg-charcoal text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=1000&fit=crop"
                alt="Master Jeweler"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              {/* Decorative Frame */}
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-full h-full border border-gold/30" />
              <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-32 h-32 md:w-48 md:h-48 bg-gold/10" />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 right-4 md:-bottom-8 md:right-8 bg-gold p-4 md:p-6 text-center"
            >
              <p className="font-playfair text-2xl md:text-4xl text-white mb-1">Est.</p>
              <p className="font-playfair text-2xl md:text-4xl text-white">1874</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gold text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-3 md:mb-4">
              Our Heritage
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight">
              A Legacy of<br />
              <span className="text-gold italic">Extraordinary</span><br />
              Craftsmanship
            </h2>

            <div className="w-16 h-[1px] bg-gold mb-6 md:mb-8" />

            <p className="text-white/70 font-light leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
              For over a century, MJ has been synonymous with exceptional artistry
              and uncompromising quality. Each piece in our collection is a testament
              to the dedication of our master jewelers, who combine time-honored
              techniques with contemporary design.
            </p>

            <p className="text-white/70 font-light leading-relaxed mb-8 md:mb-10 text-sm md:text-base">
              From selecting the finest gemstones to the final polish, every step
              of our creation process is guided by a passion for perfection and
              a deep respect for the materials we work with.
            </p>

            <a href="#contact" className="btn-luxury inline-block">
              Discover Our Story
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-24 pt-12 md:pt-16 border-t border-white/10"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon size={24} className="text-gold mx-auto mb-3 md:mb-4" />
              <p className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-1 md:mb-2">
                {stat.value}
              </p>
              <p className="text-white/50 text-[10px] md:text-sm tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
