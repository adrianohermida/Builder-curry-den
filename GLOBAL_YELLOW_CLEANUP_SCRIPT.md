# 🧹 GLOBAL YELLOW CLEANUP SCRIPT

## Script para Remover TODO o Amarelo do Sistema

Este script deve ser executado para limpar completamente o amarelo do sistema Lawdesk:

```bash
# 1. Substituir em arquivos TypeScript/TSX
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-50/orange-50/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-100/orange-100/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-200/orange-200/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-300/orange-300/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-400/orange-400/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-500/orange-500/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-600/orange-600/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-700/orange-700/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-800/orange-800/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/yellow-900/orange-900/g'

# 2. Substituir cores específicas
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/text-yellow/text-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/bg-yellow/bg-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/border-yellow/border-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/ring-yellow/ring-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/hover:bg-yellow/hover:bg-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/hover:text-yellow/hover:text-orange/g'

# 3. Substituir dark mode variants
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/dark:bg-yellow/dark:bg-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/dark:text-yellow/dark:text-orange/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/dark:border-yellow/dark:border-orange/g'

# 4. Substituir CSS hexadecimal
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/#FFFF00/#f97316/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/#ffff00/#f97316/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/rgb(255, 255, 0)/rgb(249, 115, 22)/g'

# 5. Substituir propriedades CSS
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/color: yellow/color: rgb(249, 115, 22)/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/color: 'yellow'/color: 'orange'/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/color: "yellow"/color: "orange"/g'

# 6. Limpeza de CSS
find src -name "*.css" | xargs sed -i 's/yellow/orange/g'
```

## Verificação dos Arquivos Afetados

Estes arquivos ainda contêm referências amarelas:

### Páginas Principais

- `src/pages/PainelControle.tsx` (linha 138)
- `src/pages/Painel.tsx` (linha 174)
- `src/pages/Tarefas.tsx` (linha 352)

### Módulos CRM

- `src/pages/CRM/CRMEnhanced.tsx` (linhas 164, 172, 714, 749, 1015)
- `src/pages/CRM/index.tsx` (linha 229)

### Componentes Específicos

- `src/pages/Publicacoes.tsx` (linhas 276, 292, 393, 394, 524, 526, 527, 536)
- `src/pages/Contratos.tsx` (linhas 174, 647, 655, 777)
- `src/pages/Financeiro.tsx` (linha 200)

### Dashboards Mobile

- `src/pages/MobileDashboard.tsx` (linhas 58, 59, 93, 94, 153, 305, 314)
- `src/pages/MobileCRM.tsx` (linhas 83, 84, 113, 124, 254)
- `src/pages/MobileAdminDashboard.tsx` (linhas 60, 61, 282, 291)

### Ferramentas e Utilitários

- `src/pages/SystemHealth.tsx` (múltiplas linhas)
- `src/pages/ThemeTestPage.tsx` (linhas 157, 158, 159, 162, 404)
- `src/pages/TestDashboard.tsx` (linhas 40, 67, 275)

## Comando de Limpeza Completa

Execute este comando único para limpar TUDO:

```bash
# Limpeza completa em uma linha
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i \
-e 's/yellow-50/orange-50/g' \
-e 's/yellow-100/orange-100/g' \
-e 's/yellow-200/orange-200/g' \
-e 's/yellow-300/orange-300/g' \
-e 's/yellow-400/orange-400/g' \
-e 's/yellow-500/orange-500/g' \
-e 's/yellow-600/orange-600/g' \
-e 's/yellow-700/orange-700/g' \
-e 's/yellow-800/orange-800/g' \
-e 's/yellow-900/orange-900/g' \
-e 's/text-yellow/text-orange/g' \
-e 's/bg-yellow/bg-orange/g' \
-e 's/border-yellow/border-orange/g' \
-e 's/#FFFF00/#f97316/g' \
-e 's/#ffff00/#f97316/g' \
-e 's/rgb(255, 255, 0)/rgb(249, 115, 22)/g' \
{} +
```

## CSS Override Global

Adicione ao final do `globals.css`:

```css
/* COMPLETE YELLOW REMOVAL - GLOBAL OVERRIDE */
.bg-yellow-50,
.bg-yellow-100,
.bg-yellow-200,
.bg-yellow-300,
.bg-yellow-400,
.bg-yellow-500,
.bg-yellow-600,
.bg-yellow-700,
.bg-yellow-800,
.bg-yellow-900 {
  background-color: rgb(255 237 213) !important; /* orange-100 */
}

.text-yellow-50,
.text-yellow-100,
.text-yellow-200,
.text-yellow-300,
.text-yellow-400,
.text-yellow-500,
.text-yellow-600,
.text-yellow-700,
.text-yellow-800,
.text-yellow-900 {
  color: rgb(154 52 18) !important; /* orange-800 */
}

.border-yellow-50,
.border-yellow-100,
.border-yellow-200,
.border-yellow-300,
.border-yellow-400,
.border-yellow-500,
.border-yellow-600,
.border-yellow-700,
.border-yellow-800,
.border-yellow-900 {
  border-color: rgb(253 186 116) !important; /* orange-300 */
}

/* Dark mode variants */
.dark .bg-yellow-50,
.dark .bg-yellow-100,
.dark .bg-yellow-200,
.dark .bg-yellow-300,
.dark .bg-yellow-400,
.dark .bg-yellow-500,
.dark .bg-yellow-600,
.dark .bg-yellow-700,
.dark .bg-yellow-800,
.dark .bg-yellow-900 {
  background-color: rgb(67 20 7) !important; /* orange-950 */
}

.dark .text-yellow-50,
.dark .text-yellow-100,
.dark .text-yellow-200,
.dark .text-yellow-300,
.dark .text-yellow-400,
.dark .text-yellow-500,
.dark .text-yellow-600,
.dark .text-yellow-700,
.dark .text-yellow-800,
.dark .text-yellow-900 {
  color: rgb(253 186 116) !important; /* orange-300 */
}
```

## Resultado Esperado

Após executar este script:

- ✅ **Zero amarelo** em todo o sistema
- ✅ **Orange como substituto** consistente
- ✅ **Dark mode** corrigido
- ✅ **Performance mantida**
- ✅ **Design coerente**

## Status: EXECUTAR IMEDIATAMENTE

Este script resolve completamente o problema do amarelo no sistema.
