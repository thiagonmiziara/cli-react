#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

const program = new Command();

// Função para modo interativo
async function interactiveMode() {
  console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║'), chalk.bold.white('🎯 Modo Interativo - Criador de Componentes').padEnd(58), chalk.cyan('║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝'));
  console.log();
  
  // Primeiro pergunta: que tipo criar?
  const typeAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileType',
      message: '🎭 O que você deseja criar?',
      choices: [
        { name: '⚛️  Componente React', value: 'component' },
        { name: '🏪 Store Zustand', value: 'store' },
        { name: '🎯 Context API', value: 'context' }
      ],
      default: 'component'
    }
  ]);

  // Perguntas comuns
  const commonQuestions = [
    {
      type: 'input',
      name: 'nome',
      message: `📝 Qual o nome ${typeAnswer.fileType === 'component' ? 'do componente' : typeAnswer.fileType === 'store' ? 'da store' : 'do context'}?`,
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '❌ O nome é obrigatório!';
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input.trim())) {
          return '❌ O nome deve começar com letra maiúscula e conter apenas letras e números!';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'path',
      message: '📁 Em qual pasta criar? (Enter para raiz)',
      default: '.',
      validate: (input) => {
        // Validação básica de caminho
        if (input.includes('..') && !input.startsWith('./')) {
          return '❌ Use caminhos relativos que comecem com "./"';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: '🔷 Usar TypeScript?',
      default: false
    }
  ];

  // Adicionar perguntas específicas baseadas no tipo
  if (typeAnswer.fileType === 'component') {
    commonQuestions.push(
      {
        type: 'list',
        name: 'styleType',
        message: '🎨 Qual tipo de estilização usar?',
        choices: [
          { name: '📄 CSS tradicional', value: 'css' },
          { name: '💅 Styled Components', value: 'styled' },
          { name: '😊 Emotion', value: 'emotion' }
        ],
        default: 'css'
      },
      {
        type: 'confirm',
        name: 'includeTests',
        message: '🧪 Incluir arquivo de testes?',
        default: false
      },
      {
        type: 'confirm',
        name: 'createZustandStore',
        message: '🏪 Criar store Zustand também?',
        default: false
      },
      {
        type: 'confirm',
        name: 'createContextAPI',
        message: '🎯 Criar Context API também?',
        default: false
      }
    );
  }

  const answers = await inquirer.prompt(commonQuestions);

  return {
    nome: answers.nome.trim(),
    ts: answers.useTypeScript,
    styled: typeAnswer.fileType === 'component' ? answers.styleType === 'styled' : false,
    emotion: typeAnswer.fileType === 'component' ? answers.styleType === 'emotion' : false,
    path: answers.path,
    test: typeAnswer.fileType === 'component' ? answers.includeTests : false,
    zustand: typeAnswer.fileType === 'store' ? true : (answers.createZustandStore || false),
    context: typeAnswer.fileType === 'context' ? true : (answers.createContextAPI || false),
    fileType: typeAnswer.fileType
  };
}

