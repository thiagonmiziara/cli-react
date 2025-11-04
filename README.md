# 🚀 React Component Generator

<div align="center">

[![npm version](https://badge.fury.io/js/mizi-react-component-generator.svg)](https://badge.fury.io/js/mizi-react-component-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

**Uma CLI poderosa para gerar componentes React e projetos completos com Vite, shadcn/ui, React Query, Zustand, Axios e muito mais!**

</div>

## ✨ Características

### 🎨 Geração de Componentes
- 🎯 **Modo Interativo**: Interface guiada com perguntas intuitivas
- ⚛️ **Componentes React**: JSX/TSX com estrutura completa
- 🏪 **Zustand Stores**: Gerenciamento de estado com actions pré-definidas
- 🎯 **Context API**: Provider, hooks e reducers completos
- 💅 **Styled Components**: Templates com styled-components
- 😊 **Emotion**: Suporte completo ao Emotion styled
- 🎨 **CSS Tradicional**: Arquivos CSS com classes organizadas
- 🔷 **TypeScript**: Suporte completo com tipagem
- 🧪 **Testes**: Arquivos de teste com React Testing Library
- 📁 **Caminhos Customizados**: Crie em qualquer diretório

### 🚀 Criação de Projetos Completos
- 📦 **React + Vite**: Setup completo e otimizado
- 🎨 **shadcn/ui**: Componentes UI modernos com Tailwind CSS
- 🔄 **React Query**: Gerenciamento de estado do servidor com exemplos
- 🏪 **Zustand**: Stores com persist e devtools
- 🌐 **Axios**: Services configurados com interceptors
- ✅ **Zod**: Validação de schemas e tipos
- 📚 **Exemplos Práticos**: Código funcional e documentado
- 🎯 **Estrutura Organizada**: Pastas e arquivos bem estruturados

### ⚡ Clone de Boilerplate Next.js
- 🎯 **Clone Automático**: Clone do boilerplate Next.js completo
- 📝 **Personalização**: Nome do projeto customizável
- 🗑️ **Limpeza Git**: Remove histórico original (opcional)
- 📦 **Auto Install**: Instala dependências automaticamente
- 🆚 **VS Code**: Abre no VS Code após criação
- 📚 **Git Novo**: Inicializa repositório limpo
- ⚡ **Pronto para Usar**: Estrutura profissional completa

## 🎯 Modos de Uso

### 1. Modo Interativo - Componentes

O modo interativo guia você através de todas as opções:

```bash
create-react-component --interactive
# ou
crc -i
```

**O que você pode criar:**
- ⚛️ **Componente React** - Componente completo com estilos e testes
- 🏪 **Store Zustand** - Store com actions e tipagem completa
- 🎯 **Context API** - Provider, reducer e hooks customizados

### 2. Modo Projeto - Criar Projeto Completo

Crie um projeto React + Vite completo com todas as configurações:

```bash
create-react-component --project
# ou
crc --project
```

**O que é criado:**
- ✅ React + Vite configurado
- ✅ TypeScript (opcional)
- ✅ shadcn/ui + Tailwind CSS (opcional)
- ✅ Componentes shadcn selecionados
- ✅ Pacotes adicionais (Zustand, React Query, Axios, Zod, React Router)
- ✅ Estrutura de pastas organizada (components, pages, hooks, stores, services, etc)
- ✅ **Exemplos práticos** dos pacotes selecionados
- ✅ Configuração de path aliases (@/)
- ✅ Git inicializado (opcional)

**Exemplos automáticos criados:**
- 📦 **Zustand**: Stores com persist e devtools
- 🌐 **Axios**: Services com interceptors e tratamento de erros
- 🔄 **React Query**: Hooks customizados com cache
- ✅ **Zod**: Schemas de validação
- 📄 **Página de exemplos**: Componente funcional mostrando tudo

### 3. Modo Boilerplate Next.js - Clone Completo

Clone um boilerplate Next.js profissional pronto para produção:

```bash
create-react-component --nextjs
# ou
crc --nextjs
```

**Boilerplate incluído:**
- ✅ Next.js 14+ com App Router
- ✅ TypeScript configurado
- ✅ Tailwind CSS + shadcn/ui
- ✅ ESLint + Prettier
- ✅ Estrutura profissional organizada
- ✅ Configurações de produção
- ✅ Componentes pré-construídos
- ✅ Pronto para deploy

## 📦 Instalação

### Uso Global (Recomendado)

```bash
# Instalar globalmente
npm install -g mizi-react-component-generator

# Usar diretamente
create-react-component --interactive
# ou
crc --interactive

# Criar projeto completo
crc --project
```

### Uso com npx (Sem Instalação)

```bash
# Modo interativo
npx mizi-react-component-generator --interactive

# Criar projeto
npx mizi-react-component-generator --project

# Modo direto
npx mizi-react-component-generator Button --ts --styled
```

## 🛠️ Uso por Linha de Comando

### Componentes React

```bash
# Componente básico
crc Button

# TypeScript + Styled Components + Testes
crc Modal --ts --styled --test

# Emotion + caminho customizado
crc Card --emotion --path ./src/components

# Componente completo
crc Dashboard --ts --styled --test --path ./src/pages
```

### Zustand Stores

```bash
# Store JavaScript
crc UserStore --zustand

# Store TypeScript
crc AuthStore --zustand --ts --path ./src/stores
```

### Context API

```bash
# Context JavaScript
crc ThemeContext --context

# Context TypeScript
crc UserContext --context --ts --path ./src/contexts
```

## 📚 Opções Disponíveis

### Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `--interactive` ou `-i` | Modo interativo para criar componentes |
| `--project` | Criar projeto React + Vite completo |
| `--help` ou `-h` | Mostrar ajuda |

### Opções para Componentes

| Opção | Alias | Descrição |
|-------|-------|-----------|
| `--typescript` | `-t` | Gerar arquivos TypeScript |
| `--styled` | `-s` | Usar Styled Components |
| `--emotion` | `-e` | Usar Emotion |
| `--zustand` | `-z` | Criar Zustand store |
| `--context` | `-c` | Criar Context API |
| `--test` | | Incluir arquivos de teste |
| `--path <caminho>` | `-p` | Caminho onde criar |

## 🎨 Exemplos de Uso

### Criar Projeto Completo

```bash
# Criar projeto completo
crc --project

# Clonar boilerplate Next.js
crc --nextjs

# Exemplo do que você pode configurar no projeto React:
# - Nome do projeto: my-app
# - TypeScript: Sim
# - shadcn/ui: Sim
# - Componentes: button, card, dialog
# - Pacotes: zustand, @tanstack/react-query, axios, zod
# - Git: Sim

# Exemplo do que você pode configurar no Next.js:
# - Nome do projeto: my-nextjs-app
# - Instalar deps: Sim
# - Abrir VS Code: Sim
# - Remover Git history: Sim
```

**Resultado:**
```
my-app/
├── src/
│   ├── components/
│   │   └── ui/           # Componentes shadcn
│   ├── pages/
│   │   └── ExampleUsage.tsx  # Exemplos práticos
│   ├── hooks/
│   │   └── useUsers.ts   # Hooks React Query
│   ├── stores/
│   │   ├── userStore.ts  # Store com persist
│   │   └── todoStore.ts  # Store com devtools
│   ├── services/
│   │   ├── api.ts        # Configuração Axios
│   │   └── userService.ts # Service com Zod
│   └── lib/
│       ├── utils.ts      # Utilidades
│       └── queryClient.ts # Config React Query
├── EXAMPLES.md           # Documentação dos exemplos
└── ...
```

## 📁 Estruturas Geradas

### Projeto Completo

Ao criar um projeto com `--project`, você recebe:

```
my-project/
├── public/
├── src/
│   ├── components/
│   │   └── ui/              # Componentes shadcn/ui
│   ├── pages/
│   │   └── ExampleUsage.tsx # Exemplos de uso dos pacotes
│   ├── hooks/               # Custom hooks (React Query, etc)
│   ├── stores/              # Zustand stores
│   ├── services/            # Axios services
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript types
│   ├── utils/               # Utilidades
│   ├── lib/                 # Configurações e helpers
│   ├── assets/              # Imagens, fonts, etc
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── components.json          # Config shadcn/ui
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── EXAMPLES.md              # 📚 Documentação dos exemplos
└── README.md
```

### Componente React (CSS)
```bash
# Comando:
crc Button --test
```
```
Button/
├── Button.jsx
├── Button.css
├── index.js
└── Button.test.jsx
```

### Componente React (Styled Components)
```bash
# Comando:
crc Modal --ts --styled
```
```
Modal/
├── Modal.tsx
├── styled.ts
├── index.ts
└── Modal.test.tsx
```

### Zustand Store
```bash
# Comando:
crc UserStore --zustand --ts
```
```
UserStore/
├── store.ts
└── index.ts
```

### Context API
```bash
# Comando:
crc ThemeContext --context --ts
```
```
ThemeContext/
├── context.tsx
└── index.tsx
```

## 💡 Exemplos Automáticos nos Projetos

Quando você seleciona pacotes como **Zustand**, **React Query**, **Axios** ou **Zod**, 
o CLI automaticamente cria arquivos de exemplo funcionais!

### 🏪 Zustand Store

**Arquivo:** `src/stores/userStore.ts`

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  
  setUser: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',

      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'user-storage' }
  )
);
```

### 🌐 Axios Service

**Arquivo:** `src/services/userService.ts`

```tsx
import { api } from './api';
import { z } from 'zod';

