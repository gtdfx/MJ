import { useEffect } from 'react';

/**
 * Sets the document title and meta description for the current page.
 * Improves SEO and social sharing for each route.
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Ethio-Can Gemstones` : 'Ethio-Can Gemstones — Ethiopian Opals';

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}