// Função para criar o componente
async function createComponent(options) {
    const { nome, ts, styled, emotion, path: customPath, test, zustand, context, fileType = 'component' } = options;
    
    const ext = ts ? "tsx" : "jsx";
    const jsExt = ts ? "ts" : "js";
    
    // Resolver o caminho base (onde criar o componente)
    const basePath = path.resolve(process.cwd(), customPath || ".");
    const dir = path.join(basePath, nome);
    
    // Criar diretórios recursivamente se não existirem
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
      console.log(chalk.blue("📁"), chalk.bold("Diretório criado:"), chalk.gray(basePath));
    }
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Verificar se styled e emotion foram usados juntos
    if (styled && emotion) {
      console.log(chalk.red.bold("❌ ERRO:"), chalk.red("Não é possível usar"), chalk.yellow("styled"), chalk.red("e"), chalk.yellow("emotion"), chalk.red("juntos."));
      console.log(chalk.gray("💡 Escolha apenas uma das opções de estilização."));
      return;
    }

    // Banner de início
    console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
    const typeEmoji = fileType === 'store' ? '🏪' : fileType === 'context' ? '🎯' : '🎨';
    const typeText = fileType === 'store' ? 'store' : fileType === 'context' ? 'context' : 'componente';
    console.log(chalk.cyan('║'), chalk.bold.white(`${typeEmoji} Criando ${typeText}: ${nome}`).padEnd(58), chalk.cyan('║'));
    
    // Mostrar o caminho onde será criado
    const relativePath = path.relative(process.cwd(), dir);
    console.log(chalk.cyan('║'), chalk.gray(`📁 Caminho: ${relativePath}`).padEnd(58), chalk.cyan('║'));
    console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝'));
    console.log();

    // Criar arquivos baseados no tipo
    if (fileType === 'component') {
      // Template do componente principal
      let componentImports = `import React from "react";\n`;
      let componentContent = `export const ${nome} = () => {
  return (
    <div>
      <h1>${nome} component</h1>
    </div>
  );
};`;

    // Se styled components for solicitado
    if (styled) {
      componentImports += `import { Container } from "./styled";\n`;
      componentContent = `export const ${nome} = () => {
  return (
    <Container>
      <h1>${nome} component</h1>
    </Container>
  );
};`;

      // Criar arquivo styled
      const styledPath = path.join(dir, `styled.${jsExt}`);
      const styledTemplate = `import styled from "styled-components";

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
      fs.writeFileSync(styledPath, styledTemplate);
      console.log(chalk.blue("📦"), chalk.bold("Styled Components:"), chalk.gray(styledPath));
    } 
    // Se emotion for solicitado
    else if (emotion) {
      componentImports += `import { Container } from "./styles";\n`;
      componentContent = `export const ${nome} = () => {
  return (
    <Container>
      <h1>${nome} component</h1>
    </Container>
  );
};`;

      // Criar arquivo emotion
      const emotionPath = path.join(dir, `styles.${jsExt}`);
      const emotionTemplate = `import styled from "@emotion/styled";

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
      fs.writeFileSync(emotionPath, emotionTemplate);
      console.log(chalk.magenta("😊"), chalk.bold("Emotion Styles:"), chalk.gray(emotionPath));
    } 
    // Se não usar styled nem emotion, criar arquivo CSS normal
    else {
      componentImports += `import "./${nome}.css";\n`;
      
      const cssPath = path.join(dir, `${nome}.css`);
      const cssTemplate = `.${nome.toLowerCase()} {
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
      fs.writeFileSync(cssPath, cssTemplate);
      componentContent = `export const ${nome} = () => {
  return (
    <div className="${nome.toLowerCase()}">
      <h1>${nome} component</h1>
    </div>
  );
};`;
      console.log(chalk.blue("🎨"), chalk.bold("CSS Stylesheet:"), chalk.gray(cssPath));
    }

    // Criar arquivo do componente
    const componentTemplate = `${componentImports}
${componentContent}
`;
    const filePath = path.join(dir, `${nome}.${ext}`);
    fs.writeFileSync(filePath, componentTemplate);
    console.log(chalk.green("⚛️ "), chalk.bold("React Component:"), chalk.gray(filePath));

    // Se teste for solicitado
    if (test) {
      const testPath = path.join(dir, `${nome}.test.${ext}`);
      let testTemplate;
      
      if (styled || emotion) {
        testTemplate = `import React from "react";
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
        testTemplate = `import React from "react";
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
      
      fs.writeFileSync(testPath, testTemplate);
      console.log(chalk.yellow("🧪"), chalk.bold("Test File:"), chalk.gray(testPath));
    }
    } // Fim da condição de componente

    // Se Zustand store for solicitado
    if (zustand) {
      const storePath = path.join(dir, `store.${jsExt}`);
      let storeTemplate;
      
      if (ts) {
        storeTemplate = `import { create } from 'zustand';

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
      } else {
        storeTemplate = `import { create } from 'zustand';

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
      }
      
      fs.writeFileSync(storePath, storeTemplate);
      console.log(chalk.magenta("🏪"), chalk.bold("Zustand Store:"), chalk.gray(storePath));
    }

    // Se Context API for solicitado
    if (context) {
      const contextPath = path.join(dir, `context.${jsExt}`);
      let contextTemplate;
      
      if (ts) {
        contextTemplate = `import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
      } else {
        contextTemplate = `import React, { createContext, useContext, useReducer } from 'react';

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
      }
      
      fs.writeFileSync(contextPath, contextTemplate);
      console.log(chalk.blue("🎯"), chalk.bold("Context API:"), chalk.gray(contextPath));
    }

    // Criar arquivo index para facilitar importação
    const indexPath = path.join(dir, `index.${jsExt}`);
    let indexTemplate = '';
    
    // Adicionar exportações baseadas no tipo
    if (fileType === 'component') {
      indexTemplate += `export { ${nome} } from "./${nome}";
`;
    }
    
    // Adicionar exportações do Zustand se criado
    if (zustand) {
      indexTemplate += `export { use${nome}Store } from "./store";
`;
    }
    
    // Adicionar exportações do Context API se criado
    if (context) {
      indexTemplate += `export { ${nome}Provider, use${nome}Context, ${nome.toLowerCase()}Actions } from "./context";
`;
    }
    
    fs.writeFileSync(indexPath, indexTemplate);
    console.log(chalk.cyan("📋"), chalk.bold("Index File:"), chalk.gray(indexPath));

    // Banner de sucesso
    console.log();
    console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
    const successText = fileType === 'store' ? 'Store' : fileType === 'context' ? 'Context' : 'Componente';
    console.log(chalk.green('║'), chalk.bold.white(`✅ ${successText} ${nome} criado com sucesso!`).padEnd(58),            chalk.green('║'));
    console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝'));
    
    // Resumo do que foi criado
    console.log();
    console.log(chalk.bold.white("📁 Arquivos criados:"));
    
    const createdFiles = [];
    
    // Mostrar arquivos baseados no tipo
    if (fileType === 'component') {
      createdFiles.push(`   ${chalk.green("⚛️")}  ${nome}.${ext}`);
      
      if (styled) {
        createdFiles.push(`   ${chalk.blue("📦")}  styled.${jsExt}`);
      } else if (emotion) {
        createdFiles.push(`   ${chalk.magenta("😊")}  styles.${jsExt}`);
      } else {
        createdFiles.push(`   ${chalk.blue("🎨")}  ${nome}.css`);
      }
    }
    
    createdFiles.push(`   ${chalk.cyan("📋")}  index.${jsExt}`);
    
    if (test) {
      createdFiles.push(`   ${chalk.yellow("🧪")}  ${nome}.test.${ext}`);
    }
    
    if (zustand) {
      createdFiles.push(`   ${chalk.magenta("🏪")}  store.${jsExt}`);
    }
    
    if (context) {
      createdFiles.push(`   ${chalk.blue("🎯")}  context.${jsExt}`);
    }
    
    createdFiles.forEach(file => console.log(file));
    
    // Instruções de uso
    console.log();
    console.log(chalk.bold.white("🚀 Como usar:"));
    
    // Calcular o caminho relativo correto para importação
    const componentPath = path.relative(process.cwd(), dir);
    const importPath = componentPath === nome ? `./${nome}` : `./${componentPath}`;
    
    if (fileType === 'component') {
      console.log(`   ${chalk.gray("import")} ${chalk.white("{")} ${chalk.yellow(nome)} ${chalk.white("}")} ${chalk.gray("from")} ${chalk.green(`"${importPath}"`)}${chalk.gray(";")}`);
    } else if (fileType === 'store') {
      console.log(`   ${chalk.gray("import")} ${chalk.white("{")} ${chalk.yellow(`use${nome}Store`)} ${chalk.white("}")} ${chalk.gray("from")} ${chalk.green(`"${importPath}"`)}${chalk.gray(";")}`);
      console.log(`   ${chalk.gray("// No componente:")}`);
      console.log(`   ${chalk.gray("const")} ${chalk.white("{")} ${chalk.yellow("count, increment")} ${chalk.white("}")} ${chalk.gray("=")} ${chalk.yellow(`use${nome}Store`)}${chalk.gray("();")}`);
    } else if (fileType === 'context') {
      console.log(`   ${chalk.gray("import")} ${chalk.white("{")} ${chalk.yellow(`${nome}Provider, use${nome}Context`)} ${chalk.white("}")} ${chalk.gray("from")} ${chalk.green(`"${importPath}"`)}${chalk.gray(";")}`);
      console.log(`   ${chalk.gray("// No App.jsx:")}`);
      console.log(`   ${chalk.gray("<")}${chalk.yellow(nome + "Provider")}${chalk.gray(">")} ... ${chalk.gray("</")}${chalk.yellow(nome + "Provider")}${chalk.gray(">")}`);
      console.log(`   ${chalk.gray("// No componente:")}`);
      console.log(`   ${chalk.gray("const")} ${chalk.white("{")} ${chalk.yellow("state, dispatch")} ${chalk.white("}")} ${chalk.gray("=")} ${chalk.yellow("use" + nome + "Context")}${chalk.gray("();")}`);
    }
    
    console.log();
    const finalTypeText = fileType === 'store' ? 'Store' : fileType === 'context' ? 'Context' : 'Componente';
    console.log(chalk.gray(`💡 Dica: ${finalTypeText} criado em ${chalk.white(componentPath)}`));
    console.log(chalk.gray("💡 O arquivo index.js permite importar diretamente da pasta!"));
    console.log();
}

program
  .name("create-react-component")
  .description("🚀 CLI poderosa para gerar componentes React com suporte a CSS, Styled Components, Emotion, Zustand stores, Context API e testes")
  .version("1.0.3", "-v, --version", "mostrar versão")
  .helpOption('-h, --help', 'mostrar informações de ajuda');

program
  .argument("[nome]", "Nome do componente (opcional no modo interativo)")
  .option("-t, --ts", "Gerar componente em TypeScript", false)
  .option("-s, --styled", "Gerar arquivo de styled components", false)
  .option("-e, --emotion", "Gerar arquivo de emotion styled", false)
  .option("-p, --path <caminho>", "Caminho onde criar o componente (padrão: diretório atual)", ".")
  .option("-i, --interactive", "Modo interativo com perguntas", false)
  .option("--test", "Gerar arquivo de teste", false)
  .option("-z, --zustand", "Gerar store Zustand", false)
  .option("-c, --context", "Gerar Context API", false)
  .addHelpText('before', `
${chalk.cyan('╔══════════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('🎨 CLI React Components Generator')}                           ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('Ferramenta para criar componentes React rapidamente')}         ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════════════╝')}
`)
  .addHelpText('after', `
${chalk.yellow('💡 EXEMPLOS DE USO:')}
  ${chalk.green('$')} ${chalk.white('create-react-component --interactive')}            ${chalk.gray('# 🎯 Modo interativo com perguntas')}
  ${chalk.green('$')} ${chalk.white('create-react-component -i')}                       ${chalk.gray('# 🎯 Modo interativo (alias)')}
  ${chalk.green('$')} ${chalk.white('create-react-component Button')}                    ${chalk.gray('# 📄 Componente básico na raiz')}
  ${chalk.green('$')} ${chalk.white('create-react-component Modal --ts')}                ${chalk.gray('# 🔷 Componente TypeScript')}
  ${chalk.green('$')} ${chalk.white('create-react-component Header --styled')}           ${chalk.gray('# 💅 Componente com Styled Components')}
  ${chalk.green('$')} ${chalk.white('create-react-component Sidebar --emotion')}         ${chalk.gray('# 😊 Componente com Emotion')}
  ${chalk.green('$')} ${chalk.white('create-react-component Card --path ./src')}         ${chalk.gray('# 📁 Criar em pasta específica')}
  ${chalk.green('$')} ${chalk.white('create-react-component Nav -p ./src/components')}   ${chalk.gray('# 📁 Usar alias -p')}
  ${chalk.green('$')} ${chalk.white('create-react-component Form --ts --test --path ./src/forms')} ${chalk.gray('# 🚀 Completo com caminho')}
  ${chalk.green('$')} ${chalk.white('create-react-component UserStore --zustand --ts')}         ${chalk.gray('# 🏪 Componente com Zustand store')}
  ${chalk.green('$')} ${chalk.white('create-react-component AuthContext --context --ts')}       ${chalk.gray('# 🎯 Componente com Context API')}
  ${chalk.green('$')} ${chalk.white('create-react-component Dashboard -z -c --ts')}             ${chalk.gray('# 🔥 Componente com Zustand e Context')}

${chalk.yellow('📁 ESTRUTURAS DE CAMINHO:')}
  ${chalk.blue('Sem --path:')}       ${chalk.white('./NomeComponente/')} ${chalk.gray('(na raiz do projeto)')}
  ${chalk.blue('--path ./src:')}     ${chalk.white('./src/NomeComponente/')} ${chalk.gray('(dentro de src)')}
  ${chalk.blue('--path ./components:')} ${chalk.white('./components/NomeComponente/')} ${chalk.gray('(dentro de components)')}
  ${chalk.blue('Caminhos relativos:')} ${chalk.gray('Sempre relativos ao diretório atual')}

${chalk.yellow('📁 ESTRUTURAS GERADAS:')}
  ${chalk.blue('Básico:')}           ${chalk.white('NomeComponente/')} ${chalk.gray('NomeComponente.jsx + NomeComponente.css + index.js')}
  ${chalk.blue('--styled:')}         ${chalk.white('NomeComponente/')} ${chalk.gray('NomeComponente.jsx + styled.js + index.js')}
  ${chalk.blue('--emotion:')}        ${chalk.white('NomeComponente/')} ${chalk.gray('NomeComponente.jsx + styles.js + index.js')}
  ${chalk.blue('--test:')}           ${chalk.gray('Adiciona')} ${chalk.white('NomeComponente.test.jsx')} ${chalk.gray('com testes básicos')}
  ${chalk.blue('--ts:')}             ${chalk.gray('Usa extensões')} ${chalk.white('.tsx/.ts')} ${chalk.gray('em vez de')} ${chalk.white('.jsx/.js')}
  ${chalk.blue('--zustand:')}        ${chalk.gray('Adiciona')} ${chalk.white('store.js/ts')} ${chalk.gray('com Zustand store')}
  ${chalk.blue('--context:')}        ${chalk.gray('Adiciona')} ${chalk.white('context.js/ts')} ${chalk.gray('com Context API')}

${chalk.yellow('⚠️  NOTAS IMPORTANTES:')}
  ${chalk.red('•')} Não é possível usar ${chalk.white('--styled')} e ${chalk.white('--emotion')} juntos
  ${chalk.green('•')} Cada componente é criado em sua própria pasta
  ${chalk.green('•')} Arquivo ${chalk.white('index.js/ts')} é sempre criado para facilitar importações
  ${chalk.green('•')} Caminhos são criados automaticamente se não existirem
  ${chalk.green('•')} TypeScript (${chalk.white('--ts')}) funciona com todas as outras opções
  ${chalk.green('•')} Zustand (${chalk.white('--zustand')}) cria store com actions pré-definidas
  ${chalk.green('•')} Context API (${chalk.white('--context')}) cria provider, hook e actions
  ${chalk.cyan('•')} Modo interativo (${chalk.white('--interactive')}) guia você através de todas as opções

${chalk.cyan('🔗 Para mais informações, visite:')} ${chalk.underline('https://github.com/thiagonmiziara/react-component-generator')}
`)
  .action(async (nome, options) => {
    let componentOptions;
    
    // Se modo interativo ou não há nome fornecido
    if (options.interactive || !nome) {
      componentOptions = await interactiveMode();
    } else {
      // Modo tradicional via flags
      // Verificar se o nome foi fornecido
      if (!nome || nome.trim() === '') {
        console.log(chalk.red.bold("❌ ERRO:"), chalk.red("Nome do componente é obrigatório"));
        console.log(chalk.gray("💡 Use"), chalk.cyan("'create-react-component --help'"), chalk.gray("para ver todas as opções"));
        console.log(chalk.gray("💡 Ou use"), chalk.cyan("'create-react-component --interactive'"), chalk.gray("para modo interativo"));
        return;
      }
      
      componentOptions = {
        nome: nome.trim(),
        ts: options.ts,
        styled: options.styled,
        emotion: options.emotion,
        path: options.path,
        test: options.test,
        zustand: options.zustand,
        context: options.context
      };
    }

    // Agora criar o componente com as opções escolhidas
    await createComponent(componentOptions);
  });

program.parse();