// Schema Zod para validação
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return userSchema.parse(response.data);
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const validatedData = createUserSchema.parse(data);
    const response = await api.post<User>('/users', validatedData);
    return userSchema.parse(response.data);
  },
};
```

### 🔄 React Query Hook

**Arquivo:** `src/hooks/useUsers.ts`

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('✅ Usuário criado!');
    },
  });
}
```

### 📄 Página de Exemplos

**Arquivo:** `src/pages/ExampleUsage.tsx`

Uma página completa mostrando:
- Como usar os Zustand stores
- Como fazer queries com React Query
- Como criar/atualizar/deletar dados
- Integração entre todos os pacotes

**Para ver os exemplos em ação:**
```tsx
// No seu App.tsx
import { ExampleUsage } from './pages/ExampleUsage';

function App() {
  return <ExampleUsage />;
}
```

## 🎯 Como Usar os Componentes Gerados

### Importação Simples
```tsx
import { Button } from './Button';
import { useUserStore } from './stores/userStore';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
```

### Usando Zustand Store
```tsx
function MyComponent() {
  const { user, setUser, logout } = useUserStore();
  
  return (
    <div>
      {user ? (
        <>
          <p>Olá, {user.name}!</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <button onClick={() => setUser({ id: '1', name: 'João', email: 'joao@email.com' })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Usando React Query
```tsx
import { useUsers, useCreateUser } from '@/hooks/useUsers';

