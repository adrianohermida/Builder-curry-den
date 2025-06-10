/**
 * SYSTEM TEST COMPONENT
 * Quick test to verify all imports and functions are working
 */

import React, { useEffect } from "react";
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

const SystemTest: React.FC = () => {
  useEffect(() => {
    console.log("🔍 Testing system functions...");

    try {
      // Test theme functionality
      const theme = ultimateDesignSystem.performance.getStoredTheme();
      console.log("✅ Theme loaded:", theme);

      // Test CSS properties generation
      const cssProps = ultimateDesignSystem.generateCSSCustomProperties(theme);
      console.log("✅ CSS Properties generated:", Object.keys(cssProps).length);

      // Test performance utilities
      performanceUtils.loadingPerformance.preloadCriticalResources();
      console.log("✅ Critical resources preloaded");

      // Test color violation detector
      const violations =
        ultimateDesignSystem.colorViolationDetector.scanForViolations();
      console.log("✅ Color violations scan:", violations.length);

      // Test accessibility announce
      performanceUtils.accessibilityUtils.announce(
        "System test successful",
        "polite",
      );
      console.log("✅ Accessibility announce working");

      console.log("🎉 All system functions working correctly!");
    } catch (error) {
      console.error("❌ System test failed:", error);
    }
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>System Test</h2>
      <p>Check the console for test results.</p>
    </div>
  );
};

export default SystemTest;
