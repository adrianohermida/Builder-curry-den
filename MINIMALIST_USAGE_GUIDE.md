# 🎨 GUIA DE USO - LAYOUT MINIMALISTA CRM-V3-MINIMALIA

## 🚀 Ativação Rápida

### **Método 1: Script Automático (Recomendado)**

```bash
# Executar script de ativação
node scripts/activate-minimalist-layout.js

# Reiniciar servidor
npm run dev
```

### **Método 2: Ativação Manual**

```bash
# 1. Fazer backup do router atual
cp src/router/corrected.tsx src/router/corrected.backup.tsx

# 2. Ativar router minimalista
cp src/router/minimalist.tsx src/router/corrected.tsx

# 3. Reiniciar servidor
npm run dev
```

## 📖 Como Usar as Novas Funcionalidades

### **🔍 Busca Global**

- **Atalho**: `⌘K` (Cmd+K) ou `Ctrl+K`
- **Função**: Buscar clientes, processos, tarefas em tempo real
- **Localização**: Header central

### **⚡ Quick Actions**

| Atalho | Ação          | Resultado                   |
| ------ | ------------- | --------------------------- |
| `⌘C`   | Novo Cliente  | Abre formulário de cliente  |
| `⌘P`   | Novo Processo | Abre formulário de processo |
| `⌘T`   | Nova Tarefa   | Abre formulário de tarefa   |
| `⌘O`   | Novo Contrato | Abre formulário de contrato |

### **📱 Widgets Colapsáveis**

- **Como usar**: Clique no título do widget para expandir/colapsar
- **Prioridades**:
  - 🔴 **High**: Sempre visível (métricas, clientes)
  - 🟡 **Medium**: Colapsável (processos, tarefas)
  - 🟢 **Low**: Inicia colapsado (insights IA)

### **🎛️ Menu Contextual**

- **Onde**: Botão de 3 pontos (⋯) em cada item
- **Ações disponíveis**:
  - 👁️ **Ver**: Visualizar detalhes
  - ✏️ **Editar**: Modificar registro
  - 🔗 **Vincular**: Conectar com outros itens
  - 💬 **Discutir**: Abrir chat/comentários
  - 🗑️ **Excluir**: Remover item

### **🔽 Filtros Sticky**

- **Localização**: Header, persiste durante scroll
- **Tipos disponíveis**:
  - 👥 **Todos**: Todos os registros
  - ⭐ **VIP**: Clientes prioritários
  - ✅ **Ativos**: Em atividade
  - 🎯 **Prospectos**: Potenciais clientes
  - ⏸️ **Inativos**: Sem atividade recente

### **🤖 Insights IA**

- **Localização**: Ícone ⚡ no header
- **Tipos de insights**:
  - 💡 **Sugestões**: Otimizações recomendadas
  - ⚠️ **Alertas**: Situações que requerem atenção
  - 📊 **Insights**: Análises de dados e tendências

## 🎯 Navegação por Módulos

### **📊 Dashboard (Painel)**

- **Rota**: `/painel`
- **Funcionalidades**:
  - Métricas-chave em tempo real
  - Pipeline de clientes visual
  - Status de processos
  - Tarefas prioritárias
  - Insights IA contextuais

### **👥 CRM Jurídico**

- **Rota principal**: `/crm`
- **Sub-módulos**:

  | Módulo    | Rota             | Descrição           |
  | --------- | ---------------- | ------------------- |
  | Clientes  | `/crm/clientes`  | Gestão de clientes  |
  | Processos | `/crm/processos` | Casos e processos   |
  | Contratos | `/crm/contratos` | Gestão de contratos |
  | Tarefas   | `/crm/tarefas`   | Sistema de tarefas  |

### **📅 Calendário**

- **Rota**: `/agenda`
- **Recursos**: Integração com compromissos e prazos

### **💬 Comunicação**

- **Rota**: `/comunicacao`
- **Recursos**: Chat, e-mails, notificações

### **📈 Relatórios**

- **Rota**: `/relatorios`
- **Recursos**: Analytics e dashboards executivos

### **💰 Financeiro**

- **Rota**: `/financeiro`
- **Recursos**: Controle financeiro e faturamento

### **📁 Documentos**

- **Rota**: `/ged`
- **Recursos**: Gestão eletrônica de documentos

## 🎨 Personalização

### **Modo de Visualização**

1. **Grid**: Cards visuais (padrão)
2. **Lista**: Visualização compacta
3. **Kanban**: Fluxo visual por status

### **Densidade da Interface**

