import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, CheckCircle, Trash2, Eye, MessageSquare } from 'lucide-react';
import { useAdmin } from '../AdminContext';

const seedReviews = [
  { id: 1, productId: 1, productName: 'Celestial Diamond Ring', customer: 'Victoria Sterling', rating: 5, title: 'Absolutely Stunning', text: 'The craftsmanship is breathtaking. My husband chose this for our anniversary and I could not be happier. The diamond catches light beautifully.', date: '2026-08-29', status: 'approved', helpful: 12 },
  { id: 2, productId: 2, productName: 'Rose Eternity Necklace', customer: 'Sophie Laurent', rating: 5, title: 'Perfect Gift', text: 'Bought this for my mother\'s birthday. The rose gold is beautiful and the packaging was exquisite. Will definitely shop here again.', date: '2026-08-27', status: 'approved', helpful: 8 },
  { id: 3, productId: 8, productName: 'Seraphina Tennis Bracelet', customer: 'Marcus Lee', rating: 4, title: 'Beautiful but Slightly Heavy', text: 'The bracelet is stunning and the diamonds sparkle brilliantly. Only minor note — it\'s slightly heavier than expected, but the quality is undeniable.', date: '2026-08-26', status: 'approved', helpful: 5 },
  { id: 4, productId: 3, productName: 'Imperial Sapphire Earrings', customer: 'Isabella Romano', rating: 5, title: 'Royal Elegance', text: 'These earrings make me feel like royalty. The sapphires are vivid and the platinum setting is flawless. Worth every penny.', date: '2026-08-25', status: 'approved', helpful: 15 },
  { id: 5, productId: 7, productName: 'Aura Emerald Ring', customer: 'James Wright', rating: 3, title: 'Nice but Expected More', text: 'The emerald is beautiful but smaller than I expected from the photos. The setting itself is gorgeous though.', date: '2026-08-24', status: 'pending', helpful: 2 },
  { id: 6, productId: 5, productName: 'Noir Diamond Pendant', customer: 'Elena Volkov', rating: 5, title: 'Mesmerizing', text: 'The contrast between the black and white diamonds is mesmerizing. This is truly a work of art. The pendant gets compliments everywhere I go.', date: '2026-08-23', status: 'approved', helpful: 9 },
];

export default function ReviewsPage() {
  const { products } = useAdmin();
  const [reviews, setReviews] = useState(seedReviews);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState(0);

  const filtered = reviews.filter(r => {
    const matchSearch = r.productName.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchRating = filterRating === 0 || r.rating === filterRating;
    return matchSearch && matchStatus && matchRating;
  });

  const approveReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const deleteReview = (id) => {
    if (confirm('Delete this review?')) setReviews(prev => prev.filter(r => r.id !== id));
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(re => re.rating === r).length }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">{reviews.length} reviews · {reviews.filter(r => r.status === 'pending').length} pending</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <p className="text-4xl font-semibold text-gray-900 mb-1">{avgRating}</p>
          <div className="flex justify-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className={`${i <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-gray-200'}`} />)}
          </div>
          <p className="text-xs text-gray-500">Average Rating</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</p>
          {ratingDist.map(d => (
            <div key={d.rating} className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-gray-500 w-3">{d.rating}</span>
              <Star size={10} className="text-gold fill-gold" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${reviews.length > 0 ? (d.count / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-5">{d.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-semibold text-emerald-600">{reviews.filter(r => r.status === 'approved').length}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-semibold text-amber-600">{reviews.filter(r => r.status === 'pending').length}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
        </div>
        <div className="flex gap-2">
          {[{ k: 'all', l: 'All' }, { k: 'pending', l: 'Pending' }, { k: 'approved', l: 'Approved' }].map(f => (
            <button key={f.k} onClick={() => setFilterStatus(f.k)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === f.k ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map(review => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className={`${i <= review.rating ? 'text-gold fill-gold' : 'text-gray-200'}`} />)}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {review.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{review.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{review.text}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{review.customer}</span>
                  <span>·</span>
                  <span>{review.productName}</span>
                  <span>·</span>
                  <span>{review.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MessageSquare size={10} /> {review.helpful} helpful</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {review.status === 'pending' && (
                  <button onClick={() => approveReview(review.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600" title="Approve">
                    <CheckCircle size={16} />
                  </button>
                )}
                <button onClick={() => deleteReview(review.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No reviews found</div>}
      </div>
    </div>
  );
}
