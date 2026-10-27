const savedScrollPositions = new Map<string, number>();

export function getSavedScrollPosition(entryKey: string) {
  return savedScrollPositions.get(entryKey) ?? 0;
}

export function saveScrollPosition(entryKey: string, scrollTop: number) {
  savedScrollPositions.set(entryKey, scrollTop);
}
