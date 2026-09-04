import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAdmin } from '../admin/AdminContext';

export default function ReviewSection({ productId }) {
  const { getProductReviews, getReviewStats, addReview, toggleHelpful } = useAdmin();
  const reviews = getProductReviews(productId);
  const stats = getReviewStats(productId);

  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReview, setExpandedReview] = useState(null);

  const [form, setForm] = useState({
    author: '',
    rating: 5,
    title: '',
    body: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.author.trim() || !form.title.trim() || !form.body.trim()) return;

    addReview({
      productId,
      author: form.author.trim(),
      avatar: form.author.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      rating: form.rating,
      title: form.title.trim(),
      body: form.body.trim(),
      verified: false,
    });

    setForm({ author: '', rating: 5, title: '', body: '' });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 3000);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-light-gray">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={20} className="text-gold" strokeWidth={1.5} />
        <h2 className="font-playfair text-2xl md:text-3xl text-charcoal">
          Customer Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-light-gray p-6 md:p-8">
            {/* Average Rating */}
            <div className="text-center mb-6">
              <p className="font-playfair text-5xl text-charcoal mb-1">{stats.avg || '0.0'}</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={18}
                    className={i <= Math.round(stats.avg) ? 'text-gold fill-gold' : 'text-light-gray'}
                  />
                ))}
              </div>
              <p className="text-medium-gray text-sm">
                Based on {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.distribution[rating - 1];
                const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs text-medium-gray w-3">{rating}</span>
                    <Star size={12} className="text-gold fill-gold shrink-0" />
                    <div className="flex-1 h-2 bg-cream overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-medium-gray w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-luxury w-full mt-6 text-center"
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        </div>

        {/* Right: Review Form + List */}
        <div className="lg:col-span-2">
          {/* Review Form */}
          {showForm && (
            <div className="bg-white border border-light-gray p-6 md:p-8 mb-6">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-playfair text-xl text-charcoal mb-2">Thank You!</h3>
                  <p className="text-medium-gray">Your review has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-playfair text-xl text-charcoal mb-6">Share Your Experience</h3>

                  {/* Star Rating */}
                  <div className="mb-5">
                    <label className="text-xs uppercase tracking-[2px] text-charcoal mb-3 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({ ...form, rating: i })}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              i <= form.rating ? 'text-gold fill-gold' : 'text-light-gray hover:text-gold/50'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="text-xs uppercase tracking-[2px] text-charcoal mb-2 block">Your Name</label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={e => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. Victoria Sterling"
                      className="w-full px-4 py-3 border border-light-gray bg-white text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="text-xs uppercase tracking-[2px] text-charcoal mb-2 block">Review Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Summarize your experience"
                      className="w-full px-4 py-3 border border-light-gray bg-white text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>

                  {/* Body */}
                  <div className="mb-6">
                    <label className="text-xs uppercase tracking-[2px] text-charcoal mb-2 block">Your Review</label>
                    <textarea
                      value={form.body}
                      onChange={e => setForm({ ...form, body: e.target.value })}
                      placeholder="Tell us about the quality, craftsmanship, and your overall experience..."
                      rows={4}
                      className="w-full px-4 py-3 border border-light-gray bg-white text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none transition-colors text-sm resize-none"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-luxury w-full text-center">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-medium-gray text-sm">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs tracking-wider uppercase text-charcoal bg-white border border-light-gray px-4 py-2 focus:outline-none focus:border-gold"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12 bg-white border border-light-gray">
              <MessageSquare size={32} className="text-light-gray mx-auto mb-3" />
              <p className="text-medium-gray">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map(review => (
                <div key={review.id} className="bg-white border border-light-gray p-5 md:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-gold tracking-wider">{review.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-charcoal font-medium text-sm">{review.author}</p>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-green-600 uppercase tracking-wider">
                              <CheckCircle size={10} />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-medium-gray text-xs">{formatDate(review.date)}</p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          size={14}
                          className={i <= review.rating ? 'text-gold fill-gold' : 'text-light-gray'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-playfair text-base text-charcoal mb-2">{review.title}</h4>

                  {/* Body */}
                  <p className={`text-medium-gray font-light text-sm leading-relaxed ${
                    expandedReview !== review.id && review.body.length > 200 ? 'line-clamp-3' : ''
                  }`}>
                    {review.body}
                  </p>

                  {review.body.length > 200 && (
                    <button
                      onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                      className="text-gold text-xs tracking-wider uppercase mt-2 flex items-center gap-1 hover:underline"
                    >
                      {expandedReview === review.id ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>Read More <ChevronDown size={12} /></>
                      )}
                    </button>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-light-gray/50">
                    <button
                      onClick={() => toggleHelpful(review.id)}
                      className="flex items-center gap-2 text-xs text-medium-gray hover:text-gold transition-colors"
                    >
                      <ThumbsUp size={14} />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
