import React from "react";
import { useMobileDetection } from "@/hooks/useMobileDetection";

interface ResponsivePageWrapperProps {
  mobileComponent: React.ComponentType;
  desktopComponent: React.ComponentType;
  tabletComponent?: React.ComponentType;
}

export function ResponsivePageWrapper({
  mobileComponent: MobileComponent,
  desktopComponent: DesktopComponent,
  tabletComponent: TabletComponent,
}: ResponsivePageWrapperProps) {
  const { isMobile, isTablet } = useMobileDetection();

  // Mobile first approach
  if (isMobile) {
    return <MobileComponent />;
  }

  // Tablet specific component or fallback to mobile
  if (isTablet) {
    return TabletComponent ? <TabletComponent /> : <MobileComponent />;
  }

  // Desktop component
  return <DesktopComponent />;
}

// HOC for creating responsive pages
export function withResponsive<T extends object>(
  MobileComponent: React.ComponentType<T>,
  DesktopComponent: React.ComponentType<T>,
  TabletComponent?: React.ComponentType<T>,
) {
  return function ResponsivePage(props: T) {
    return (
      <ResponsivePageWrapper
        mobileComponent={() => <MobileComponent {...props} />}
        desktopComponent={() => <DesktopComponent {...props} />}
        tabletComponent={
          TabletComponent ? () => <TabletComponent {...props} /> : undefined
        }
      />
    );
  };
}
