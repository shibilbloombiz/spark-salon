'use client';

import { useEffect } from 'react';

/**
 * Standard native cursor mode:
 * Cleans up any lingering custom cursor classes or attributes.
 */
export default function CustomCursor(): null {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('has-cursor');
      document.body.classList.remove('cur-on', 'is-press');
      if (document.body.dataset.cursor) {
        delete document.body.dataset.cursor;
      }
      const existingRoot = document.querySelector('.spark-cursor-root');
      if (existingRoot) {
        existingRoot.remove();
      }
    }
  }, []);

  return null;
}
