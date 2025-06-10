/**
 * ⚡ PERFORMANCE OPTIMIZER
 * Utilities to improve application performance
 */

import { useCallback, useMemo, useRef } from "react";

// Debounce hook for search inputs
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay],
  );
};

// Throttle hook for scroll events
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  const lastCall = useRef(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay],
  );
};

// Memoization utilities
export const memoizedComputation = <T, R>(
  computation: (input: T) => R,
  dependency: T,
): R => {
  return useMemo(() => computation(dependency), [computation, dependency]);
};

// Virtual scrolling helper
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const buffer = Math.floor(visibleCount / 2);

    return {
      visibleCount: visibleCount + buffer * 2,
      startIndex: 0, // This would be calculated based on scroll position
      endIndex: Math.min(visibleCount + buffer * 2, items.length),
    };
  }, [items.length, itemHeight, containerHeight]);
};

// Memory leak prevention
export const useCleanupEffect = (cleanup: () => void) => {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  return useCallback(() => {
    return () => cleanupRef.current();
  }, []);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === "development") {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
  } else {
    fn();
  }
};

// Bundle size optimization helpers
export const lazyImport = <T extends Record<string, any>>(
  importFn: () => Promise<T>,
) => {
  return importFn;
};

// Memory usage tracker
export const trackMemoryUsage = () => {
  if ("memory" in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return null;
};

export default {
  useDebounce,
  useThrottle,
  memoizedComputation,
  useVirtualScrolling,
  useCleanupEffect,
  measurePerformance,
  lazyImport,
  trackMemoryUsage,
};
