# 🚀 React Component Generator

<div align="center">

[![npm version](https://badge.fury.io/js/%40thiagonmiziara%2Freact-component-generator.svg)](https://badge.fury.io/js/%40thiagonmiziara%2Freact-component-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

**Uma CLI poderosa para gerar componentes React com suporte completo a CSS, Styled Components, Emotion, Zustand stores, Context API e testes automatizados**

</div>

## ✨ Características

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
- 🎨 **Interface Bonita**: Terminal colorido com emojis

## 📦 Instalação

### Uso Global (Recomendado)

```bash
# Instalar globalmente
npm install -g @thiagonmiziara/react-component-generator

# Usar diretamente
create-react-component --interactive
# ou
crc --interactive
```

### Uso com npx (Sem Instalação)

```bash
# Modo interativo
npx @thiagonmiziara/react-component-generator --interactive

# Modo direto
npx @thiagonmiziara/react-component-generator Button --ts --styled
```

## 🎯 Modo Interativo

O modo interativo guia você através de todas as opções disponíveis:

```bash
create-react-component --interactive
# ou
crc -i
```

### O que você pode criar:

1. **⚛️ Componente React** - Componente completo com estilos e testes
2. **🏪 Store Zustand** - Store com actions e tipagem completa
3. **🎯 Context API** - Provider, reducer e hooks customizados

## 🛠️ Uso por Linha de Comando

### Componentes React

```bash
# Componente básico
create-react-component Button

# TypeScript + Styled Components + Testes
create-react-component Modal --ts --styled --test

# Emotion + caminho customizado
create-react-component Card --emotion --path ./src/components

# Componente completo
create-react-component Dashboard --ts --styled --test --path ./src/pages
```

### Zustand Stores

```bash
# Store JavaScript
create-react-component UserStore --zustand

# Store TypeScript
create-react-component AuthStore --zustand --ts --path ./src/stores
```

### Context API

```bash
# Context JavaScript
create-react-component ThemeContext --context

# Context TypeScript
create-react-component UserContext --context --ts --path ./src/contexts
```

## 📚 Opções Disponíveis

| Opção | Alias | Descrição |
|-------|-------|-----------|
| `--interactive` | `-i` | Modo interativo com perguntas |
| `--typescript` | `-t` | Gerar arquivos TypeScript |
| `--styled` | `-s` | Usar Styled Components |
| `--emotion` | `-e` | Usar Emotion |
| `--zustand` | `-z` | Criar Zustand store |
| `--context` | `-c` | Criar Context API |
| `--test` | | Incluir arquivos de teste |
| `--path <caminho>` | `-p` | Caminho onde criar |
| `--help` | `-h` | Mostrar ajuda |

## 📁 Estruturas Geradas

### Componente React (CSS)
```
Button/
├── Button.jsx
├── Button.css
├── index.js
└── Button.test.jsx (opcional)
```

### Componente React (Styled Components)
```
Modal/
├── Modal.tsx
├── styled.ts
├── index.ts
└── Modal.test.tsx (opcional)
```

### Zustand Store
```
UserStore/
├── store.ts
└── index.ts
```

### Context API
```
ThemeContext/
├── context.tsx
└── index.tsx
```

## 🎨 Exemplos de Código Gerado

### Componente React com Styled Components (TypeScript)

```tsx
import React from "react";
import { Container } from "./styled";

export const Button = () => {
  return (
    <Container>
      <h1>Button component</h1>
    </Container>
  );
};
```

### Zustand Store (TypeScript)

```tsx
import { create } from 'zustand';

interface UserState {
  count: number;
  text: string;
  isLoading: boolean;
  
  increment: () => void;
  decrement: () => void;
  updateText: (text: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  count: 0,
  text: '',
  isLoading: false,
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  updateText: (text: string) => set({ text }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  reset: () => set({ count: 0, text: '', isLoading: false }),
}));
```

### Context API (TypeScript)

```tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface ThemeState {
  count: number;
  text: string;
  isLoading: boolean;
}

type ThemeAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'UPDATE_TEXT'; payload: string };

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
```

## 🎯 Como Usar os Componentes Gerados

### Importação Simples
```tsx
import { Button } from './Button';
import { useUserStore } from './stores/UserStore';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
```

### Usando Zustand Store
```tsx
function MyComponent() {
  const { count, increment, decrement } = useUserStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
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

## ⚙️ Requisitos

- Node.js >= 14.0.0
- npm ou yarn

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) antes de submeter PRs.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 🔗 Links

- [Repositório GitHub](https://github.com/thiagonmiziara/react-component-generator)
- [Pacote npm](https://www.npmjs.com/package/@thiagonmiziara/react-component-generator)
- [Reportar Bug](https://github.com/thiagonmiziara/react-component-generator/issues)

---

<div align="center">

**Feito com ❤️ por [Thiago Miziara](https://github.com/thiagonmiziara)**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>