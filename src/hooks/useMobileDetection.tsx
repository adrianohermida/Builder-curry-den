import { useState, useEffect } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  orientation: "portrait" | "landscape";
  touchDevice: boolean;
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    orientation: "landscape",
    touchDevice: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? "landscape" : "portrait";

      // Touch device detection
      const touchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      // Screen size breakpoints
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        orientation,
        touchDevice,
      });
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  return detection;
}

// Hook para selecionar componente baseado no device
export function useMobileComponent<T>(
  mobileComponent: T,
  desktopComponent: T,
  tabletComponent?: T,
): T {
  const { isMobile, isTablet } = useMobileDetection();

  if (isMobile) return mobileComponent;
  if (isTablet && tabletComponent) return tabletComponent;
  if (isTablet) return mobileComponent; // Fallback to mobile for tablet
  return desktopComponent;
}

// Utility para classes CSS responsivas
export function useResponsiveClass(
  mobileClass: string,
  desktopClass: string,
  tabletClass?: string,
): string {
  const { isMobile, isTablet } = useMobileDetection();

  if (isMobile) return mobileClass;
  if (isTablet && tabletClass) return tabletClass;
  if (isTablet) return mobileClass;
  return desktopClass;
}