function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button 
        onClick={() => createUser.mutate({ 
          name: 'Maria', 
          email: 'maria@email.com',
          password: '123456'
        })}
      >
        Adicionar Usuário
      </button>
    </div>
  );
}
```

### Usando Context API
```tsx
function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { state, dispatch } = useThemeContext();
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  );
}
```

## 🚀 Começando Rapidamente

### 1. Criar um Projeto Completo

```bash
# Instalar CLI globalmente
npm install -g mizi-react-component-generator

# Criar projeto React + Vite
crc --project

# Responder as perguntas interativas:
# - Nome: my-awesome-app
# - TypeScript: Sim
# - shadcn/ui: Sim
# - Componentes: button, card, input
# - Pacotes: zustand, @tanstack/react-query, axios, zod, react-router-dom
# - Git: Sim

# Navegar e iniciar
cd my-awesome-app
npm run dev
```

### 2. Clonar Boilerplate Next.js

```bash
# Clonar boilerplate profissional
crc --nextjs

# Responder as perguntas:
# - Nome: my-nextjs-project
# - Instalar deps: Sim
# - Abrir VS Code: Sim
# - Remover Git history: Sim

# Navegar e iniciar
cd my-nextjs-project
npm run dev
```

### 3. Ver os Exemplos (React + Vite)

```tsx
// Edite src/App.tsx
import { ExampleUsage } from './pages/ExampleUsage';

function App() {
  return <ExampleUsage />;
}

export default App;
```

### 4. Criar Componentes Adicionais

```bash
# Criar um novo componente
crc ProductCard --ts --styled --test

# Criar um novo store
crc CartStore --zustand --ts --path ./src/stores

# Criar um novo context
crc AuthContext --context --ts
```

## 📖 Documentação Adicional

Após criar um projeto, você terá acesso a:

- **EXAMPLES.md**: Documentação completa dos exemplos criados
- **README.md**: Instruções do projeto
- Exemplos funcionais em `src/pages/ExampleUsage.tsx`
- Código comentado e bem estruturado

## ⚙️ Requisitos

- Node.js >= 14.0.0
- npm ou yarn

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) antes de submeter PRs.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 🔗 Links

- [Repositório GitHub](https://github.com/thiagonmiziara/cli-react)
- [Pacote npm](https://www.npmjs.com/package/mizi-react-component-generator)
- [Reportar Bug](https://github.com/thiagonmiziara/cli-react/issues)

---

<div align="center">

**Feito com ❤️ por [Thiago Miziara](https://github.com/thiagonmiziara)**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>