import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  getSavedScrollPosition,
  saveScrollPosition,
} from '@/utils/pageScrollPosition';

type ScrollEntry = {
  key: string;
  target: number | null;
  restored: boolean;
};

export function usePageScrollPosition(isReady = true) {
  const { key, pathname, state } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef<string | null>(null);
  const entry = useRef<ScrollEntry | null>(null);
  const restoreKey =
    typeof state?.restoreListStateKey === 'string'
      ? state.restoreListStateKey
      : undefined;

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const scrollContainer = document.getElementById('root');
    if (!scrollContainer) return;

    if (entry.current?.key !== key) {
      const isNewScreen = previousPathname.current !== pathname;
      const sourceKey =
        navigationType === 'POP' ? key : isNewScreen ? restoreKey : undefined;

      entry.current = {
        key,
        target: sourceKey
          ? getSavedScrollPosition(sourceKey)
          : isNewScreen
            ? 0
            : null,
        restored: false,
      };
    }

    previousPathname.current = pathname;
    const currentEntry = entry.current;
    let isRestoring = currentEntry.target !== null && !currentEntry.restored;
    let isCancelled = false;

    const handleScroll = () => {
      if (isRestoring) return;
      saveScrollPosition(key, scrollContainer.scrollTop);
    };

    const stopRestoration = () => {
      isRestoring = false;
      currentEntry.restored = true;
      handleScroll();
    };

    if (isRestoring) {
      scrollContainer.scrollTo({
        top: isReady ? (currentEntry.target ?? 0) : 0,
        behavior: 'instant',
      });

      if (isReady) {
        void document.fonts.ready.then(() => {
          if (isCancelled || !isRestoring) return;
          scrollContainer.scrollTo({
            top: currentEntry.target ?? 0,
            behavior: 'instant',
          });
          stopRestoration();
        });
      }
    } else {
      handleScroll();
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('wheel', stopRestoration, {
      passive: true,
    });
    scrollContainer.addEventListener('touchstart', stopRestoration, {
      passive: true,
    });
    scrollContainer.addEventListener('pointerdown', stopRestoration);
    window.addEventListener('keydown', stopRestoration);

    return () => {
      isCancelled = true;
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', stopRestoration);
      scrollContainer.removeEventListener('touchstart', stopRestoration);
      scrollContainer.removeEventListener('pointerdown', stopRestoration);
      window.removeEventListener('keydown', stopRestoration);
    };
  }, [key, pathname, navigationType, restoreKey, isReady]);
}
