/**
 * Shared Hooks
 *
 * Central exports for all shared React hooks that can be used
 * across different features and domains.
 */

// Storage hooks
export { useLocalStorage } from "./useLocalStorage";
export { useSessionStorage } from "./useSessionStorage";

// UI hooks
export { useResponsive } from "./useResponsive";
export { useDebounce } from "./useDebounce";
export { useClickOutside } from "./useClickOutside";
export { useToggle } from "./useToggle";
export { useCopyToClipboard } from "./useCopyToClipboard";

// Form hooks
export { useForm } from "./useForm";
export { useFormValidation } from "./useFormValidation";

// API hooks
export { useApi } from "./useApi";
export { usePagination } from "./usePagination";

// Performance hooks
export { useAsyncEffect } from "./useAsyncEffect";
export { useMemoCompare } from "./useMemoCompare";
export { useThrottle } from "./useThrottle";

// State management hooks
export { usePersistedState } from "./usePersistedState";
export { useStateHistory } from "./useStateHistory";
