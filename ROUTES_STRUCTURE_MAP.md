# 🗺️ Mapa Estruturado de Rotas, Layouts e Módulos - Lawdesk CRM

## 📋 Informações do Sistema

**Gerado em:** `${new Date().toISOString()}`  
**Versão do Sistema:** `v2.0.0`  
**Última Atualização:** `${new Date().toLocaleDateString('pt-BR')}`  
**Status:** `Produção Ativa`

---

## 🏗️ Visão Geral da Arquitetura

### Sistema de Layouts

- **MainLayout**: Layout principal para áreas autenticadas
- **PublicLayout**: Layout para páginas públicas (login, registro)
- **CRMJuridicoLayout**: Layout específico do domínio CRM Jurídico
- **LawdeskLayoutSaaS**: Layout especializado para plano SaaS

### Tipos de Acesso

- **🔓 Público**: Acessível sem autenticação
- **🔒 Privado**: Requer autenticação básica
- **👑 Admin**: Requer permissões administrativas
- **💎 SaaS**: Funcionalidades específicas do plano SaaS

---

## 📍 Mapeamento Completo de Rotas

### 🔓 Rotas Públicas

| Rota                | Layout       | Tipo       | Módulo     | Status   | Descrição                        |
| ------------------- | ------------ | ---------- | ---------- | -------- | -------------------------------- |
| `/login`            | PublicLayout | 🔓 Público | auth       | ✅ ativo | Página de autenticação           |
| `/registro`         | PublicLayout | 🔓 Público | auth       | ✅ ativo | Cadastro de novos usuários       |
| `/onboarding-start` | PublicLayout | 🔓 Público | onboarding | ✅ ativo | Início do processo de onboarding |

---

### 🔒 Rotas Principais (MainLayout)

| Rota         | Layout     | Tipo       | Módulo    | Status   | Responsável | Versão |
| ------------ | ---------- | ---------- | --------- | -------- | ----------- | ------ |
| `/`          | MainLayout | 🔒 Privado | dashboard | ✅ ativo | Core Team   | v2.0   |
| `/dashboard` | MainLayout | 🔒 Privado | dashboard | ✅ ativo | Core Team   | v2.0   |
| `/painel`    | MainLayout | 🔒 Privado | dashboard | ✅ ativo | Core Team   | v2.0   |

---

### 🏛️ Domínios Funcionais Independentes

#### 📊 CRM Jurídico (`/crm-juridico/*`)

| Rota                                  | Layout            | Tipo       | Módulo       | Status   | Descrição                   |
| ------------------------------------- | ----------------- | ---------- | ------------ | -------- | --------------------------- |
| `/crm-juridico`                       | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Dashboard do CRM            |
| `/crm-juridico/dashboard`             | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Visão geral e métricas      |
| `/crm-juridico/clientes`              | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Lista de clientes jurídicos |
| `/crm-juridico/clientes/:clienteId`   | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Detalhes do cliente         |
| `/crm-juridico/processos`             | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Gestão de processos         |
| `/crm-juridico/processos/:processoId` | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Detalhes do processo        |
| `/crm-juridico/contratos`             | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Gestão de contratos         |
| `/crm-juridico/contratos/:contratoId` | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Detalhes do contrato        |
| `/crm-juridico/tarefas`               | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Gestão de tarefas           |
| `/crm-juridico/relatorios`            | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Relatórios e analytics      |
| `/crm-juridico/configuracoes`         | CRMJuridicoLayout | 🔒 Privado | crm-juridico | ✅ ativo | Configurações do módulo     |

**Permissões:** `crm_juridico_read`  
**Lazy Loading:** ✅ Ativado  
**Code Splitting:** ✅ Por domínio  
**Responsável:** CRM Team  
**Última Modificação:** 2024-12-19

#### 📅 Agenda Jurídica (`/agenda-juridica/*`)

