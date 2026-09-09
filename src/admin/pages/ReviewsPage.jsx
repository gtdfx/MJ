import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function ReviewsPage() {
  const { reviews, approveReview, rejectReview, deleteReview, products } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  const productName = (productId) => {
    const p = products.find(p => p.id === productId);
    return p ? p.name : 'Unknown product';
  };

  const filtered = reviews.filter(r => {
    const matchSearch =
      productName(r.productId).toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === 0 || r.rating === filterRating;
    const status = r.status || 'approved';
    const matchStatus = filterStatus === 'all' || status === filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(re => re.rating === r).length }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">{reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'}</p>
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
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col justify-center">
          <div className="p-3 bg-gray-50 rounded-lg text-center mb-3">
            <p className="text-2xl font-semibold text-gray-900">{reviews.filter(r => r.verified).length}</p>
            <p className="text-xs text-gray-500">Verified Purchases</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-semibold text-gold">{reviews.reduce((s, r) => s + (r.helpful || 0), 0)}</p>
            <p className="text-xs text-gray-500">Total Helpful Votes</p>
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
          {[{ k: 0, l: 'All' }, { k: 5, l: '5 ★' }, { k: 4, l: '4 ★' }, { k: 3, l: '3 ★' }].map(f => (
            <button key={f.k} onClick={() => setFilterRating(f.k)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterRating === f.k ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        {[{ k: 'all', l: 'All' }, { k: 'pending', l: 'Pending' }, { k: 'approved', l: 'Approved' }, { k: 'rejected', l: 'Rejected' }].map(f => (
          <button key={f.k} onClick={() => setFilterStatus(f.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === f.k ? 'bg-gold text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.l}
            {f.k !== 'all' && ` (${reviews.filter(r => (r.status || 'approved') === f.k).length})`}
          </button>
        ))}
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
                  {(() => {
                    const status = review.status || 'approved';
                    const styles = {
                      approved: 'bg-emerald-100 text-emerald-700',
                      pending: 'bg-amber-100 text-amber-700',
                      rejected: 'bg-red-100 text-red-600',
                    };
                    return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${styles[status]}`}>{status}</span>;
                  })()}
                  {review.verified && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{review.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{review.body}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{review.author}</span>
                  <span>·</span>
                  <span>{productName(review.productId)}</span>
                  <span>·</span>
                  <span>{review.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MessageSquare size={10} /> {review.helpful || 0} helpful</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(review.status || 'approved') !== 'approved' && (
                  <button onClick={() => approveReview(review.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600" title="Approve (show on storefront)">
                    <CheckCircle size={16} />
                  </button>
                )}
                {(review.status || 'approved') !== 'rejected' && (
                  <button onClick={() => rejectReview(review.id)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600" title="Reject (hide from storefront)">
                    <XCircle size={16} />
                  </button>
                )}
                <button onClick={() => { if (confirm('Delete this review?')) deleteReview(review.id); }} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
            <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">{reviews.length === 0 ? 'No customer reviews yet' : 'No reviews match your filters'}</p>
            <p className="text-gray-400 text-sm mt-1">{reviews.length === 0 ? 'Reviews submitted on product pages will appear here.' : 'Try adjusting your search or rating filter.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
