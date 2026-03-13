'use client';

import { useEffect, useRef, useState } from 'react';

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
  const hydrateRef = useRef(hydrate);

  useEffect(() => {
    hydrateRef.current = hydrate;
  }, [hydrate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as T;
      hydrateRef.current(parsed);
    } catch {
      window.sessionStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
  }, [isHydrated, snapshot, storageKey]);

  return { isHydrated };
}
