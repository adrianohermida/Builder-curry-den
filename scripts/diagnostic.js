#!/usr/bin/env node

/**
 * Quick Performance & Health Diagnostic Script
 * Runs automated checks on the Lawdesk CRM application
 */

const fs = require("fs");
const path = require("path");

class DiagnosticRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: [],
      summary: { passed: 0, failed: 0, warnings: 0 },
    };
  }

  log(message, type = "info") {
    const colors = {
      info: "\x1b[36m", // Cyan
      success: "\x1b[32m", // Green
      warning: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      reset: "\x1b[0m", // Reset
    };

    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  addCheck(name, status, details = "", recommendation = "") {
    this.results.checks.push({
      name,
      status, // 'pass', 'fail', 'warning'
      details,
      recommendation,
      timestamp: new Date().toISOString(),
    });

    this.results.summary[
      status === "pass" ? "passed" : status === "fail" ? "failed" : "warnings"
    ]++;
  }

  // Check if essential files exist
  checkProjectStructure() {
    this.log("\n🔍 Checking project structure...", "info");

    const essentialFiles = [
      "package.json",
      "src/App.tsx",
      "src/main.tsx",
      "src/components/Layout/MainLayout.tsx",
      "src/pages/CRM/CRMUnificado.tsx",
      "vite.config.ts",
      "tailwind.config.ts",
    ];

    let allExist = true;
    const missing = [];

    essentialFiles.forEach((file) => {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        this.log(`  ✅ ${file}`, "success");
      } else {
        this.log(`  ❌ ${file} - Missing`, "error");
        allExist = false;
        missing.push(file);
      }
    });

    this.addCheck(
      "Project Structure",
      allExist ? "pass" : "fail",
      allExist
        ? "All essential files present"
        : `Missing files: ${missing.join(", ")}`,
      allExist ? "" : "Restore missing files from backup or recreate them",
    );
  }

  // Check package.json for issues
  checkDependencies() {
    this.log("\n📦 Checking dependencies...", "info");

    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const depsCount = Object.keys(deps).length;
      this.log(`  📊 Total dependencies: ${depsCount}`, "info");

      // Check for known problem packages
      const problematicPackages = [];
      if (deps["react"] && deps["react"].startsWith("^18")) {
        problematicPackages.push(
          "React 18 detected - ensure Suspense compatibility",
        );
      }

      this.addCheck(
        "Dependencies",
        depsCount > 0 && depsCount < 200 ? "pass" : "warning",
        `${depsCount} packages installed. ${problematicPackages.join(", ")}`,
        depsCount > 200
          ? "Consider dependency audit to reduce bundle size"
          : "",
      );
    } catch (error) {
      this.addCheck(
        "Dependencies",
        "fail",
        "Cannot read package.json",
        "Check package.json syntax",
      );
    }
  }

  // Check for TypeScript issues
  checkTypeScript() {
    this.log("\n🔷 Checking TypeScript configuration...", "info");

    const tsConfigExists = fs.existsSync("tsconfig.json");
    if (tsConfigExists) {
      this.log("  ✅ tsconfig.json found", "success");

      try {
        const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
        const strict = tsConfig.compilerOptions?.strict;

        this.addCheck(
          "TypeScript Config",
          "pass",
          `Strict mode: ${strict ? "enabled" : "disabled"}`,
          !strict ? "Enable strict mode for better type safety" : "",
        );
      } catch (error) {
        this.addCheck(
          "TypeScript Config",
          "fail",
          "Invalid tsconfig.json",
          "Fix JSON syntax in tsconfig.json",
        );
      }
    } else {
      this.addCheck(
        "TypeScript Config",
        "fail",
        "tsconfig.json missing",
        "Create tsconfig.json",
      );
    }
  }

  // Check bundle and build artifacts
  checkBuildArtifacts() {
    this.log("\n🏗️ Checking build artifacts...", "info");

    const distExists = fs.existsSync("dist");
    if (distExists) {
      try {
        const files = fs.readdirSync("dist");
        const hasIndex = files.some((f) => f.includes("index.html"));
        const hasAssets = files.some((f) => f === "assets");

        this.log(`  📁 Build files: ${files.length}`, "info");
        this.log(
          `  ${hasIndex ? "✅" : "❌"} index.html`,
          hasIndex ? "success" : "error",
        );
        this.log(
          `  ${hasAssets ? "✅" : "❌"} assets/`,
          hasAssets ? "success" : "error",
        );

        this.addCheck(
          "Build Artifacts",
          hasIndex && hasAssets ? "pass" : "warning",
          `${files.length} files in dist/, index: ${hasIndex}, assets: ${hasAssets}`,
          !hasIndex || !hasAssets
            ? "Run npm run build to generate artifacts"
            : "",
        );
      } catch (error) {
        this.addCheck(
          "Build Artifacts",
          "fail",
          "Cannot read dist/",
          "Check dist/ permissions",
        );
      }
    } else {
      this.addCheck(
        "Build Artifacts",
        "warning",
        "No dist/ directory",
        "Run npm run build",
      );
    }
  }

  // Check for common issues in source files
  checkSourceCode() {
    this.log("\n📝 Checking source code quality...", "info");

    const issues = [];

    // Check for console.log in src (basic check)
    try {
      const checkFile = (file) => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf8");
          const consoleCount = (
            content.match(/console\.(log|error|warn)/g) || []
          ).length;
          return consoleCount;
        }
        return 0;
      };

      const mainConsoles = checkFile("src/App.tsx");
      const layoutConsoles = checkFile("src/components/Layout/MainLayout.tsx");

      const totalConsoles = mainConsoles + layoutConsoles;

      if (totalConsoles > 5) {
        issues.push(`${totalConsoles} console statements found`);
      }

      this.log(
        `  🔍 Console statements: ${totalConsoles}`,
        totalConsoles > 10 ? "warning" : "info",
      );
    } catch (error) {
      issues.push("Could not analyze source files");
    }

    this.addCheck(
      "Source Code Quality",
      issues.length === 0 ? "pass" : "warning",
      issues.length === 0 ? "No major issues detected" : issues.join(", "),
      issues.length > 0
        ? "Review and clean up console statements for production"
        : "",
    );
  }

  // Generate summary report
  generateReport() {
    this.log("\n📊 DIAGNOSTIC SUMMARY", "info");
    this.log("─".repeat(50), "info");

    const { passed, failed, warnings } = this.results.summary;

    this.log(`✅ Passed: ${passed}`, "success");
    if (warnings > 0) this.log(`⚠️  Warnings: ${warnings}`, "warning");
    if (failed > 0) this.log(`❌ Failed: ${failed}`, "error");

    this.log("\n📋 DETAILED RESULTS:", "info");

    this.results.checks.forEach((check) => {
      const icon =
        check.status === "pass"
          ? "✅"
          : check.status === "warning"
            ? "⚠️"
            : "❌";
      const color =
        check.status === "pass"
          ? "success"
          : check.status === "warning"
            ? "warning"
            : "error";

      this.log(`\n${icon} ${check.name}`, color);
      if (check.details) this.log(`   ${check.details}`, "info");
      if (check.recommendation)
        this.log(`   💡 ${check.recommendation}`, "warning");
    });

    // Overall health
    const healthScore = Math.round(
      (passed / (passed + failed + warnings)) * 100,
    );
    this.log(
      `\n🏥 Overall Health Score: ${healthScore}%`,
      healthScore > 80 ? "success" : healthScore > 60 ? "warning" : "error",
    );

    if (healthScore > 80) {
      this.log("🎉 System is in excellent condition!", "success");
    } else if (healthScore > 60) {
      this.log("⚠️  System needs some attention", "warning");
    } else {
      this.log("🚨 System requires immediate fixes", "error");
    }

    // Save report to file
    fs.writeFileSync(
      "diagnostic-report.json",
      JSON.stringify(this.results, null, 2),
    );
    this.log("\n💾 Report saved to diagnostic-report.json", "info");
  }

  // Run all diagnostic checks
  async run() {
    this.log("🏁 LAWDESK CRM - SYSTEM DIAGNOSTIC", "info");
    this.log("═".repeat(50), "info");

    this.checkProjectStructure();
    this.checkDependencies();
    this.checkTypeScript();
    this.checkBuildArtifacts();
    this.checkSourceCode();

    this.generateReport();
  }
}

// Run diagnostics if called directly
if (require.main === module) {
  const diagnostic = new DiagnosticRunner();
  diagnostic.run().catch(console.error);
}

module.exports = DiagnosticRunner;
