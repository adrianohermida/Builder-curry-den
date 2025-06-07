#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Files that need fixing
const filesToFix = [
  "src/pages/ConfiguracaoArmazenamento.tsx",
  "src/pages/Tickets.tsx",
  "src/pages/TesteConfiguracaoStorage.tsx",
  "src/pages/AI.tsx",
  "src/pages/Calendar.tsx",
  "src/components/Dashboard/DashboardCard.tsx",
  "src/components/Dashboard/IntegratedDashboard.tsx",
  "src/components/IA/IAAssistant.tsx",
  "src/components/GED/GEDSidebar.tsx",
  "src/components/GED/GEDUploadDialog.tsx",
  "src/components/ui/file-upload.tsx",
  "src/components/Settings/ConfigStorageProvider.tsx",
  "src/components/Layout/OptimizedLayout.tsx",
  "src/components/CRM/ClientProcesses.tsx",
  "src/components/CRM/ClientForm.tsx",
  "src/components/CRM/ClienteDetalhes.tsx",
  "src/components/CRM/ClientPublications.tsx",
  "src/components/CRM/ProcessosDoCliente.tsx",
  "src/components/CRM/ClienteCadastro.tsx",
  "src/components/CRM/PublicacoesCliente.tsx",
  "src/components/CRM/NotificationCenter.tsx",
];

// Replacement patterns
const replacements = [
  // Fix rgb(var(--theme-primary)) syntax
  {
    pattern: /rgb\(var\(--theme-primary\)\)/g,
    replacement: "hsl(var(--primary))",
  },
  {
    pattern: /text-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "text-primary",
  },
  {
    pattern: /bg-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "bg-primary",
  },
  {
    pattern: /border-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "border-primary",
  },
  {
    pattern: /ring-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "ring-primary",
  },
  {
    pattern: /hover:bg-\[rgb\(var\(--theme-primary\)\)\]\/90/g,
    replacement: "hover:bg-primary/90",
  },
  {
    pattern: /hover:bg-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "hover:bg-primary/80",
  },
  {
    pattern: /hover:text-\[rgb\(var\(--theme-primary\)\)\]/g,
    replacement: "hover:text-primary",
  },
  {
    pattern: /hover:border-\[rgb\(var\(--theme-primary\)\)\]\/50/g,
    replacement: "hover:border-primary/50",
  },
  // Fix other common hard-coded colors
  {
    pattern: /rgb\(99, 102, 241\)/g,
    replacement: "hsl(var(--primary))",
  },
  {
    pattern: /rgb\(236, 72, 153\)/g,
    replacement: "hsl(var(--primary))",
  },
  {
    pattern: /rgb\(34, 197, 94\)/g,
    replacement: "hsl(var(--success))",
  },
  {
    pattern: /rgb\(251, 191, 36\)/g,
    replacement: "hsl(var(--warning))",
  },
  {
    pattern: /rgb\(239, 68, 68\)/g,
    replacement: "hsl(var(--destructive))",
  },
  {
    pattern: /rgb\(168, 85, 247\)/g,
    replacement: "hsl(var(--primary))",
  },
  {
    pattern: /rgb\(14, 165, 233\)/g,
    replacement: "hsl(var(--primary))",
  },
  {
    pattern: /rgb\(245, 101, 101\)/g,
    replacement: "hsl(var(--destructive))",
  },
];

console.log("🔧 Fixing RGB syntax issues...");

filesToFix.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`⏩ No changes needed: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log("🎉 RGB syntax fix completed!");
