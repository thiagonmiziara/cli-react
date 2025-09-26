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