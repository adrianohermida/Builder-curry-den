/**
 * 🎭 ANIMATION UTILITIES - MODERN CSS ANIMATIONS
 *
 * Animações limpas e performáticas para UX moderna
 */

// CSS Animation Classes
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  scaleIn: "animate-scale-in",
};

// Apply animation to element
export const applyAnimation = (
  element: HTMLElement,
  animation: keyof typeof animations,
) => {
  element.classList.add(animations[animation]);
};

// Remove animation from element
export const removeAnimation = (
  element: HTMLElement,
  animation: keyof typeof animations,
) => {
  element.classList.remove(animations[animation]);
};

// Apply fade in animation to page content
export const applyPageAnimation = () => {
  // Add fade-in animation to main content areas
  const contentAreas = document.querySelectorAll(
    'main, [role="main"], .page-content, .content-area',
  );

  contentAreas.forEach((area) => {
    if (area instanceof HTMLElement) {
      applyAnimation(area, "fadeIn");
    }
  });
};

// Initialize animations on page load
export const initializeAnimations = () => {
  // Add CSS for animations if not present
  if (!document.getElementById("modern-animations")) {
    const style = document.createElement("style");
    style.id = "modern-animations";
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }

      .animate-slide-up {
        animation: slideUp 0.4s ease-out;
      }

      .animate-scale-in {
        animation: scaleIn 0.2s ease-out;
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .animate-fade-in,
        .animate-slide-up,
        .animate-scale-in {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

export default {
  animations,
  applyAnimation,
  removeAnimation,
  applyPageAnimation,
  initializeAnimations,
};
