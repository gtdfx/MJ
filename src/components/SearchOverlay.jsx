import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useAdmin } from '../admin/AdminContext';

const RECENT_KEY = 'ecg-recent-searches';
const MAX_RECENT = 4;

/** Lightweight fuzzy scorer: higher = better match; 0 = no match. */
const scoreMatch = (text, query) => {
  if (!text) return 0;
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  const idx = t.indexOf(q);
  if (idx === -1) {
    // all query characters present in order (loose match)
    let ti = 0;
    for (const ch of q) {
      ti = t.indexOf(ch, ti);
      if (ti === -1) return 0;
      ti++;
    }
    return 1;
  }
  // exact substring: weight by earliness and word-start matches
  const wordStart = idx === 0 || /\W/.test(t[idx - 1]);
  return wordStart ? 30 : 15;
};

const productScore = (p, query) => {
  const name = scoreMatch(p.name, query) * 5;
  const type = scoreMatch(p.type, query) * 4;
  const origin = scoreMatch(p.origin, query) * 2;
  const grade = scoreMatch(p.grade, query);
  const sku = scoreMatch(p.sku, query) * 2;
  const desc = scoreMatch(p.description, query);
  const total = name + type + origin + grade + sku + desc;
  return total;
};

const SearchOverlay = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { products } = useAdmin();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const visible = useMemo(
    () => products.filter((p) => p.active !== false),
    [products]
  );

  useEffect(() => {
    if (!open) return;
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    } catch {
      setRecent([]);
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => setHighlight(0), [query]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return visible
      .map((p) => ({ product: p, score: productScore(p, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => r.product);
  }, [query, visible]);

  const goTo = useCallback(
    (product) => {
      const q = query.trim();
      if (q.length >= 2) {
        try {
          const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT);
          setRecent(next);
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
      }
      onClose();
      setQuery('');
      navigate(`/product/${product.id}`);
    },
    [query, recent, onClose, navigate]
  );

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlight]) goTo(results[highlight]);
    }
  };

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream border-b border-gold/30 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="max-w-3xl w-full mx-auto px-4 md:px-6 pt-6 pb-4 md:pt-10">
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-charcoal/20 pb-3">
            <Search size={22} className="text-gold shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search opals — rough, crystal, polished…"
              className="flex-1 bg-transparent outline-none text-lg md:text-2xl font-light text-charcoal placeholder:text-charcoal/30"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="p-2 text-charcoal/40 hover:text-charcoal transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Recent searches */}
          {query.trim().length < 2 && recent.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] md:text-xs tracking-[3px] uppercase text-medium-gray mb-3 flex items-center gap-2">
                <Clock size={12} /> Recent
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="px-4 py-2 text-xs md:text-sm bg-white text-charcoal border border-light-gray hover:border-gold transition-colors"
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setRecent([]);
                    try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
                  }}
                  className="px-2 py-2 text-xs text-charcoal/40 hover:text-charcoal underline underline-offset-2 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Hint for short queries */}
          {query.trim().length === 1 && (
            <p className="mt-8 text-center text-sm text-charcoal/40 font-light">
              Type at least two letters…
            </p>
          )}

          {/* Results */}
          {query.trim().length >= 2 && (
            <div ref={listRef} className="mt-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-playfair text-xl text-charcoal mb-2">Nothing found</p>
                  <p className="text-sm text-charcoal/50 font-light">
                    No opals match “{query}”. Try “rough”, “crystal” or “polished”.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-light-gray">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        data-active={i === highlight}
                        onClick={() => goTo(p)}
                        onMouseEnter={() => setHighlight(i)}
                        className={`w-full flex items-center gap-4 px-2 md:px-3 py-3 text-left transition-colors ${
                          i === highlight ? 'bg-gold/10' : 'bg-transparent'
                        }`}
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="w-14 h-14 md:w-16 md:h-16 object-cover shrink-0 bg-light-gray"
                          onError={(e) => { e.target.style.visibility = 'hidden'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-playfair text-base md:text-lg text-charcoal truncate">
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="badge-gold">{p.badge}</span>
                            )}
                            {p.stock === 0 && (
                              <span className="text-[10px] tracking-[1px] uppercase text-red-600 font-medium">
                                Out of stock
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-medium-gray font-light truncate">
                            {p.grade} · {p.origin}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm md:text-base text-charcoal">
                            ${p.pricePerUnit}
                            <span className="text-xs text-medium-gray"> / {p.soldBy}</span>
                          </p>
                          <ArrowRight size={14} className="ml-auto mt-1 text-gold" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
