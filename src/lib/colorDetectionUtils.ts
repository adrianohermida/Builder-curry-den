/**
 * 🔍 COLOR DETECTION UTILS - DETECÇÃO EM TEMPO REAL
 *
 * Utilitários para detecção e correção de cores:
 * - Scan completo do DOM
 * - Correção automática de cores
 * - Monitoramento contínuo
 */

export interface ColorRule {
  forbidden: string[];
  replacement: string;
  property: "backgroundColor" | "color" | "borderColor";
}

export class ColorDetectionUtils {
  private static forbiddenColors = [
    "rgb(255, 255, 0)", // yellow
    "#FFFF00",
    "#ffff00",
    "yellow",
    "rgb(249, 115, 22)", // orange
    "#f97316",
    "rgb(193, 150, 108)", // beige/brown problematic
  ];

  static scanDocument(): {
    total: number;
    violations: Array<{
      element: HTMLElement;
      property: string;
      currentValue: string;
      suggestedValue: string;
    }>;
  } {
    const violations: Array<{
      element: HTMLElement;
      property: string;
      currentValue: string;
      suggestedValue: string;
    }> = [];

    const allElements = document.querySelectorAll("*");

    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const style = htmlElement.style;
      const computedStyle = window.getComputedStyle(htmlElement);

      // Check inline styles
      ["backgroundColor", "color", "borderColor"].forEach((property) => {
        const inlineValue = style.getPropertyValue(property);
        const computedValue = computedStyle.getPropertyValue(property);

        [inlineValue, computedValue].forEach((value) => {
          if (value && this.isForbiddenColor(value)) {
            violations.push({
              element: htmlElement,
              property,
              currentValue: value,
              suggestedValue: this.getSuggestedColor(property),
            });
          }
        });
      });
    });

    return {
      total: allElements.length,
      violations,
    };
  }

  static isForbiddenColor(color: string): boolean {
    return this.forbiddenColors.some((forbidden) =>
      color.toLowerCase().includes(forbidden.toLowerCase()),
    );
  }

  static getSuggestedColor(property: string): string {
    const isAdmin = document.documentElement.classList.contains("admin-theme");
    const isColor =
      document.documentElement.classList.contains("lawdesk-color");

    switch (property) {
      case "backgroundColor":
        if (isAdmin) return "rgb(239, 68, 68)"; // red-500
        if (isColor) return "rgb(124, 58, 237)"; // violet-600
        return "rgb(59, 130, 246)"; // blue-500

      case "color":
        if (isAdmin) return "rgb(185, 28, 28)"; // red-700
        return "rgb(30, 64, 175)"; // blue-800

      case "borderColor":
        if (isAdmin) return "rgb(252, 165, 165)"; // red-300
        if (isColor) return "rgb(221, 214, 254)"; // violet-200
        return "rgb(219, 234, 254)"; // blue-100

      default:
        return "rgb(59, 130, 246)"; // blue-500 default
    }
  }

  static fixElement(element: HTMLElement, property: string): boolean {
    try {
      const suggestedColor = this.getSuggestedColor(property);
      element.style.setProperty(property, suggestedColor, "important");
      return true;
    } catch (error) {
      console.warn("Failed to fix element:", error);
      return false;
    }
  }

  static fixAllViolations(): {
    fixed: number;
    failed: number;
    violations: Array<{
      element: HTMLElement;
      property: string;
      currentValue: string;
      suggestedValue: string;
    }>;
  } {
    const scan = this.scanDocument();
    let fixed = 0;
    let failed = 0;

    scan.violations.forEach((violation) => {
      if (this.fixElement(violation.element, violation.property)) {
        fixed++;
      } else {
        failed++;
      }
    });

    return {
      fixed,
      failed,
      violations: scan.violations,
    };
  }

  static generateReport(): string {
    const scan = this.scanDocument();

    const report = `
# 🔍 LAWDESK COLOR DETECTION REPORT

## 📊 Summary
- **Total Elements Scanned**: ${scan.total}
- **Color Violations Found**: ${scan.violations.length}

## ❌ Violations Found

${scan.violations
  .map(
    (violation, index) => `
### Violation ${index + 1}
- **Element**: ${violation.element.tagName}${violation.element.className ? ` (${violation.element.className})` : ""}
- **Property**: ${violation.property}
- **Current Value**: ${violation.currentValue}
- **Suggested Fix**: ${violation.suggestedValue}
`,
  )
  .join("")}

## 🎯 Recommendations

${
  scan.violations.length === 0
    ? "✅ **No violations found!** The color system is working correctly."
    : `❌ **${scan.violations.length} violations need fixing.** Run ColorDetectionUtils.fixAllViolations() to auto-fix.`
}

---
Generated: ${new Date().toLocaleString()}
    `;

    return report;
  }

  static startContinuousMonitoring(interval: number = 2000): () => void {
    const monitor = setInterval(() => {
      const result = this.fixAllViolations();
      if (result.fixed > 0) {
        console.log(
          `🎨 Lawdesk Color Monitor: Fixed ${result.fixed} violations`,
        );
      }
    }, interval);

    return () => clearInterval(monitor);
  }
}

// Global utility functions
export const scanColors = () => ColorDetectionUtils.scanDocument();
export const fixColors = () => ColorDetectionUtils.fixAllViolations();
export const generateColorReport = () => ColorDetectionUtils.generateReport();
export const startColorMonitoring = (interval?: number) =>
  ColorDetectionUtils.startContinuousMonitoring(interval);

// Make available globally for debugging
if (typeof window !== "undefined") {
  (window as any).lawdeskColorUtils = {
    scan: scanColors,
    fix: fixColors,
    report: generateColorReport,
    monitor: startColorMonitoring,
  };
}