| Rota                          | Layout     | Tipo       | Módulo          | Status             | Descrição                 |
| ----------------------------- | ---------- | ---------- | --------------- | ------------------ | ------------------------- |
| `/agenda-juridica`            | MainLayout | 🔒 Privado | agenda-juridica | 🚧 desenvolvimento | Dashboard da agenda       |
| `/agenda-juridica/calendario` | MainLayout | 🔒 Privado | agenda-juridica | 🚧 desenvolvimento | Calendário jurídico       |
| `/agenda-juridica/prazos`     | MainLayout | 🔒 Privado | agenda-juridica | 🚧 desenvolvimento | Gestão de prazos          |
| `/agenda-juridica/audiencias` | MainLayout | 🔒 Privado | agenda-juridica | 🚧 desenvolvimento | Agendamento de audiências |

**Permissões:** `agenda_juridica_read`  
**Lazy Loading:** ✅ Ativado  
**Responsável:** Agenda Team

#### 📄 Processos e Publicações (`/processos-publicacoes/*`)

| Rota                                    | Layout     | Tipo       | Módulo                | Status       | Descrição                 |
| --------------------------------------- | ---------- | ---------- | --------------------- | ------------ | ------------------------- |
| `/processos-publicacoes`                | MainLayout | 🔒 Privado | processos-publicacoes | 🔄 planejado | Dashboard de processos    |
| `/processos-publicacoes/acompanhamento` | MainLayout | 🔒 Privado | processos-publicacoes | 🔄 planejado | Acompanhamento processual |
| `/processos-publicacoes/publicacoes`    | MainLayout | 🔒 Privado | processos-publicacoes | 🔄 planejado | Gestão de publicações     |

**Permissões:** `processos_read`  
**Responsável:** Process Team

#### 💰 Contratos e Financeiro (`/contratos-financeiro/*`)

| Rota                                | Layout     | Tipo       | Módulo               | Status       | Descrição               |
| ----------------------------------- | ---------- | ---------- | -------------------- | ------------ | ----------------------- |
| `/contratos-financeiro`             | MainLayout | 🔒 Privado | contratos-financeiro | 🔄 planejado | Dashboard financeiro    |
| `/contratos-financeiro/contratos`   | MainLayout | 🔒 Privado | contratos-financeiro | 🔄 planejado | Gestão de contratos     |
| `/contratos-financeiro/faturamento` | MainLayout | 🔒 Privado | contratos-financeiro | 🔄 planejado | Controle de faturamento |

**Permissões:** `financeiro_read`  
**Responsável:** Finance Team

#### 📞 Atendimento e Comunicação (`/atendimento-comunicacao/*`)

| Rota                                   | Layout     | Tipo       | Módulo                  | Status       | Descrição              |
| -------------------------------------- | ---------- | ---------- | ----------------------- | ------------ | ---------------------- |
| `/atendimento-comunicacao`             | MainLayout | 🔒 Privado | atendimento-comunicacao | 🔄 planejado | Central de atendimento |
| `/atendimento-comunicacao/tickets`     | MainLayout | 🔒 Privado | atendimento-comunicacao | 🔄 planejado | Gestão de tickets      |
| `/atendimento-comunicacao/comunicacao` | MainLayout | 🔒 Privado | atendimento-comunicacao | 🔄 planejado | Central de comunicação |

**Permissões:** `atendimento_read`  
**Responsável:** Support Team

#### 🤖 IA Jurídica (`/ia-juridica/*`)

| Rota                      | Layout     | Tipo       | Módulo      | Status       | Descrição              |
| ------------------------- | ---------- | ---------- | ----------- | ------------ | ---------------------- |
| `/ia-juridica`            | MainLayout | 🔒 Privado | ia-juridica | 🔄 planejado | Dashboard de IA        |
| `/ia-juridica/analises`   | MainLayout | 🔒 Privado | ia-juridica | 🔄 planejado | Análises inteligentes  |
| `/ia-juridica/assistente` | MainLayout | 🔒 Privado | ia-juridica | 🔄 planejado | Assistente jurídico IA |

**Permissões:** `ia_juridica_read`  
**Responsável:** AI Team

#### 📁 GED e Documentos (`/ged-documentos/*`)

