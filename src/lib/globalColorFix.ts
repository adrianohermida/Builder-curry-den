/**
 * 🎨 GLOBAL YELLOW COLOR REPLACEMENT SCRIPT
 *
 * Script para aplicar substituições globais de cores amarelas
 * por cores orange em todo o sistema de forma automática
 */

import { colorReplacements, replaceYellowInClassName } from "./colorReplacer";

// Lista de seletores que comumente usam classes de cor
const COLOR_SELECTORS = [
  '[class*="yellow"]',
  '[class*="bg-yellow"]',
  '[class*="text-yellow"]',
  '[class*="border-yellow"]',
  '[class*="ring-yellow"]',
  '[class*="hover:bg-yellow"]',
  '[class*="hover:text-yellow"]',
  '[class*="dark:bg-yellow"]',
  '[class*="dark:text-yellow"]',
  '[class*="dark:border-yellow"]',
];

/**
 * Apply global yellow color replacements to DOM
 */
export const applyGlobalColorFix = () => {
  console.log("🎨 Aplicando correções globais de cor...");

  let elementsFixed = 0;

  COLOR_SELECTORS.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const originalClass = element.className;
          const fixedClass = replaceYellowInClassName(originalClass);

          if (originalClass !== fixedClass) {
            element.className = fixedClass;
            elementsFixed++;

            // Log the change for debugging
            console.log(`🔧 Fixed element: ${element.tagName.toLowerCase()}`, {
              original: originalClass,
              fixed: fixedClass,
            });
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error processing selector ${selector}:`, error);
    }
  });

  console.log(`✅ Correção aplicada a ${elementsFixed} elementos`);
  return elementsFixed;
};

/**
 * Fix inline styles that use yellow colors
 */
export const fixInlineStyles = () => {
  console.log("🎨 Corrigindo estilos inline...");

  let stylesFixed = 0;
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    if (element instanceof HTMLElement && element.style.length > 0) {
      let styleChanged = false;

      // Check background-color
      if (
        element.style.backgroundColor &&
        (element.style.backgroundColor.includes("yellow") ||
          element.style.backgroundColor.includes("rgb(255, 255, 0)") ||
          element.style.backgroundColor.includes("#FFFF00") ||
          element.style.backgroundColor.includes("#ffff00"))
      ) {
        element.style.backgroundColor = "rgb(249, 115, 22)"; // orange-500
        styleChanged = true;
      }

      // Check color
      if (
        element.style.color &&
        (element.style.color.includes("yellow") ||
          element.style.color.includes("rgb(255, 255, 0)") ||
          element.style.color.includes("#FFFF00") ||
          element.style.color.includes("#ffff00"))
      ) {
        element.style.color = "rgb(249, 115, 22)"; // orange-500
        styleChanged = true;
      }

      // Check border-color
      if (
        element.style.borderColor &&
        (element.style.borderColor.includes("yellow") ||
          element.style.borderColor.includes("rgb(255, 255, 0)") ||
          element.style.borderColor.includes("#FFFF00") ||
          element.style.borderColor.includes("#ffff00"))
      ) {
        element.style.borderColor = "rgb(249, 115, 22)"; // orange-500
        styleChanged = true;
      }

      if (styleChanged) {
        stylesFixed++;
        console.log(
          `🔧 Fixed inline styles on: ${element.tagName.toLowerCase()}`,
        );
      }
    }
  });

  console.log(`✅ Correção aplicada a ${stylesFixed} estilos inline`);
  return stylesFixed;
};

/**
 * Monitor for dynamically added elements and fix them
 */
export const initColorFixMonitor = () => {
  console.log("👁️ Iniciando monitor de correção de cores...");

  const observer = new MutationObserver((mutations) => {
    let needsFix = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the added element or its children have yellow classes
            const hasYellow =
              node.className?.includes("yellow") ||
              node.querySelector('[class*="yellow"]');

            if (hasYellow) {
              needsFix = true;
            }
          }
        });
      } else if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const element = mutation.target as HTMLElement;
        if (element.className?.includes("yellow")) {
          needsFix = true;
        }
      }
    });

    if (needsFix) {
      setTimeout(() => {
        applyGlobalColorFix();
        fixInlineStyles();
      }, 10);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  return observer;
};

/**
 * Complete color fix initialization
 */
export const initializeGlobalColorFix = () => {
  console.log("🚀 Inicializando sistema de correção global de cores...");

  // Apply initial fixes
  applyGlobalColorFix();
  fixInlineStyles();

  // Start monitoring for dynamic changes
  const observer = initColorFixMonitor();

  // Return cleanup function
  return () => {
    observer.disconnect();
    console.log("🛑 Monitor de correção de cores desconectado");
  };
};

/**
 * Fix specific component by selector
 */
export const fixComponentColors = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  let fixed = 0;

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      const originalClass = element.className;
      const fixedClass = replaceYellowInClassName(originalClass);

      if (originalClass !== fixedClass) {
        element.className = fixedClass;
        fixed++;
      }
    }
  });

  console.log(`🔧 Fixed ${fixed} elements for selector: ${selector}`);
  return fixed;
};

export default {
  applyGlobalColorFix,
  fixInlineStyles,
  initColorFixMonitor,
  initializeGlobalColorFix,
  fixComponentColors,
};
