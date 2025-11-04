# Changelog

## [2.1.0] - 2025-11-04

### ✨ Nova Funcionalidade Principal

#### ⚡ Clone de Boilerplate Next.js
- Novo comando `--nextjs` para clonar boilerplate Next.js completo
- Repositório: https://github.com/thiagonmiziara/boileerplate-next
- **Funcionalidades:**
  - Clone automático do repositório
  - Personalização do nome do projeto
  - Remoção opcional do histórico Git original
  - Instalação automática de dependências (opcional)
  - Abertura no VS Code após criação (opcional)
  - Inicialização de novo repositório Git
  - Atualização automática do package.json

#### 🎯 Modo Interativo Expandido
- Nova opção "⚡ Boilerplate Next.js (Clone)" no modo interativo
- Interface guiada para configuração do boilerplate
- Perguntas intuitivas para todas as opções

#### 📦 Boilerplate Incluído
**Next.js 14+ completo com:**
- TypeScript configurado
- Tailwind CSS
- shadcn/ui componentes
- ESLint + Prettier
- Estrutura profissional organizada
- Pronto para produção

### 🔧 Melhorias
- Versão atualizada para 2.1.0
- Novos comandos no help
- Descrição expandida do CLI
- Keywords atualizadas no package.json

### 💻 Como Usar

```bash
# Modo direto
create-react-component --nextjs

# Modo interativo
create-react-component --interactive
# Escolher: ⚡ Boilerplate Next.js (Clone)
```

## [2.0.0] - 2025-10-15

### ✨ Novidades Principais

#### 🚀 Criação de Projetos Completos
- Novo comando `--project` para criar projetos React + Vite completos
- Suporte a shadcn/ui com seleção de componentes
- Instalação automática de pacotes: Zustand, React Query, Axios, Zod, React Router DOM, date-fns

#### 📚 Exemplos Automáticos
Quando você seleciona pacotes adicionais, o CLI agora cria automaticamente:

**Zustand:**
- `src/stores/userStore.ts` - Store com persist no localStorage
- `src/stores/todoStore.ts` - Store com DevTools para debugging

**Axios:**
- `src/services/api.ts` - Configuração base com interceptors
- `src/services/userService.ts` - Service CRUD completo com validação

**React Query:**
- `src/hooks/useUsers.ts` - Hooks customizados com cache e invalidação
- `src/lib/queryClient.ts` - Configuração do QueryClient

**Zod:**
- Schemas de validação integrados nos services
- Validação de entrada e saída de dados

**Exemplos Práticos:**
- `src/pages/ExampleUsage.tsx` - Página demonstrando uso de todos os pacotes
- `EXAMPLES.md` - Documentação completa dos exemplos

#### 🎨 Melhorias na Criação de Projetos
- Estrutura de pastas organizada (components, pages, hooks, stores, services, contexts, types, utils, assets)
- Configuração automática de path aliases (@/)
- Tailwind CSS e shadcn/ui pré-configurados
- TypeScript configurado com paths
- Git inicialização opcional
- README.md e documentação inclusos

### 🔧 Melhorias
- Mensagens de sucesso mais informativas
- Remoção de logs de debug desnecessários
- Melhor organização de código
- Documentação expandida no README.md

### 📖 Documentação
- README.md completamente reescrito com exemplos práticos
- Seção de "Começando Rapidamente" adicionada
- Exemplos de código dos pacotes gerados
- Documentação de estrutura de projetos

## [1.x.x] - Versões Anteriores

### Funcionalidades Existentes
- Geração de componentes React (JSX/TSX)
- Suporte a Styled Components e Emotion
- Criação de Zustand stores
- Criação de Context API
- Arquivos de teste com React Testing Library
- Modo interativo
- Caminhos customizados

---

## 🚀 Como Atualizar

```bash
npm install -g mizi-react-component-generator@latest
```

## 📝 Notas de Migração

### De 1.x para 2.x

**Compatibilidade:** Todas as funcionalidades anteriores continuam funcionando da mesma forma.

**Novidades:** A principal adição é o comando `--project` que não afeta o uso existente.

**Breaking Changes:** Nenhum. Esta é uma adição de funcionalidades, mantendo retrocompatibilidade total.
