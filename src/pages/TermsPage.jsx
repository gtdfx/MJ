import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import usePageMeta from '../hooks/usePageMeta';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the Etho-Can Gemstones website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use our website or services.',
  },
  {
    title: '2. Products & Pricing',
    body: 'All product descriptions, images, and prices are subject to change without notice. We make every effort to display accurate product information, but we do not warrant that product descriptions or other content is error-free. Prices are listed in USD and may be subject to applicable taxes.',
  },
  {
    title: '3. Orders & Payment',
    body: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at any time, including orders that appear to be fraudulent or contain pricing errors. Payment must be received in full before an order is processed.',
  },
  {
    title: '4. Shipping & Delivery',
    body: 'Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or events beyond our control. Risk of loss passes to you upon delivery to the carrier.',
  },
  {
    title: '5. Returns & Exchanges',
    body: 'We offer a 30-day return policy on unworn jewelry in its original packaging with all certificates and documents included. Custom and bespoke pieces are final sale unless defective. Return shipping costs are the responsibility of the customer unless the item arrived damaged.',
  },
  {
    title: '6. Intellectual Property',
    body: 'All content on this website — including text, graphics, logos, images, and designs — is the property of Etho-Can Gemstones and protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without written permission.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'To the maximum extent permitted by law, Etho-Can Gemstones shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.',
  },
  {
    title: '8. Governing Law',
    body: 'These terms shall be governed by and construed in accordance with the laws of Ontario, Canada. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ontario.',
  },
  {
    title: '9. Contact',
    body: 'Questions about these Terms & Conditions? Contact us at mesfinkibret@yahoo.com or call +1 647-719-3169.',
  },
];

export default function TermsPage() {
  usePageMeta('Terms & Conditions', 'The terms governing use of the Etho-Can Gemstones website and purchase of our products.');

  return (
    <div className="bg-cream pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <FileText size={32} className="text-gold mx-auto mb-4" />
          <p className="text-gold text-xs tracking-[4px] uppercase mb-3">Legal</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">Terms & Conditions</h1>
          <p className="text-medium-gray font-light">Last updated: September 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-light-gray p-6 md:p-10 space-y-8"
        >
          <p className="text-medium-gray font-light leading-relaxed">
            These Terms & Conditions govern your use of the Etho-Can Gemstones website and the purchase of our products.
            Please read them carefully before placing an order.
          </p>
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="font-playfair text-xl text-charcoal mb-3">{section.title}</h2>
              <p className="text-medium-gray font-light leading-relaxed text-sm">{section.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}