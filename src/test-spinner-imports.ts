/**
 * Test Spinner Component Imports
 *
 * This file tests that all spinner components can be imported correctly
 */

// Test shared Spinner component (both exports)
import {
  Spinner,
  LoadingSpinner as SharedLoadingSpinner,
} from "./shared/components/atoms/Spinner";

// Test UI LoadingSpinner component
import { LoadingSpinner } from "./components/ui/loading-spinner";

console.log("✅ All spinner imports successful!");
console.log("- Shared Spinner:", typeof Spinner);
console.log("- Shared LoadingSpinner (alias):", typeof SharedLoadingSpinner);
console.log("- UI LoadingSpinner:", typeof LoadingSpinner);

export default "Spinner imports test completed!";
