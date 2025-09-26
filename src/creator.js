import fs from "fs";
import path from "path";
import chalk from "chalk";
import {
  createComponentTemplate,
  createBasicComponent,
  createStyledComponent,
  createStyledTemplate,
  createEmotionTemplate,
  createCSSTemplate,
  createZustandStoreTS,
  createZustandStoreJS,
  createContextTS,
  createContextJS,
  createComponentTestTemplate,
  createIndexTemplate
} from "./templates.js";

/**
 * Função principal para criar componentes, stores e contexts
 */
export async function createComponent(options) {
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
      await createReactComponent({ nome, ts, styled, emotion, ext, jsExt, dir });
      
      if (test) {
        await createTestFile({ nome, ext, styled, emotion, dir });
      }
    }

    // Se Zustand store for solicitado
    if (zustand) {
      await createZustandStore({ nome, ts, jsExt, dir });
    }

    // Se Context API for solicitado
    if (context) {
      await createContextAPI({ nome, ts, jsExt, dir });
    }

    // Criar arquivo index para facilitar importação
    await createIndexFile({ nome, fileType, zustand, context, jsExt, dir });

    // Mostrar resultados
    showResults({ nome, fileType, styled, emotion, test, zustand, context, ext, jsExt, relativePath });
}

/**
 * Criar componente React
 */
async function createReactComponent({ nome, ts, styled, emotion, ext, jsExt, dir }) {
  // Template do componente principal
  let componentImports = `import React from "react";\n`;
  let componentContent;

  // Se styled components for solicitado
  if (styled) {
    componentImports += `import { Container } from "./styled";\n`;
    componentContent = createStyledComponent(nome);

    // Criar arquivo styled
    const styledPath = path.join(dir, `styled.${jsExt}`);
    const styledTemplate = createStyledTemplate(jsExt);
    fs.writeFileSync(styledPath, styledTemplate);
    console.log(chalk.blue("📦"), chalk.bold("Styled Components:"), chalk.gray(styledPath));
  } 
  // Se emotion for solicitado
  else if (emotion) {
    componentImports += `import { Container } from "./styles";\n`;
    componentContent = createStyledComponent(nome);

    // Criar arquivo emotion
    const emotionPath = path.join(dir, `styles.${jsExt}`);
    const emotionTemplate = createEmotionTemplate(jsExt);
    fs.writeFileSync(emotionPath, emotionTemplate);
    console.log(chalk.magenta("😊"), chalk.bold("Emotion Styles:"), chalk.gray(emotionPath));
  } 
  // Se não usar styled nem emotion, criar arquivo CSS normal
  else {
    componentImports += `import "./${nome}.css";\n`;
    
    const cssPath = path.join(dir, `${nome}.css`);
    const cssTemplate = createCSSTemplate(nome);
    fs.writeFileSync(cssPath, cssTemplate);
    componentContent = createBasicComponent(nome);
    console.log(chalk.blue("🎨"), chalk.bold("CSS Stylesheet:"), chalk.gray(cssPath));
  }

  // Criar arquivo do componente
  const componentTemplate = createComponentTemplate(nome, componentImports, componentContent);
  const filePath = path.join(dir, `${nome}.${ext}`);
  fs.writeFileSync(filePath, componentTemplate);
  console.log(chalk.green("⚛️ "), chalk.bold("React Component:"), chalk.gray(filePath));
}

/**
 * Criar arquivo de teste
 */
async function createTestFile({ nome, ext, styled, emotion, dir }) {
  const testPath = path.join(dir, `${nome}.test.${ext}`);
  const testTemplate = createComponentTestTemplate(nome, ext, styled, emotion);
  fs.writeFileSync(testPath, testTemplate);
  console.log(chalk.yellow("🧪"), chalk.bold("Test File:"), chalk.gray(testPath));
}

/**
 * Criar Zustand Store
 */
async function createZustandStore({ nome, ts, jsExt, dir }) {
  const storePath = path.join(dir, `store.${jsExt}`);
  const storeTemplate = ts ? createZustandStoreTS(nome) : createZustandStoreJS(nome);
  fs.writeFileSync(storePath, storeTemplate);
  console.log(chalk.magenta("🏪"), chalk.bold("Zustand Store:"), chalk.gray(storePath));
}

/**
 * Criar Context API
 */
async function createContextAPI({ nome, ts, jsExt, dir }) {
  const contextPath = path.join(dir, `context.${jsExt}`);
  const contextTemplate = ts ? createContextTS(nome) : createContextJS(nome);
  fs.writeFileSync(contextPath, contextTemplate);
  console.log(chalk.blue("🎯"), chalk.bold("Context API:"), chalk.gray(contextPath));
}

/**
 * Criar arquivo index
 */
async function createIndexFile({ nome, fileType, zustand, context, jsExt, dir }) {
  const indexPath = path.join(dir, `index.${jsExt}`);
  const indexTemplate = createIndexTemplate(nome, fileType, zustand, context, jsExt);
  fs.writeFileSync(indexPath, indexTemplate);
  console.log(chalk.cyan("📋"), chalk.bold("Index File:"), chalk.gray(indexPath));
}

/**
 * Mostrar resultados da criação
 */
function showResults({ nome, fileType, styled, emotion, test, zustand, context, ext, jsExt, relativePath }) {
  // Banner de sucesso
  console.log();
  console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
  const successText = fileType === 'store' ? 'Store' : fileType === 'context' ? 'Context' : 'Componente';
  console.log(chalk.green('║'), chalk.bold.white(`✅ ${successText} ${nome} criado com sucesso!`).padEnd(58), chalk.green('║'));
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
  const importPath = relativePath === nome ? `./${nome}` : `./${relativePath}`;
  
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
  console.log(chalk.gray("💡 Dica: " + finalTypeText + " criado em " + chalk.white(relativePath)));
  console.log(chalk.gray("💡 O arquivo index.js permite importar diretamente da pasta!"));
  console.log();
}