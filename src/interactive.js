import chalk from "chalk";
import inquirer from "inquirer";

/**
 * Função para modo interativo
 * Faz perguntas para o usuário escolher as opções
 */
export async function interactiveMode() {
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
        { name: '🎯 Context API', value: 'context' },
        { name: '🚀 Projeto React + Vite', value: 'project' }
      ],
      default: 'component'
    }
  ]);

  // Se for criar um projeto completo
  if (typeAnswer.fileType === 'project') {
    return await projectMode();
  }

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

/**
 * Modo para criar projeto completo
 */
export async function projectMode() {
  console.log(chalk.cyan('\n🚀 Configuração do Projeto React + Vite\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '📝 Nome do projeto:',
      default: 'my-react-app',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '❌ O nome do projeto é obrigatório!';
        }
        if (!/^[a-z0-9-]+$/.test(input.trim())) {
          return '❌ Use apenas letras minúsculas, números e hífens!';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: '🔷 Usar TypeScript?',
      default: true
    },
    {
      type: 'confirm',
      name: 'installShadcn',
      message: '🎨 Instalar e configurar shadcn/ui?',
      default: true
    },
    {
      type: 'checkbox',
      name: 'shadcnComponents',
      message: '📦 Quais componentes do shadcn/ui deseja instalar?',
      when: (answers) => answers.installShadcn,
      choices: [
        { name: 'Button', value: 'button', checked: true },
        { name: 'Input', value: 'input', checked: true },
        { name: 'Card', value: 'card', checked: true },
        { name: 'Dialog', value: 'dialog', checked: true },
        { name: 'Dropdown Menu', value: 'dropdown-menu', checked: true },
        { name: 'Select', value: 'select', checked: true },
        { name: 'Table', value: 'table', checked: false },
        { name: 'Toast', value: 'toast', checked: false },
        { name: 'Form', value: 'form', checked: false },
        { name: 'Tabs', value: 'tabs', checked: false },
        { name: 'Avatar', value: 'avatar', checked: false },
        { name: 'Badge', value: 'badge', checked: false }
      ]
    },
    {
      type: 'checkbox',
      name: 'additionalPackages',
      message: '📦 Pacotes adicionais para instalar:',
      choices: [
        { name: 'React Router DOM', value: 'react-router-dom', checked: true },
        { name: 'Zustand (gerenciamento de estado)', value: 'zustand', checked: true },
        { name: 'Axios', value: 'axios', checked: true },
        { name: 'React Query', value: '@tanstack/react-query', checked: false },
        { name: 'Date-fns', value: 'date-fns', checked: false },
        { name: 'Zod (validação)', value: 'zod', checked: false }
      ]
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: '📚 Inicializar repositório Git?',
      default: true
    }
  ]);

  return {
    fileType: 'project',
    projectName: answers.projectName.trim(),
    ts: answers.useTypeScript,
    installShadcn: answers.installShadcn,
    shadcnComponents: answers.shadcnComponents || [],
    additionalPackages: answers.additionalPackages || [],
    initGit: answers.initGit
  };
}