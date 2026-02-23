'use client';

import { useEffect, useState } from 'react';

interface UseSessionPersistenceParams<T> {
  storageKey: string;
  snapshot: T;
  hydrate: (parsed: T) => void;
}

export function useSessionPersistence<T>({
  storageKey,
  snapshot,
  hydrate,
}: UseSessionPersistenceParams<T>) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as T;
      hydrate(parsed);
    } catch {
      window.sessionStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, [hydrate, storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
  }, [isHydrated, snapshot, storageKey]);

  return { isHydrated };
}
