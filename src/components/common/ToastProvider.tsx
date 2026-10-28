import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { ToastContext } from '@/hooks/useToast';

const TOAST_FADE_DURATION_MS = 200;

function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState('');
  const [isVisible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    setMessage(nextMessage);
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setMessage('');
        timerRef.current = null;
      }, TOAST_FADE_DURATION_MS);
    }, 3000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return (
    <ToastContext value={showToast}>
      {children}
      <div
        role="status"
        aria-atomic="true"
        style={{ transitionDuration: `${TOAST_FADE_DURATION_MS}ms` }}
        className={`pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+96px)] z-[100] mx-auto w-full max-w-[480px] px-padding-m transition-[opacity,transform] ease-out motion-reduce:transition-none ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {message && (
          <p className="rounded-[var(--radius-s)] bg-gray-900/90 px-padding-m py-padding-s text-center typography-label-small-medium text-text-inverse shadow-lg backdrop-blur-sm">
            {message}
          </p>
        )}
      </div>
    </ToastContext>
  );
}

export default ToastProvider;
