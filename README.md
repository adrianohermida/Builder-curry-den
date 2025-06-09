# Lawdesk - Sistema de Gestão Jurídica

![Lawdesk](https://img.shields.io/badge/Lawdesk-Sistema%20Jur%C3%ADdico-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.2-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.11-blue)

## 🏛️ Sobre o Projeto

O **Lawdesk** é uma plataforma completa de gestão para escritórios de advocacia, desenvolvida com tecnologias modernas para oferecer máxima performance, segurança e usabilidade.

### ✨ Funcionalidades Principais

- **🏢 CRM Jurídico**: Gestão completa de clientes, processos e contratos
- **📁 GED (Gestão Eletrônica de Documentos)**: Organização e armazenamento seguro de documentos
- **📅 Agenda Jurídica**: Calendário integrado com prazos processuais
- **📊 Dashboard Analytics**: Métricas e relatórios para tomada de decisão
- **🤖 IA Integrada**: Assistente inteligente para análise de documentos
- **💬 Sistema de Chat**: Comunicação interna e atendimento ao cliente
- **⚙️ Painel Administrativo**: Controle completo do sistema
- **📱 Interface Responsiva**: Otimizada para desktop e mobile

## 🚀 Tecnologias Utilizadas

### Frontend

- **React 18.3.1** - Biblioteca principal
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 6.2.2** - Build tool e dev server
- **TailwindCSS 3.4.11** - Framework CSS
- **Framer Motion 12.6.2** - Animações
- **React Router 6.26.2** - Roteamento SPA

### UI Components

- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Recharts** - Gráficos e charts
- **Sonner** - Notificações toast

### Funcionalidades Avançadas

- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **React Dropzone** - Upload de arquivos
- **Three.js** - Gráficos 3D (opcional)

## 📁 Estrutura do Projeto

```
lawdesk/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├─�� ActionPlan/     # Sistema de planos de ação
│   │   ├── Chat/           # Interface de chat
│   │   ├── CRM/            # Componentes do CRM
│   │   ├── Dashboard/      # Dashboards
│   │   ├── GED/            # Gestão de documentos
│   │   ├── Layout/         # Layouts responsivos
│   │   └── ui/             # Biblioteca de componentes base
│   │
│   ├── pages/              # Páginas da aplicação
│   │   ├── CRM/            # Páginas do CRM
│   │   ├── Configuracoes/  # Páginas de configuração
│   │   └── ...             # Outras páginas
│   │
│   ├── modules/            # Módulos específicos
│   │   ├── LawdeskAdmin/   # Painel administrativo
│   │   └── Monetization/   # Sistema de monetização
│   │
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços e APIs
│   ├── contexts/           # Contextos React
│   ├── lib/                # Utilitários
│   ├── types/              # Definições TypeScript
│   └── styles/             # Estilos globais
│
├── public/                 # Arquivos estáticos
└── docs/                   # Documentação
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- NPM, Yarn ou PNPM

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lawdesk-builder.git
cd lawdesk-builder

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build para produção
npm run test         # Executa os testes
npm run typecheck    # Verifica tipos TypeScript
npm run format.fix   # Formata o código com Prettier
```

## 🌐 Rotas Principais

### Aplicação Principal

- `/` - Página inicial
- `/painel` - Dashboard principal
- `/crm` - Sistema CRM
- `/ged` - Gestão de documentos
- `/agenda` - Calendário jurídico
- `/ai` - Assistente IA
- `/settings` - Configurações

### Painel Administrativo

- `/admin` - Dashboard administrativo
- `/admin/executive` - Dashboard executivo
- `/admin/bi` - Business Intelligence
- `/admin/equipe` - Gestão de equipe
- `/admin/desenvolvimento` - Ferramentas dev
- `/admin/faturamento` - Faturamento
- `/admin/suporte` - Suporte
- `/admin/marketing` - Marketing
- `/admin/produtos` - Gestão de produtos
- `/admin/seguranca` - Segurança

## 🎨 Sistema de Temas

O projeto utiliza um sistema avançado de temas com:

- **Modo claro/escuro** automático
- **Cores personalizáveis** via CSS variables
- **Componentes temáticos** responsivos
- **Suporte a preferências** do usuário

### Configuração de Tema

```typescript
// Exemplo de uso do contexto de tema
import { useTheme } from "@/contexts/ThemeContext";

const { theme, setTheme, isDark } = useTheme();
```

## 🔐 Sistema de Permissões

- **Autenticação** baseada em roles
- **Controle granular** de acesso
- **Proteção de rotas** administrativas
- **Logs de auditoria** de acesso

## 📱 Responsividade

O sistema é totalmente responsivo com:

- **Breakpoints otimizados** para diferentes dispositivos
- **Layouts adaptativos** para mobile/tablet/desktop
- **Componentes específicos** para mobile
- **Performance otimizada** em todas as telas

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes específicos
npm test -- utils.spec.ts

# Executar com coverage
npm test -- --coverage
```

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=https://api.lawdesk.com
VITE_APP_VERSION=1.0.0
```

## 📊 Monitoramento

O sistema inclui:

- **Health checks** automáticos
- **Performance monitoring**
- **Diagnósticos automáticos**
- **Logs de sistema**

## 📚 Documentação Adicional

- [Correções do Sistema Admin](docs/ADMIN-MODULE-CORRECTIONS.md)
- [Auditoria Completa](docs/COMPREHENSIVE-AUDIT-SUMMARY.md)
- [Integração CRM](docs/CRM-ENHANCEMENT-SUMMARY.md)
- [Sistema Financeiro](docs/FINANCIAL-SUITE-SUMMARY.md)
- [Otimizações Finais](docs/FINAL-OPTIMIZATIONS.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 📞 Suporte

Para suporte técnico ou dúvidas:

- 📧 Email: suporte@lawdesk.com
- 💬 Chat: Disponível no sistema
- 📞 Telefone: (11) 9999-9999

---

**Lawdesk** - _Gestão Jurídica Inteligente_ 🏛️⚖️
