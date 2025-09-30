#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { interactiveMode } from "./src/interactive.js";
import { createComponent } from "./src/creator.js";

const program = new Command();

program
  .name("create-react-component")
  .description("🚀 CLI poderosa para gerar componentes React com suporte a CSS, Styled Components, Emotion, Zustand stores, Context API e testes")
  .version("1.0.0")
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

${chalk.cyan('🔗 Para mais informações, visite:')} ${chalk.underline('https://github.com/thiagonmiziara/cli-react')}
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