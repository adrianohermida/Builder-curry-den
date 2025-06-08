import React from "react";
import { ResponsivePageWrapper } from "@/components/Layout/ResponsivePageWrapper";
import { useViewMode } from "@/contexts/ViewModeContext";
import TestDashboard from "./TestDashboard";
import MobileDashboard from "./MobileDashboard";
import MobileAdminDashboard from "./MobileAdminDashboard";

// Componente que escolhe a versão correta baseado no modo e device
function SmartDashboard() {
  const { isAdminMode } = useViewMode();

  if (isAdminMode) {
    // Admin mode: usar versão admin mobile ou desktop
    return (
      <ResponsivePageWrapper
        mobileComponent={MobileAdminDashboard}
        desktopComponent={TestDashboard} // Pode ser substituído por AdminDashboard desktop
        tabletComponent={MobileAdminDashboard}
      />
    );
  } else {
    // Client mode: usar versão cliente mobile ou desktop
    return (
      <ResponsivePageWrapper
        mobileComponent={MobileDashboard}
        desktopComponent={TestDashboard}
        tabletComponent={MobileDashboard}
      />
    );
  }
}

export default SmartDashboard;
