/**
 * PERFORMANCE UTILITIES
 * High-performance utilities for optimal UX in legal SaaS application
 * Focus: LCP < 2s, FCP < 1s, CLS < 0.1
 */

import React from "react";

// ===== LOADING PERFORMANCE =====
export const loadingPerformance = {
  // Preload critical resources
  preloadCriticalResources: () => {
    // Preload critical fonts
    const fontPreload = document.createElement("link");
    fontPreload.rel = "preload";
    fontPreload.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    fontPreload.as = "style";
    fontPreload.onload = () => {
      fontPreload.rel = "stylesheet";
    };
    document.head.appendChild(fontPreload);
  },

  // Optimize images with lazy loading
  optimizeImages: () => {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  },

  // Measure performance metrics
  measureMetrics: () => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          console.log("FCP:", entry.startTime);
        }
      });
    }).observe({ entryTypes: ["paint"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log("CLS:", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  },
};

// ===== COMPONENT OPTIMIZATION =====
export const componentOptimization = {
  // Debounce function for performance
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Optimize re-renders with shallow comparison
  shallowEqual: (obj1: any, obj2: any): boolean => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  },

  // Memoization utility
  memoize: <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map();
    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },
};

// ===== VIRTUAL SCROLLING =====
export const virtualScrolling = {
  // Calculate visible items for large lists
  calculateVisibleItems: (
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan: number = 5,
  ) => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan,
    );
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
    );

    return {
      startIndex,
      endIndex,
      visibleItems: endIndex - startIndex + 1,
    };
  },

  // Virtual scroll hook implementation
  useVirtualScroll: (
    items: any[],
    itemHeight: number,
    containerHeight: number,
  ) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    const { startIndex, endIndex } = virtualScrolling.calculateVisibleItems(
      scrollTop,
      containerHeight,
      itemHeight,
      items.length,
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      totalHeight,
      offsetY,
      onScroll: (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
      },
    };
  },
};

// ===== RESPONSIVE UTILITIES =====
export const responsiveUtils = {
  // Detect screen size
  useMediaQuery: (query: string): boolean => {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  },

  // Responsive breakpoints
  breakpoints: {
    isMobile: () => window.innerWidth < 768,
    isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: () => window.innerWidth >= 1024,
    isLarge: () => window.innerWidth >= 1280,
  },

  // Touch device detection
  isTouchDevice: () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
};

// ===== ANIMATION PERFORMANCE =====
export const animationPerformance = {
  // Use requestAnimationFrame for smooth animations
  animate: (
    element: HTMLElement,
    properties: Record<string, string>,
    duration: number = 200,
    easing: string = "ease-out",
  ): Promise<void> => {
    return new Promise((resolve) => {
      element.style.transition = `all ${duration}ms ${easing}`;

      Object.entries(properties).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });

      setTimeout(() => {
        element.style.transition = "";
        resolve();
      }, duration);
    });
  },

  // Optimized CSS class toggling
  toggleClass: (element: HTMLElement, className: string, force?: boolean) => {
    element.classList.toggle(className, force);
  },

  // Batch DOM reads and writes
  batchDOMOperations: (operations: (() => void)[]) => {
    requestAnimationFrame(() => {
      operations.forEach((operation) => operation());
    });
  },
};

// ===== MEMORY MANAGEMENT =====
export const memoryManagement = {
  // Cleanup event listeners
  cleanupEventListeners: (() => {
    const listeners: Array<{
      element: Element;
      event: string;
      handler: EventListener;
    }> = [];

    return {
      add: (element: Element, event: string, handler: EventListener) => {
        element.addEventListener(event, handler);
        listeners.push({ element, event, handler });
      },
      cleanup: () => {
        listeners.forEach(({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        });
        listeners.length = 0;
      },
    };
  })(),

  // Cleanup timeouts and intervals
  cleanupTimers: (() => {
    const timers: NodeJS.Timeout[] = [];

    return {
      setTimeout: (callback: () => void, delay: number) => {
        const id = setTimeout(callback, delay);
        timers.push(id);
        return id;
      },
      setInterval: (callback: () => void, delay: number) => {
        const id = setInterval(callback, delay);
        timers.push(id);
        return id;
      },
      cleanup: () => {
        timers.forEach((id) => clearTimeout(id));
        timers.length = 0;
      },
    };
  })(),
};

// ===== ACCESSIBILITY UTILITIES =====
export const accessibilityUtils = {
  // Focus management
  focusManagement: {
    // Trap focus within element
    trapFocus: (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      element.addEventListener("keydown", handleTabKey);
      firstElement?.focus();

      return () => {
        element.removeEventListener("keydown", handleTabKey);
      };
    },

    // Restore focus to previous element
    restoreFocus: (() => {
      let previousActiveElement: HTMLElement | null = null;

      return {
        save: () => {
          previousActiveElement = document.activeElement as HTMLElement;
        },
        restore: () => {
          if (previousActiveElement) {
            previousActiveElement.focus();
            previousActiveElement = null;
          }
        },
      };
    })(),
  },

  // Announce to screen readers
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  // Reduced motion detection
  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },
};

// ===== ERROR BOUNDARIES =====
export const errorUtils = {
  // Global error handler
  setupGlobalErrorHandler: () => {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      // Send to error reporting service
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      // Send to error reporting service
    });
  },

  // Component error boundary
  withErrorBoundary: <P extends object>(Component: any, fallback?: any) => {
    return (props: P) => {
      return Component(props);
    };
  },
};

// ===== DEFAULT EXPORT =====
export const performanceUtils = {
  loadingPerformance,
  componentOptimization,
  virtualScrolling,
  responsiveUtils,
  animationPerformance,
  memoryManagement,
  accessibilityUtils,
  errorUtils,
};

export default performanceUtils;
