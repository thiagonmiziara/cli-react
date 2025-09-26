/**
 * Templates para geração de arquivos
 */

// Template base para componente React
export const createComponentTemplate = (nome, imports, content) => {
  return `${imports}
${content}
`;
};

// Template para componente básico
export const createBasicComponent = (nome) => {
  return `export const ${nome} = () => {
  return (
    <div className="${nome.toLowerCase()}">
      <h1>${nome} component</h1>
    </div>
  );
};`;
};

// Template para componente com styled-components
export const createStyledComponent = (nome) => {
  return `export const ${nome} = () => {
  return (
    <Container>
      <h1>${nome} component</h1>
    </Container>
  );
};`;
};

// Template para styled-components
export const createStyledTemplate = (jsExt) => {
  return `import styled from "styled-components";

export const Container = styled.div\`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  
  h1 {
    color: #333;
    margin: 0;
  }
\`;
`;
};

// Template para Emotion
export const createEmotionTemplate = (jsExt) => {
  return `import styled from "@emotion/styled";

export const Container = styled.div\`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  
  h1 {
    color: #333;
    margin: 0;
  }
\`;
`;
};

// Template para CSS
export const createCSSTemplate = (nome) => {
  return `.${nome.toLowerCase()} {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.${nome.toLowerCase()} h1 {
  color: #333;
  margin: 0;
}
`;
};

// Template para Zustand Store (TypeScript)
export const createZustandStoreTS = (nome) => {
  return `import { create } from 'zustand';

interface ${nome}State {
  // Estado do ${nome}
  count: number;
  text: string;
  isLoading: boolean;
  
  // Ações do ${nome}
  increment: () => void;
  decrement: () => void;
  updateText: (text: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  count: 0,
  text: '',
  isLoading: false,
};

export const use${nome}Store = create<${nome}State>()((set) => ({
  ...initialState,
  
  // Implementação das ações
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  updateText: (text: string) => set({ text }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  reset: () => set(initialState),
}));
`;
};

// Template para Zustand Store (JavaScript)
export const createZustandStoreJS = (nome) => {
  return `import { create } from 'zustand';

const initialState = {
  count: 0,
  text: '',
  isLoading: false,
};

export const use${nome}Store = create((set) => ({
  ...initialState,
  
  // Ações do ${nome}
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  updateText: (text) => set({ text }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
`;
};

// Template para Context API (TypeScript)
export const createContextTS = (nome) => {
  return `import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para o Context
interface ${nome}State {
  count: number;
  text: string;
  isLoading: boolean;
}

type ${nome}Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'UPDATE_TEXT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

interface ${nome}ContextType {
  state: ${nome}State;
  dispatch: React.Dispatch<${nome}Action>;
}

interface ${nome}ProviderProps {
  children: ReactNode;
}

// Estado inicial
const initialState: ${nome}State = {
  count: 0,
  text: '',
  isLoading: false,
};

// Reducer
const ${nome.toLowerCase()}Reducer = (state: ${nome}State, action: ${nome}Action): ${nome}State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'UPDATE_TEXT':
      return { ...state, text: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Context
const ${nome}Context = createContext<${nome}ContextType | undefined>(undefined);

// Provider
export const ${nome}Provider: React.FC<${nome}ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(${nome.toLowerCase()}Reducer, initialState);

  return (
    <${nome}Context.Provider value={{ state, dispatch }}>
      {children}
    </${nome}Context.Provider>
  );
};

// Hook customizado
export const use${nome}Context = (): ${nome}ContextType => {
  const context = useContext(${nome}Context);
  if (context === undefined) {
    throw new Error('use${nome}Context deve ser usado dentro de um ${nome}Provider');
  }
  return context;
};

// Actions helpers (opcional)
export const ${nome.toLowerCase()}Actions = {
  increment: (): ${nome}Action => ({ type: 'INCREMENT' }),
  decrement: (): ${nome}Action => ({ type: 'DECREMENT' }),
  updateText: (text: string): ${nome}Action => ({ type: 'UPDATE_TEXT', payload: text }),
  setLoading: (loading: boolean): ${nome}Action => ({ type: 'SET_LOADING', payload: loading }),
  reset: (): ${nome}Action => ({ type: 'RESET' }),
};
`;
};

// Template para Context API (JavaScript)
export const createContextJS = (nome) => {
  return `import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial
const initialState = {
  count: 0,
  text: '',
  isLoading: false,
};

// Reducer
const ${nome.toLowerCase()}Reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'UPDATE_TEXT':
      return { ...state, text: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Context
const ${nome}Context = createContext();

// Provider
export const ${nome}Provider = ({ children }) => {
  const [state, dispatch] = useReducer(${nome.toLowerCase()}Reducer, initialState);

  return (
    <${nome}Context.Provider value={{ state, dispatch }}>
      {children}
    </${nome}Context.Provider>
  );
};

// Hook customizado
export const use${nome}Context = () => {
  const context = useContext(${nome}Context);
  if (context === undefined) {
    throw new Error('use${nome}Context deve ser usado dentro de um ${nome}Provider');
  }
  return context;
};

// Actions helpers (opcional)
export const ${nome.toLowerCase()}Actions = {
  increment: () => ({ type: 'INCREMENT' }),
  decrement: () => ({ type: 'DECREMENT' }),
  updateText: (text) => ({ type: 'UPDATE_TEXT', payload: text }),
  setLoading: (loading) => ({ type: 'SET_LOADING', payload: loading }),
  reset: () => ({ type: 'RESET' }),
};
`;
};

// Template para testes (componente)
export const createComponentTestTemplate = (nome, ext, styled, emotion) => {
  if (styled || emotion) {
    return `import React from "react";
import { render, screen } from "@testing-library/react";
import { ${nome} } from "./${nome}";

describe("${nome}", () => {
  it("deve renderizar o componente corretamente", () => {
    render(<${nome} />);
    expect(screen.getByText("${nome} component")).toBeInTheDocument();
  });

  it("deve renderizar o container styled (${emotion ? 'emotion' : 'styled-components'})", () => {
    render(<${nome} />);
    const element = screen.getByText("${nome} component").closest("div");
    expect(element).toBeInTheDocument();
  });
});
`;
  } else {
    return `import React from "react";
import { render, screen } from "@testing-library/react";
import { ${nome} } from "./${nome}";

describe("${nome}", () => {
  it("deve renderizar o componente corretamente", () => {
    render(<${nome} />);
    expect(screen.getByText("${nome} component")).toBeInTheDocument();
  });

  it("deve aplicar as classes CSS corretas", () => {
    render(<${nome} />);
    const element = screen.getByText("${nome} component").closest("div");
    expect(element).toHaveClass("${nome.toLowerCase()}");
  });
});
`;
  }
};

// Template para arquivo index
export const createIndexTemplate = (nome, fileType, zustand, context, jsExt) => {
  let template = '';
  
  if (fileType === 'component') {
    template += `export { ${nome} } from "./${nome}";
`;
  }
  
  if (zustand) {
    template += `export { use${nome}Store } from "./store";
`;
  }
  
  if (context) {
    template += `export { ${nome}Provider, use${nome}Context, ${nome.toLowerCase()}Actions } from "./context";
`;
  }
  
  return template;
};