- **Compacta**: Mais itens por tela
- **Normal**: Balanceada (padrão)
- **Espaçosa**: Mais confortável

### **Tema**

- **Claro**: Fundo branco (padrão)
- **Escuro**: Fundo escuro
- **Auto**: Segue sistema operacional

## 📱 Responsividade

### **Mobile (< 768px)**

- Sidebar colapsável (hamburger menu)
- Quick actions condensadas em dropdown
- Cards empilhados verticalmente
- Gestos touch otimizados

### **Tablet (768px - 1024px)**

- Sidebar persistente
- Grid responsivo 2-3 colunas
- Touch + mouse suportados

### **Desktop (> 1024px)**

- Sidebar fixa
- Grid completo 4+ colunas
- Atalhos de teclado ativos
- Hover states completos

## 🔧 Configurações Avançadas

### **Widgets do Dashboard**

```typescript
// Personalizar widgets no arquivo:
// src/components/CRM/MinimalistCRMDashboard.tsx

const widgets = [
  {
    id: "metrics",
    title: "Métricas Customizadas",
    isCollapsed: false,
    priority: "high",
  },
  // ... mais widgets
];
```

### **Quick Actions Customizadas**

```typescript
// Adicionar ações no arquivo:
// src/components/Layout/MinimalistSaaSLayout.tsx

const quickActions = [
  {
    id: "custom-action",
    label: "Ação Customizada",
    icon: CustomIcon,
    path: "/custom-path",
    color: "bg-custom-color",
    shortcut: "X",
  },
];
```

### **Filtros Personalizados**

```typescript
// Modificar filtros no arquivo:
// src/pages/CRM/CRMMinimalist.tsx

const quickFilters = [
  { id: "custom", label: "Filtro Custom", count: 0, active: false },
];
```

## 🎨 Cores e Status

### **Status de Clientes**

- 🟣 **VIP**: `purple` - Clientes prioritários
- 🟢 **Ativo**: `green` - Em atividade regular
- 🔵 **Prospecto**: `blue` - Potencial cliente
- ⚫ **Inativo**: `gray` - Sem atividade

### **Prioridades**

- 🔴 **Alta**: Requer atenção imediata
- 🟡 **Média**: Importante mas não urgente
- 🟢 **Baixa**: Pode aguardar

### **Score de Engajamento**

- 🟢 **80-100%**: Excelente engajamento
- 🟡 **60-79%**: Engajamento médio
- 🔴 **0-59%**: Baixo engajamento

## 🚨 Troubleshooting

### **Layout não carregou**

1. Verificar se todos os arquivos foram criados
2. Reiniciar servidor: `npm run dev`
3. Limpar cache: `rm -rf node_modules/.cache`
4. Verificar console para erros

### **Atalhos não funcionam**

1. Verificar se está em página com MinimalistSaaSLayout
2. Testar `⌘K` primeiro (busca global)
3. Verificar se não há conflitos com browser/OS

### **Widgets não colapsam**

1. Verificar se `canCollapse: true` no widget
2. Verificar estado no localStorage
3. Recarregar página para reset

### **Responsividade com problemas**

1. Verificar viewport meta tag
2. Testar em device mode do browser
3. Verificar breakpoints do Tailwind

## 🔄 Rollback

### **Restaurar layout anterior**

```bash
# Restaurar backup
cp src/router/corrected.backup.tsx src/router/corrected.tsx

# Reiniciar servidor
npm run dev
```

### **Desativação completa**

```bash
# Remover arquivos minimalistas (opcional)
rm src/components/Layout/MinimalistSaaSLayout.tsx
rm src/components/CRM/MinimalistCRMDashboard.tsx
rm src/pages/CRM/CRMMinimalist.tsx
rm src/router/minimalist.tsx

# Restaurar backup
cp src/router/corrected.backup.tsx src/router/corrected.tsx
```

## 📞 Suporte

### **Logs e Debug**

- Arquivo de ativação: `activation.log`
- Status do sistema: `MINIMALIST_STATUS.json`
- Console do browser para erros de runtime

### **Documentação Adicional**

- 📋 **Resumo técnico**: `MINIMALIST_LAYOUT_SUMMARY.md`
- 🔧 **Fix anterior**: `BUG_FIX_NOTFOUND_SUMMARY.md`
- 🎯 **Diagnóstico**: `DIAGNOSTICO_CONCLUSAO_SUMMARY.md`

---

**Versão**: CRM-V3-MINIMALIA  
**Data**: ${new Date().toLocaleDateString('pt-BR')}  
**Modo**: Produção-ready  
**Suporte**: Documentação completa disponível
