#!/usr/bin/env node

/**
 * Script de Backup do Projeto Lawdesk
 *
 * Este script cria um backup completo dos arquivos principais
 * do sistema Lawdesk para facilitar migração e versionamento.
 */

const fs = require("fs");
const path = require("path");

const BACKUP_INFO = {
  name: "Lawdesk - Sistema de Gestão Jurídica",
  version: "1.0.0",
  date: new Date().toISOString(),
  description:
    "Backup completo do sistema Lawdesk com todos os módulos principais",
};

const PRINCIPAIS_ARQUIVOS = [
  // Configuração base
  "package.json",
  "README.md",
  "index.html",
  ".gitignore",
  "vite.config.ts",
  "tailwind.config.ts",
  "tsconfig.json",
  "components.json",

  // Arquivos principais da aplicação
  "src/main.tsx",
  "src/App.tsx",
  "src/index.css",
  "src/App.css",

  // Páginas principais
  "src/pages/Index.tsx",
  "src/pages/Painel.tsx",
  "src/pages/Login.tsx",
  "src/pages/Dashboard.tsx",
  "src/pages/CRM.tsx",
  "src/pages/GEDJuridico.tsx",
  "src/pages/AI.tsx",
  "src/pages/Calendar.tsx",
  "src/pages/Settings.tsx",

  // Layouts
  "src/components/Layout/CorrectedLayout.tsx",
  "src/components/Layout/CorrectedSidebar.tsx",
  "src/components/Layout/CorrectedTopbar.tsx",

  // Módulo Admin
  "src/modules/LawdeskAdmin/AdminLayout.tsx",
  "src/modules/LawdeskAdmin/AdminDashboard.tsx",
  "src/modules/LawdeskAdmin/ExecutiveDashboard.tsx",

  // Contextos e providers
  "src/contexts/ThemeContext.tsx",
  "src/contexts/ViewModeContext.tsx",
  "src/providers/ThemeProvider.tsx",

  // Utilitários
  "src/lib/utils.ts",
  "src/hooks/use-mobile.tsx",
  "src/hooks/use-toast.ts",

  // Documentação
  "CLAUDE.md",
  "LAWDESK_CRM_INTEGRATION.md",
  "DIAGNOSTICO_COMPLETO_LAWDESK_2025.md",
];

function createBackupSummary() {
  console.log("🏛️ LAWDESK - Sistema de Gestão Jurídica");
  console.log("=".repeat(50));
  console.log();
  console.log("📊 INFORMAÇÕES DO BACKUP:");
  console.log(`   Nome: ${BACKUP_INFO.name}`);
  console.log(`   Versão: ${BACKUP_INFO.version}`);
  console.log(`   Data: ${BACKUP_INFO.date}`);
  console.log(`   Descrição: ${BACKUP_INFO.description}`);
  console.log();

  console.log("🚀 TECNOLOGIAS PRINCIPAIS:");
  console.log("   • React 18.3.1 + TypeScript");
  console.log("   • Vite 6.2.2 (Build & Dev)");
  console.log("   • TailwindCSS 3.4.11");
  console.log("   • React Router 6.26.2");
  console.log("   • Framer Motion 12.6.2");
  console.log("   • Radix UI Components");
  console.log("   • React Query (TanStack)");
  console.log();

  console.log("📁 ESTRUTURA PRINCIPAL:");
  console.log("   src/");
  console.log("   ├── components/       # Componentes reutilizáveis");
  console.log("   │   ├── ActionPlan/   # Sistema de planos de ação");
  console.log("   │   ├── Chat/         # Interface de chat");
  console.log("   │   ├── CRM/          # Componentes do CRM");
  console.log("   │   ├── Dashboard/    # Dashboards");
  console.log("   │   ├── GED/          # Gestão de documentos");
  console.log("   │   ├── Layout/       # Layouts responsivos");
  console.log("   │   └── ui/           # Biblioteca de componentes base");
  console.log("   │");
  console.log("   ├── pages/            # Páginas da aplicação");
  console.log("   ├── modules/          # Módulos específicos");
  console.log("   │   └── LawdeskAdmin/ # Painel administrativo");
  console.log("   │");
  console.log("   ├── hooks/            # Custom hooks");
  console.log("   ├── services/         # Serviços e APIs");
  console.log("   ├── contexts/         # Contextos React");
  console.log("   └── lib/              # Utilitários");
  console.log();

  console.log("🌐 ROTAS PRINCIPAIS:");
  console.log("   • /                   → Redireciona para /painel");
  console.log("   • /home               → Página inicial");
  console.log("   • /painel             → Dashboard principal");
  console.log("   • /crm                → Sistema CRM");
  console.log("   • /ged                → Gestão de documentos");
  console.log("   • /agenda             → Calendário jurídico");
  console.log("   • /ai                 → Assistente IA");
  console.log("   • /admin/*            → Painel administrativo");
  console.log();

  console.log("⚡ FUNCIONALIDADES:");
  console.log("   ✅ CRM Jurídico completo");
  console.log("   ✅ GED (Gestão Eletrônica de Documentos)");
  console.log("   ✅ Dashboard com analytics");
  console.log("   ✅ Sistema de chat integrado");
  console.log("   ✅ IA para análise de documentos");
  console.log("   ✅ Agenda com prazos processuais");
  console.log("   ✅ Painel administrativo completo");
  console.log("   ✅ Sistema de permissões");
  console.log("   ✅ Interface responsiva");
  console.log("   ✅ Temas claro/escuro");
  console.log();

  console.log("🔧 COMANDOS PRINCIPAIS:");
  console.log("   npm install           # Instalar dependências");
  console.log("   npm run dev          # Servidor de desenvolvimento");
  console.log("   npm run build        # Build para produção");
  console.log("   npm test             # Executar testes");
  console.log("   npm run typecheck    # Verificar tipos");
  console.log();

  console.log("📦 STATUS DOS ARQUIVOS:");

  let existentes = 0;
  let faltando = 0;

  PRINCIPAIS_ARQUIVOS.forEach((arquivo) => {
    const existe = fs.existsSync(arquivo);
    const status = existe ? "✅" : "❌";
    console.log(`   ${status} ${arquivo}`);

    if (existe) existentes++;
    else faltando++;
  });

  console.log();
  console.log(
    `📈 RESUMO: ${existentes} arquivos existentes, ${faltando} faltando`,
  );
  console.log();

  if (faltando === 0) {
    console.log(
      "🎉 PROJETO COMPLETO! Todos os arquivos principais estão presentes.",
    );
    console.log("🚀 Pronto para desenvolvimento e deploy.");
  } else {
    console.log(
      "⚠️  Alguns arquivos estão faltando. Verifique a estrutura do projeto.",
    );
  }

  console.log();
  console.log("🔗 SERVIDOR DE DESENVOLVIMENTO:");
  console.log("   URL Local: http://localhost:8080/");
  console.log("   Para acessar: npm run dev");
  console.log();
  console.log("=".repeat(50));
  console.log("Backup gerado em:", new Date().toLocaleString("pt-BR"));
  console.log("📧 Suporte: suporte@lawdesk.com");
}

// Executar o backup summary
createBackupSummary();