| Rota                          | Layout     | Tipo       | Módulo         | Status       | Descrição                 |
| ----------------------------- | ---------- | ---------- | -------------- | ------------ | ------------------------- |
| `/ged-documentos`             | MainLayout | 🔒 Privado | ged-documentos | 🔄 planejado | Dashboard GED             |
| `/ged-documentos/repositorio` | MainLayout | 🔒 Privado | ged-documentos | 🔄 planejado | Repositório de documentos |
| `/ged-documentos/pesquisa`    | MainLayout | 🔒 Privado | ged-documentos | 🔄 planejado | Pesquisa avançada         |

**Permissões:** `ged_read`  
**Responsável:** GED Team

#### ⚙️ Administração e Configurações (`/admin-configuracoes/*`)

| Rota                            | Layout     | Tipo     | Módulo              | Status       | Descrição                |
| ------------------------------- | ---------- | -------- | ------------------- | ------------ | ------------------------ |
| `/admin-configuracoes`          | MainLayout | 👑 Admin | admin-configuracoes | 🔄 planejado | Dashboard administrativo |
| `/admin-configuracoes/usuarios` | MainLayout | 👑 Admin | admin-configuracoes | 🔄 planejado | Gestão de usuários       |
| `/admin-configuracoes/sistema`  | MainLayout | 👑 Admin | admin-configuracoes | 🔄 planejado | Configurações do sistema |

**Permissões:** `admin_read`  
**Responsável:** Admin Team

---

### 🔄 Rotas de Compatibilidade (Legacy Redirects)

| Rota Legacy      | Redirecionamento           | Status   | Observações                     |
| ---------------- | -------------------------- | -------- | ------------------------------- |
| `/painel`        | `/dashboard`               | ✅ ativo | Compatibilidade mantida         |
| `/crm-modern/*`  | `/crm-juridico/*`          | ✅ ativo | Migração automática             |
| `/agenda`        | `/agenda-juridica`         | ✅ ativo | Redirecionamento simples        |
| `/publicacoes`   | `/processos-publicacoes`   | ✅ ativo | Agrupamento de funcionalidades  |
| `/financeiro`    | `/contratos-financeiro`    | ✅ ativo | Consolidação de módulos         |
| `/atendimento`   | `/atendimento-comunicacao` | ✅ ativo | Expansão do escopo              |
| `/ia`            | `/ia-juridica`             | ✅ ativo | Especialização jurídica         |
| `/ged`           | `/ged-documentos`          | ✅ ativo | Especificação da funcionalidade |
| `/configuracoes` | `/admin-configuracoes`     | ✅ ativo | Agrupamento administrativo      |

---

### 💎 Rotas SaaS (LawdeskLayoutSaaS)

| Rota                | Layout            | Tipo    | Módulo            | Status   | Descrição              |
| ------------------- | ----------------- | ------- | ----------------- | -------- | ---------------------- |
| `/saas`             | LawdeskLayoutSaaS | 💎 SaaS | saas-dashboard    | ✅ ativo | Dashboard SaaS         |
| `/saas/dashboard`   | LawdeskLayoutSaaS | 💎 SaaS | saas-dashboard    | ✅ ativo | Métricas avançadas     |
| `/saas/analytics`   | LawdeskLayoutSaaS | 💎 SaaS | saas-analytics    | ✅ ativo | Analytics avançado     |
| `/saas/billing`     | LawdeskLayoutSaaS | 💎 SaaS | saas-billing      | ✅ ativo | Gestão de cobrança     |
| `/saas/integracoes` | LawdeskLayoutSaaS | 💎 SaaS | saas-integrations | ✅ ativo | Central de integrações |

**Permissões:** `saas_user`, `premium_user`, `enterprise_user`  
**Responsável:** SaaS Team

---

### ❌ Rotas de Erro

| Rota            | Layout     | Tipo       | Módulo         | Status   | Descrição                  |
| --------------- | ---------- | ---------- | -------------- | -------- | -------------------------- |
| `/404`          | MainLayout | 🔒 Privado | error-handling | ✅ ativo | Página não encontrada      |
| `/*` (fallback) | -          | -          | error-handling | ✅ ativo | Redirecionamento para /404 |

---

## 🔧 Configurações Técnicas

