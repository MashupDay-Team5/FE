import { useEffect, useRef, useState, type RefObject } from 'react';

const SHEET_TRANSITION_DURATION = 400;

type UseSheetDialogOptions = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  onOpen?: () => void;
};

export function useSheetDialog({
  isOpen,
  onClose,
  triggerRef,
  onOpen,
}: UseSheetDialogOptions) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasBeenOpenedRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen) hasBeenOpenedRef.current = true;
  }, [isOpen]);

  useEffect(() => {
    let animationFrameId: number | undefined;
    let unmountTimeoutId: number | undefined;

    if (isOpen) {
      animationFrameId = requestAnimationFrame(() => {
        onOpen?.();
        setIsRendered(true);
        animationFrameId = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      animationFrameId = requestAnimationFrame(() => {
        setIsVisible(false);
        unmountTimeoutId = window.setTimeout(() => {
          setIsRendered(false);
        }, SHEET_TRANSITION_DURATION);
      });
    }

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }

      if (unmountTimeoutId !== undefined) {
        window.clearTimeout(unmountTimeoutId);
      }
    };
  }, [isOpen, onOpen]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) {
        return;
      }

      const focusableElements = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements.at(-1);
      const isFocusOutsideSheet = !sheetRef.current.contains(
        document.activeElement,
      );

      if (
        event.shiftKey &&
        (isFocusOutsideSheet ||
          document.activeElement === firstFocusableElement)
      ) {
        event.preventDefault();
        lastFocusableElement?.focus();
      } else if (
        !event.shiftKey &&
        (isFocusOutsideSheet || document.activeElement === lastFocusableElement)
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const rootElement = document.getElementById('root');
    const previousRootOverflow = rootElement?.style.overflow;
    document.body.style.overflow = 'hidden';
    if (rootElement) {
      rootElement.style.overflow = 'hidden';
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (rootElement) {
        rootElement.style.overflow = previousRootOverflow ?? '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, onClose]);

  useEffect(() => {
    if (isRendered && isOpen) {
      const animationFrameId = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

      return () => cancelAnimationFrame(animationFrameId);
    }

    if (!isRendered && hasBeenOpenedRef.current) {
      const previouslyFocusedElement = triggerRef.current;

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    }
  }, [isOpen, isRendered, triggerRef]);

  return { isRendered, isVisible, sheetRef, closeButtonRef };
}
