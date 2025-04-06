import { useEffect } from 'react';

export function useViewportReset(dependencies: any[] = []) {
  useEffect(() => {
    const scrollReset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
      document.querySelectorAll('[style*="overflow"], .overflow-auto, .overflow-y-auto, .overflow-x-auto').forEach((el) => {
        if (el instanceof HTMLElement) {
          el.scrollTop = 0;
          el.scrollLeft = 0;
        }
      });
    };

    const updateViewportMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=1920, initial-scale=0.25, user-scalable=yes');
      }
    };

    // Appliquer immédiatement et après un court délai pour être sûr
    scrollReset();
    updateViewportMeta();

    const timeout = setTimeout(() => {
      scrollReset();
      updateViewportMeta();
    }, 300);

    return () => clearTimeout(timeout);
  }, dependencies);
}

export default useViewportReset;