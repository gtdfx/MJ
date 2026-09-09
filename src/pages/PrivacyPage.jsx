import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import usePageMeta from '../hooks/usePageMeta';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment details when you place an order or contact us. We also automatically collect certain information about your device and how you interact with our site, such as your IP address, browser type, and pages visited.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to process and fulfill your orders, communicate with you about your purchases, provide customer support, improve our products and services, and send you marketing communications if you have opted in. We do not sell your personal information to third parties.',
  },
  {
    title: '3. Payment Security',
    body: 'All payment transactions are processed through secure, PCI-compliant payment providers. We never store your full credit card details on our servers. When you make a payment, your card information is transmitted directly to our payment processor using industry-standard encryption.',
  },
  {
    title: '4. Cookies',
    body: 'We use cookies and similar technologies to keep you signed in, remember your cart contents, and understand how visitors use our website. You can control cookies through your browser settings. Disabling certain cookies may affect your ability to use parts of our site.',
  },
  {
    title: '5. Data Sharing',
    body: 'We share your information only with trusted service providers who help us operate our business (such as shipping carriers, payment processors, and analytics providers), and only to the extent necessary to provide our services. We may disclose information when required by law.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, or delete the personal information we hold about you. You may also opt out of marketing communications at any time. To exercise these rights, contact us at mesfinkibret@yahoo.com and we will respond within 30 days.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain your personal information only for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.',
  },
  {
    title: '8. Contact Us',
    body: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us at mesfinkibret@yahoo.com or call +1 647-719-3169.',
  },
];

export default function PrivacyPage() {
  usePageMeta('Privacy Policy', 'How Etho-Can Gemstones collects, uses, and protects your personal information.');

  return (
    <div className="bg-cream pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Shield size={32} className="text-gold mx-auto mb-4" />
          <p className="text-gold text-xs tracking-[4px] uppercase mb-3">Legal</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">Privacy Policy</h1>
          <p className="text-medium-gray font-light">Last updated: September 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-light-gray p-6 md:p-10 space-y-8"
        >
          <p className="text-medium-gray font-light leading-relaxed">
            At Etho-Can Gemstones, we take your privacy seriously. This Privacy Policy explains how we collect, use,
            and protect your personal information when you visit our website or make a purchase.
            By using our site, you consent to the practices described below.
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