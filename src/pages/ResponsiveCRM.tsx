import React from "react";
import { withResponsive } from "@/components/Layout/ResponsivePageWrapper";
import CRM from "./CRM";
import MobileCRM from "./MobileCRM";

// CRM responsivo: mobile otimizado vs desktop completo
export default withResponsive(
  MobileCRM, // Mobile component - interface simplificada
  CRM, // Desktop component - interface completa
  MobileCRM, // Tablet component - usa mobile por ser touch-friendly
);
