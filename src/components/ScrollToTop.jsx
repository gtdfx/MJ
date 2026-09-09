import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../analytics/tracker';

// Scrolls to top on navigation and records a page_view analytics event.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    track('page_view', { page: pathname });
  }, [pathname]);
  return null;
}
