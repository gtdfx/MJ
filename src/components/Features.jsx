import { motion } from 'framer-motion';
import { Shield, Truck, Gem, RefreshCcw, Award, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Gem,
    title: "Authentic Welo Opal",
    description: "Sourced directly from Ethiopian mines, certified origin."
  },
  {
    icon: Award,
    title: "Sold by Gram & Carat",
    description: "Transparent pricing — you pay exactly for the weight."
  },
  {
    icon: Shield,
    title: "Certified Quality",
    description: "Hand-graded AA to museum-grade fire in every stone."
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    description: "Free worldwide shipping with full insurance."
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30-day returns on all unset stones."
  },
  {
    icon: HeartHandshake,
    title: "Straight from the Source",
    description: "Buying questions answered by the people who grade the stones."
  }
];

const Features = () => {
  return (
    <section className="py-12 md:py-20 bg-cream border-y border-light-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-11 h-11 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 flex items-center justify-center border border-gold/30 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                <feature.icon
                  size={20}
                  className="text-gold group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-playfair text-xs md:text-sm text-charcoal mb-1 md:mb-2">
                {feature.title}
              </h3>
              <p className="text-medium-gray text-[10px] md:text-xs font-light leading-relaxed hidden sm:block">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