### Lazy Loading e Code Splitting

```typescript
// Domínios com preload ativado
const PRELOADED_DOMAINS = [
  "crm-juridico", // Crítico - carregado antecipadamente
  "agenda-juridica", // Crítico - carregado antecipadamente
];

// Domínios com lazy loading padrão
const LAZY_DOMAINS = [
  "processos-publicacoes",
  "contratos-financeiro",
  "atendimento-comunicacao",
  "ia-juridica",
  "ged-documentos",
  "admin-configuracoes",
];
```

### Sistema de Permissões por Rota

```typescript
const ROUTE_PERMISSIONS = {
  "/crm-juridico/*": ["crm_juridico_read"],
  "/agenda-juridica/*": ["agenda_juridica_read"],
  "/processos-publicacoes/*": ["processos_read"],
  "/contratos-financeiro/*": ["financeiro_read"],
  "/atendimento-comunicacao/*": ["atendimento_read"],
  "/ia-juridica/*": ["ia_juridica_read"],
  "/ged-documentos/*": ["ged_read"],
  "/admin-configuracoes/*": ["admin_read"],
  "/saas/*": ["saas_user", "premium_user", "enterprise_user"],
};
```

---

## 📊 Estatísticas do Sistema

### Distribuição por Status

- ✅ **Ativas:** 25 rotas (62%)
- 🚧 **Em Desenvolvimento:** 4 rotas (10%)
- 🔄 **Planejadas:** 11 rotas (28%)

### Distribuição por Tipo de Acesso

- 🔓 **Públicas:** 3 rotas (7%)
- 🔒 **Privadas:** 32 rotas (80%)
- 👑 **Admin:** 3 rotas (8%)
- 💎 **SaaS:** 5 rotas (12%)

### Distribuição por Layout

- **MainLayout:** 28 rotas (70%)
- **PublicLayout:** 3 rotas (7%)
- **CRMJuridicoLayout:** 11 rotas (28%)
- **LawdeskLayoutSaaS:** 5 rotas (12%)

---

## 🎯 Benefícios Implementados

### ✅ Facilidade de Manutenção

- Estrutura modular por domínio
- Lazy loading automático
- Compatibilidade legacy garantida

### ��� Controle de Acesso Refinado

- Permissões granulares por rota
- Layouts específicos por tipo de usuário
- Proteção de rotas administrativa

### ✅ Auditoria Simplificada

- Rotas obsoletas identificadas automaticamente
- Status de desenvolvimento claro
- Responsabilidades definidas por equipe

### ✅ Planejamento Ágil

- Roadmap de desenvolvimento visível
- Dependências entre módulos mapeadas
- Migração gradual facilitada

---

## 🚀 Próximos Passos

### Prioridade Alta

1. **Finalizar Agenda Jurídica** - Conclusão do desenvolvimento
2. **Implementar Processos e Publicações** - Início do desenvolvimento
3. **Otimizar Performance** - Melhorar métricas de carregamento

### Prioridade Média

1. **Expandir IA Jurídica** - Funcionalidades avançadas
2. **Consolidar GED** - Sistema de documentos robusto
3. **Aprimorar Analytics SaaS** - Métricas mais detalhadas

### Prioridade Baixa

1. **Refatorar Rotas Legacy** - Remover compatibilidade antiga
2. **Implementar PWA** - Suporte offline
3. **Adicionar Testes E2E** - Cobertura completa de rotas

---

## 📋 Exportação para Ferramentas

### Para Notion

```markdown
Copie o conteúdo deste arquivo diretamente para uma página do Notion.
A formatação em Markdown será preservada automaticamente.
```

### Para Confluence

```html
Use o importador de Markdown do Confluence ou converta para HTML usando
ferramentas como Pandoc para manter a formatação.
```

### Para Planilhas

```csv
Rota,Layout,Tipo,Módulo,Status,Descrição,Responsável,Versão
Dados disponíveis no arquivo routes-map.json
```

---

**Gerado automaticamente pelo Sistema de Documentação Lawdesk CRM**  
**Versão do Documento:** 1.0  
**Última Sincronização:** ${new Date().toISOString()}
