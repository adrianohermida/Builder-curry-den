/**
 * useResponsive Hook
 *
 * A React hook for detecting responsive breakpoints and screen sizes.
 * Provides consistent breakpoint detection across the application.
 */

import { useState, useEffect } from "react";
import { BREAKPOINT_VALUES } from "@/config/constants";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  width: number;
  height: number;
  breakpoint: "mobile" | "tablet" | "desktop" | "large" | "xlarge";
}

/**
 * Hook for responsive breakpoint detection
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLarge: false,
        isXLarge: false,
        width: 1200,
        height: 800,
        breakpoint: "desktop" as const,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: width < BREAKPOINT_VALUES.MD,
      isTablet: width >= BREAKPOINT_VALUES.MD && width < BREAKPOINT_VALUES.LG,
      isDesktop: width >= BREAKPOINT_VALUES.LG && width < BREAKPOINT_VALUES.XL,
      isLarge:
        width >= BREAKPOINT_VALUES.XL && width < BREAKPOINT_VALUES["2XL"],
      isXLarge: width >= BREAKPOINT_VALUES["2XL"],
      width,
      height,
      breakpoint: getBreakpoint(width),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < BREAKPOINT_VALUES.MD,
        isTablet: width >= BREAKPOINT_VALUES.MD && width < BREAKPOINT_VALUES.LG,
        isDesktop:
          width >= BREAKPOINT_VALUES.LG && width < BREAKPOINT_VALUES.XL,
        isLarge:
          width >= BREAKPOINT_VALUES.XL && width < BREAKPOINT_VALUES["2XL"],
        isXLarge: width >= BREAKPOINT_VALUES["2XL"],
        width,
        height,
        breakpoint: getBreakpoint(width),
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}

/**
 * Get breakpoint name from width
 */
function getBreakpoint(width: number): ResponsiveState["breakpoint"] {
  if (width < BREAKPOINT_VALUES.MD) return "mobile";
  if (width < BREAKPOINT_VALUES.LG) return "tablet";
  if (width < BREAKPOINT_VALUES.XL) return "desktop";
  if (width < BREAKPOINT_VALUES["2XL"]) return "large";
  return "xlarge";
}

export default useResponsive;
