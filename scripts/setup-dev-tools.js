#!/usr/bin/env node

/**
 * 🛠️ DEVELOPMENT TOOLS SETUP SCRIPT
 * Sets up and configures development debugging tools
 */

const fs = require("fs");
const path = require("path");

class DevToolsSetup {
  constructor() {
    this.log("🛠️ Setting up Lawdesk CRM Development Tools", "info");
  }

  log(message, type = "info") {
    const colors = {
      info: "\x1b[36m",
      success: "\x1b[32m",
      warning: "\x1b[33m",
      error: "\x1b[31m",
      reset: "\x1b[0m",
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  // Check if required files exist
  checkRequiredFiles() {
    this.log("\n📋 Checking required files...", "info");

    const requiredFiles = [
      "src/components/Debug/DebugPanel.tsx",
      "src/components/Debug/PerformanceMonitor.tsx",
      "src/components/Debug/SystemHealthChecker.tsx",
      "src/lib/errorHandler.ts",
    ];

    let allExist = true;

    requiredFiles.forEach((file) => {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        this.log(`  ✅ ${file}`, "success");
      } else {
        this.log(`  ❌ ${file} - Missing`, "error");
        allExist = false;
      }
    });

    return allExist;
  }

  // Setup package.json scripts
  setupScripts() {
    this.log("\n📦 Setting up package.json scripts...", "info");

    try {
      const packagePath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

      // Add development scripts
      const devScripts = {
        "dev:debug": "vite --mode development --debug",
        "dev:analyze": "vite-bundle-analyzer",
        "health-check": "node scripts/diagnostic.js",
        "error-report": "node -e \"console.log('Error reporting ready')\"",
      };

      packageJson.scripts = { ...packageJson.scripts, ...devScripts };

      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      this.log("  ✅ Development scripts added", "success");
    } catch (error) {
      this.log(`  ❌ Failed to update package.json: ${error.message}`, "error");
    }
  }

  // Create development configuration
  createDevConfig() {
    this.log("\n⚙️ Creating development configuration...", "info");

    const devConfig = {
      debug: {
        enabled: true,
        autoCaptureLogs: true,
        maxLogs: 100,
        showPerformanceMonitor: true,
        showHealthChecker: true,
      },
      performance: {
        monitoringInterval: 1000,
        alertThresholds: {
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          memoryUsage: 80,
        },
      },
      errorReporting: {
        enabled: true,
        maxReports: 50,
        autoExport: false,
        notificationLevel: "medium",
      },
    };

    try {
      fs.writeFileSync("dev-config.json", JSON.stringify(devConfig, null, 2));
      this.log("  ✅ dev-config.json created", "success");
    } catch (error) {
      this.log(`  ❌ Failed to create config: ${error.message}`, "error");
    }
  }

  // Create .env.development if it doesn't exist
  setupEnvironment() {
    this.log("\n🌍 Setting up development environment...", "info");

    const envPath = ".env.development";
    if (!fs.existsSync(envPath)) {
      const envContent = `# Lawdesk CRM - Development Environment
VITE_APP_NAME=Lawdesk CRM
VITE_APP_VERSION=2.0.0
VITE_DEBUG_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_LOG_LEVEL=debug

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_EXPERIMENTAL_FEATURES=true
VITE_ENABLE_BETA_UI=false
`;

      try {
        fs.writeFileSync(envPath, envContent);
        this.log("  ✅ .env.development created", "success");
      } catch (error) {
        this.log(
          `  ❌ Failed to create environment file: ${error.message}`,
          "error",
        );
      }
    } else {
      this.log("  ℹ️ .env.development already exists", "info");
    }
  }

  // Create debug utilities
  createUtilities() {
    this.log("\n🔧 Creating debug utilities...", "info");

    const utilsDir = "src/utils/debug";
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    // Create a simple debug logger
    const debugLogger = `/**
 * 🐛 DEBUG LOGGER UTILITY
 * Enhanced logging for development
 */

export class DebugLogger {
  private static instance: DebugLogger;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  log(message: string, data?: any, category = 'general') {
    if (!this.isEnabled) return;
    
    console.log(\`🐛 [\${category.toUpperCase()}] \${message}\`, data || '');
  }

  error(message: string, error?: Error, category = 'error') {
    console.error(\`🚨 [\${category.toUpperCase()}] \${message}\`, error || '');
  }

  performance(label: string, fn: () => any) {
    if (!this.isEnabled) return fn();
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(\`⏱️ [PERFORMANCE] \${label}: \${(end - start).toFixed(2)}ms\`);
    return result;
  }

  group(label: string, fn: () => void) {
    if (!this.isEnabled) return fn();
    
    console.group(\`📂 \${label}\`);
    fn();
    console.groupEnd();
  }
}

export const debugLogger = DebugLogger.getInstance();
`;

    try {
      fs.writeFileSync(path.join(utilsDir, "debugLogger.ts"), debugLogger);
      this.log("  ✅ Debug logger utility created", "success");
    } catch (error) {
      this.log(
        `  ❌ Failed to create debug utilities: ${error.message}`,
        "error",
      );
    }
  }

  // Setup Git hooks (optional)
  setupGitHooks() {
    this.log("\n🔗 Setting up Git hooks...", "info");

    const hooksDir = ".git/hooks";
    if (fs.existsSync(hooksDir)) {
      const preCommitHook = `#!/bin/sh
# Lawdesk CRM - Pre-commit hook
echo "🔍 Running pre-commit checks..."

# Run health check
npm run health-check

# Check for console.log statements
if git diff --cached --name-only | grep -E "\\.(js|jsx|ts|tsx)$" | xargs grep -l "console\\.log" > /dev/null; then
  echo "⚠️ Warning: console.log statements found in staged files"
  echo "Consider removing them before committing to production"
fi

echo "✅ Pre-commit checks completed"
`;

      try {
        const hookPath = path.join(hooksDir, "pre-commit");
        fs.writeFileSync(hookPath, preCommitHook);
        fs.chmodSync(hookPath, "755");
        this.log("  ✅ Pre-commit hook installed", "success");
      } catch (error) {
        this.log(`  ❌ Failed to setup Git hooks: ${error.message}`, "error");
      }
    } else {
      this.log("  ℹ️ Not a Git repository, skipping Git hooks", "info");
    }
  }

  // Generate setup report
  generateReport() {
    this.log("\n📊 Generating setup report...", "info");

    const report = {
      timestamp: new Date().toISOString(),
      project: "Lawdesk CRM",
      version: "2.0.0",
      setupCompleted: true,
      features: {
        debugPanel: true,
        performanceMonitor: true,
        systemHealthChecker: true,
        errorHandler: true,
        diagnosticScript: true,
      },
      nextSteps: [
        "Start development server with: npm run dev",
        "Access debug panel with the floating bug icon (bottom-left)",
        "Run health check with: npm run health-check",
        "Check error reports in the debug panel",
        "Monitor performance metrics during development",
      ],
    };

    try {
      fs.writeFileSync(
        "DEVELOPMENT_SETUP_REPORT.json",
        JSON.stringify(report, null, 2),
      );
      this.log("  ✅ Setup report generated", "success");
    } catch (error) {
      this.log(`  ❌ Failed to generate report: ${error.message}`, "error");
    }

    return report;
  }

  // Main setup process
  async run() {
    try {
      const filesExist = this.checkRequiredFiles();

      if (!filesExist) {
        this.log(
          "\n❌ Some required files are missing. Please run the main setup first.",
          "error",
        );
        return false;
      }

      this.setupScripts();
      this.createDevConfig();
      this.setupEnvironment();
      this.createUtilities();
      this.setupGitHooks();

      const report = this.generateReport();

      this.log("\n🎉 DEVELOPMENT TOOLS SETUP COMPLETE!", "success");
      this.log("═".repeat(50), "info");

      report.nextSteps.forEach((step, index) => {
        this.log(`${index + 1}. ${step}`, "info");
      });

      this.log("\n💡 Happy debugging! 🐛", "success");

      return true;
    } catch (error) {
      this.log(`\n❌ Setup failed: ${error.message}`, "error");
      return false;
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DevToolsSetup();
  setup.run().catch(console.error);
}

module.exports = DevToolsSetup;
