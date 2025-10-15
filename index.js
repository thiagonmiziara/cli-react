#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { interactiveMode } from "./src/interactive.js";
import { createComponent } from "./src/creator.js";
import { createProject } from "./src/project-creator.js";

const program = new Command();

program
  .name("create-react-component")
  .description("🚀 CLI poderosa para gerar componentes React com suporte a CSS, Styled Components, Emotion, Zustand stores, Context API e testes")
  .version("1.1.0")
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
  .option("--project", "Criar projeto React + Vite completo", false)
  .addHelpText('before', `
${chalk.cyan('╔══════════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('🎨 CLI React Components Generator')}                           ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('Ferramenta para criar componentes React rapidamente')}         ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════════════╝')}
`)
  .addHelpText('after', `
${chalk.yellow('💡 EXEMPLOS DE USO:')}
  ${chalk.green('$')} ${chalk.white('create-react-component --interactive')}            ${chalk.gray('# 🎯 Modo interativo com perguntas')}
  ${chalk.green('$')} ${chalk.white('create-react-component --project')}                ${chalk.gray('# 🚀 Criar projeto React + Vite completo')}
  ${chalk.green('$')} ${chalk.white('create-react-component -i')}                       ${chalk.gray('# 🎯 Modo interativo (alias)')}
  ${chalk.green('$')} ${chalk.white('create-react-component Button')}                    ${chalk.gray('# 📄 Componente básico na raiz')}
  ${chalk.green('$')} ${chalk.white('create-react-component Modal --ts')}                ${chalk.gray('# 🔷 Componente TypeScript')}
  ${chalk.green('$')} ${chalk.white('create-react-component Header --styled')}           ${chalk.gray('# 💅 Componente com Styled Components')}
  ${chalk.green('$')} ${chalk.white('create-react-component Sidebar --emotion')}         ${chalk.gray('# 😊 Componente com Emotion')}
  ${chalk.green('$')} ${chalk.white('create-react-component Card --path ./src')}         ${chalk.gray('# 📁 Criar em pasta específica')}
  ${chalk.green('$')} ${chalk.white('create-react-component UserStore --zustand --ts')}         ${chalk.gray('# 🏪 Componente com Zustand store')}
  ${chalk.green('$')} ${chalk.white('create-react-component AuthContext --context --ts')}       ${chalk.gray('# 🎯 Componente com Context API')}

${chalk.yellow('� CRIAR PROJETO COMPLETO:')}
  ${chalk.blue('--project')}  ${chalk.gray('Cria um projeto React + Vite com:')}
    ${chalk.gray('• Vite configurado')}
    ${chalk.gray('• shadcn/ui (opcional) com componentes pré-instalados')}
    ${chalk.gray('• Tailwind CSS configurado')}
    ${chalk.gray('• Estrutura de pastas organizada')}
    ${chalk.gray('• Pacotes adicionais (React Router, Zustand, Axios, etc)')}
    ${chalk.gray('• Git inicializado (opcional)')}

${chalk.cyan('🔗 Para mais informações, visite:')} ${chalk.underline('https://github.com/thiagonmiziara/cli-react')}
`)
  .action(async (nome, options) => {
    let componentOptions;
    
    // Se modo projeto - vai direto para criação de projeto
    if (options.project) {
      const { projectMode } = await import('./src/interactive.js');
      componentOptions = await projectMode();
      await createProject(componentOptions);
      return;
    }
    
    // Se modo interativo ou não há nome fornecido
    if (options.interactive || !nome) {
      componentOptions = await interactiveMode();
      
      // Se escolheu criar projeto
      if (componentOptions.fileType === 'project') {
        await createProject(componentOptions);
        return;
      }
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

    // Criar o componente com as opções escolhidas
    await createComponent(componentOptions);
  });

program.parse();