import { createContext, useContext } from 'react';

export const UNSUPPORTED_FEATURE_MESSAGE =
  '이번 프로젝트에서는 제공하지 않는 기능이에요.';

export const ToastContext = createContext<
  ((message: string) => void) | undefined
>(undefined);

export function useToast() {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.');
  }

  return showToast;
}
