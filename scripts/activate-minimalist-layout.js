#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE ATIVAÇÃO - LAYOUT MINIMALISTA CRM-V3-MINIMALIA
 *
 * Este script ativa o novo layout minimalista com segurança,
 * criando backups dos arquivos atuais.
 */

const fs = require("fs");
const path = require("path");

const CONFIG = {
  backupSuffix: ".backup-" + new Date().toISOString().slice(0, 10),
  srcDir: path.join(__dirname, "../src"),
  routerDir: path.join(__dirname, "../src/router"),
  appFile: path.join(__dirname, "../src/App.tsx"),
  logFile: path.join(__dirname, "../activation.log"),
};

// Função de log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(CONFIG.logFile, logMessage);
}

// Função para fazer backup de arquivo
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = filePath + CONFIG.backupSuffix;
    fs.copyFileSync(filePath, backupPath);
    log(`✅ Backup criado: ${path.basename(backupPath)}`);
    return true;
  }
  return false;
}

// Função para verificar dependências
function checkDependencies() {
  log("🔍 Verificando dependências...");

  const requiredFiles = [
    "src/components/Layout/MinimalistSaaSLayout.tsx",
    "src/components/CRM/MinimalistCRMDashboard.tsx",
    "src/pages/CRM/CRMMinimalist.tsx",
    "src/router/minimalist.tsx",
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, "..", file);
    if (!fs.existsSync(fullPath)) {
      log(`❌ Arquivo necessário não encontrado: ${file}`);
      return false;
    }
  }

  log("✅ Todas as dependências encontradas");
  return true;
}

// Função para ativar router minimalista
function activateMinimalistRouter() {
  log("🔄 Ativando router minimalista...");

  const currentRouter = path.join(CONFIG.routerDir, "corrected.tsx");
  const minimalistRouter = path.join(CONFIG.routerDir, "minimalist.tsx");

  // Backup do router atual
  if (backupFile(currentRouter)) {
    // Copiar router minimalista
    if (fs.existsSync(minimalistRouter)) {
      fs.copyFileSync(minimalistRouter, currentRouter);
      log("✅ Router minimalista ativado");
      return true;
    } else {
      log("❌ Router minimalista não encontrado");
      return false;
    }
  }

  return false;
}

// Função para atualizar App.tsx (se necessário)
function updateAppFile() {
  log("🔄 Verificando App.tsx...");

  if (fs.existsSync(CONFIG.appFile)) {
    const content = fs.readFileSync(CONFIG.appFile, "utf8");

    // Verificar se já está usando o router correto
    if (content.includes("corrected")) {
      log("✅ App.tsx já configurado para usar router corrected");
      return true;
    } else {
      log("⚠️  App.tsx pode precisar de ajustes manuais");
      return true;
    }
  }

  log("❌ App.tsx não encontrado");
  return false;
}

// Função para criar arquivo de status
function createStatusFile() {
  const status = {
    version: "CRM-V3-MINIMALIA",
    activated: new Date().toISOString(),
    layout: "MinimalistSaaSLayout",
    router: "minimalist",
    features: [
      "Layout SaaS 2025",
      "Widgets colapsáveis",
      "Quick actions",
      "IA contextual",
      "Filtros sticky",
      "Menu contextual",
      "Busca global",
      "Navegação fluida",
    ],
    status: "active",
  };

  fs.writeFileSync(
    path.join(__dirname, "../MINIMALIST_STATUS.json"),
    JSON.stringify(status, null, 2),
  );

  log("✅ Arquivo de status criado");
}

// Função para mostrar próximos passos
function showNextSteps() {
  log("\n🎉 ATIVAÇÃO CONCLUÍDA!\n");
  log("📋 PRÓXIMOS PASSOS:");
  log("1. Reinicie o servidor de desenvolvimento");
  log("2. Acesse /painel para ver o novo layout");
  log("3. Teste as funcionalidades:");
  log("   - Busca global (⌘K)");
  log("   - Quick actions (+Cliente, +Processo)");
  log("   - Widgets colapsáveis");
  log("   - Menu contextual (3 pontos)");
  log("   - Filtros sticky");
  log("4. Verifique responsividade em mobile");
  log("5. Configure personalização se necessário\n");
  log("📄 Documentação: MINIMALIST_LAYOUT_SUMMARY.md");
  log("🔄 Para reverter: use os arquivos .backup-*");
}

// Função principal
function main() {
  log("🚀 INICIANDO ATIVAÇÃO DO LAYOUT MINIMALISTA CRM-V3-MINIMALIA\n");

  try {
    // Verificar dependências
    if (!checkDependencies()) {
      log("❌ Falha na verificação de dependências");
      process.exit(1);
    }

    // Ativar router minimalista
    if (!activateMinimalistRouter()) {
      log("❌ Falha ao ativar router minimalista");
      process.exit(1);
    }

    // Verificar App.tsx
    if (!updateAppFile()) {
      log("⚠️  Problemas com App.tsx - verificação manual necessária");
    }

    // Criar arquivo de status
    createStatusFile();

    // Mostrar próximos passos
    showNextSteps();

    log("✅ ATIVAÇÃO CONCLUÍDA COM SUCESSO!");
  } catch (error) {
    log(`❌ ERRO DURANTE ATIVAÇÃO: ${error.message}`);
    process.exit(1);
  }
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };
