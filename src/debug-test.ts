/**
 * Debug Test Script
 *
 * This script verifies that all the environment and import fixes are working correctly.
 */

import { IS_DEVELOPMENT, IS_PRODUCTION, getNodeEnv, env } from "./lib/env";

// Test environment detection
console.log("🔧 Environment Tests:");
console.log("- Current environment:", getNodeEnv());
console.log("- Is development:", IS_DEVELOPMENT);
console.log("- Is production:", IS_PRODUCTION);
console.log("- Environment object:", env);

// Test API configuration
import { API_BASE_URLS, API_ENDPOINTS } from "./config/api";
console.log("\n🌐 API Configuration Tests:");
console.log("- Base URLs:", API_BASE_URLS);
console.log("- CRM Endpoints:", API_ENDPOINTS.CRM);

// Test CRM domain
import { useCRMStore } from "./domains/crm-juridico/store";
console.log("\n📊 CRM Store Test:");
console.log("- Store imported successfully");

// Test error handler
import { handleError } from "./lib/errorHandler";
console.log("\n🚨 Error Handler Test:");
console.log("- Error handler imported successfully");

try {
  handleError("Test error", "system", "low", { test: true });
  console.log("- Error handler working correctly");
} catch (error) {
  console.error("- Error handler failed:", error);
}

export default "Debug tests completed!";
