import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { saveScrollPosition } from '@/utils/pageScrollPosition';

export function usePageScrollPosition() {
  const { key, pathname, state } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef<string | null>(null);
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

    const isInitialEntry = previousPathname.current === null;
    const isNewScreen =
      navigationType !== 'POP' &&
      previousPathname.current !== pathname &&
      !restoreKey;

    if (isInitialEntry || isNewScreen) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }

    previousPathname.current = pathname;

    const handleScroll = () => {
      saveScrollPosition(key, scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [key, pathname, navigationType, restoreKey]);
}
