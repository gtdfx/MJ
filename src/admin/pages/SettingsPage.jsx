import { useState } from 'react';
import { Save, Store, Bell, CreditCard, Truck } from 'lucide-react';

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'MJ',
    tagline: 'Luxury Fine Jewelry Since 1874',
    email: 'concierge@mj.com',
    phone: '+1 (800) 555-LUXE',
    address: '123 Luxury Avenue, New York, NY 10001',
    currency: 'USD',
    freeShippingThreshold: '1000',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    customerReview: false,
    weeklyReport: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your store configuration</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Store Info */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <Store size={20} className="text-gold" />
          <h3 className="font-medium text-gray-900">Store Information</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={storeSettings.storeName} onChange={e => setStoreSettings({ ...storeSettings, storeName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" value={storeSettings.tagline} onChange={e => setStoreSettings({ ...storeSettings, tagline: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={storeSettings.email} onChange={e => setStoreSettings({ ...storeSettings, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={storeSettings.phone} onChange={e => setStoreSettings({ ...storeSettings, phone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={storeSettings.address} onChange={e => setStoreSettings({ ...storeSettings, address: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <Truck size={20} className="text-gold" />
          <h3 className="font-medium text-gray-900">Shipping</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={storeSettings.currency} onChange={e => setStoreSettings({ ...storeSettings, currency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
              <input type="number" value={storeSettings.freeShippingThreshold} onChange={e => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <Bell size={20} className="text-gold" />
          <h3 className="font-medium text-gray-900">Notifications</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: 'newOrder', label: 'New order notifications', desc: 'Get notified when a new order is placed' },
            { key: 'lowStock', label: 'Low stock alerts', desc: 'Alert when inventory drops below threshold' },
            { key: 'customerReview', label: 'Customer reviews', desc: 'Notifications for new product reviews' },
            { key: 'weeklyReport', label: 'Weekly reports', desc: 'Receive weekly sales and analytics summary' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-gold' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <CreditCard size={20} className="text-gold" />
          <h3 className="font-medium text-gray-900">Payment Methods</h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {['Visa / Mastercard', 'American Express', 'PayPal', 'Apple Pay'].map(method => (
              <div key={method} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{method}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="bg-gold hover:bg-gold-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
}
