import React from "react";
import { withResponsive } from "@/components/Layout/ResponsivePageWrapper";
import TestDashboard from "./TestDashboard";
import MobileDashboard from "./MobileDashboard";

// Usar o TestDashboard como versão desktop e MobileDashboard como versão mobile
export default withResponsive(
  MobileDashboard, // Mobile component
  TestDashboard, // Desktop component
  MobileDashboard, // Tablet component (usa mobile)
);
