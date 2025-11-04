import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Clonar boilerplate Next.js
 */
export async function cloneNextjsBoilerplate(options) {
  const { projectName, installDependencies, openInVscode, removeGitHistory } = options;
  
  const projectPath = path.join(process.cwd(), projectName);
  const repoUrl = 'https://github.com/thiagonmiziara/boileerplate-next.git';
  
  // Verificar se o diretório já existe
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red.bold('❌ ERRO:'), chalk.red(`O diretório '${projectName}' já existe!`));
    return;
  }

  console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║'), chalk.bold.white(`⚡ Clonando Boilerplate Next.js: ${projectName}`).padEnd(58), chalk.cyan('║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝\n'));

  try {
    // 1. Clonar repositório
    await cloneRepository(repoUrl, projectName);
    
    // 2. Remover histórico Git se solicitado
    if (removeGitHistory) {
      await removeGitHistoryFolder(projectPath);
    }
    
    // 3. Atualizar package.json com novo nome
    await updatePackageJson(projectPath, projectName);
    
    // 4. Instalar dependências se solicitado
    if (installDependencies) {
      await installProjectDependencies(projectPath);
    }
    
    // 5. Inicializar novo repositório Git
    if (removeGitHistory) {
      await initializeNewGit(projectPath);
    }
    
    // 6. Abrir no VS Code se solicitado
    if (openInVscode) {
      await openInVSCode(projectPath);
    }
    
    // Mostrar mensagem de sucesso
    showNextjsSuccessMessage(projectName, installDependencies, openInVscode);
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ ERRO ao clonar boilerplate:'), chalk.red(error.message));
    console.log(chalk.gray('\n💡 Verifique sua conexão com a internet e tente novamente.'));
  }
}

/**
 * Clonar repositório
 */
async function cloneRepository(repoUrl, projectName) {
  console.log(chalk.blue('📥'), chalk.bold('Clonando repositório...'));
  
  try {
    execSync(`git clone ${repoUrl} ${projectName}`, {
      stdio: 'inherit'
    });
    console.log(chalk.green('✅'), chalk.bold('Repositório clonado com sucesso!\n'));
  } catch (error) {
    throw new Error('Falha ao clonar repositório. Verifique se o Git está instalado.');
  }
}

/**
 * Remover histórico Git
 */
async function removeGitHistoryFolder(projectPath) {
  console.log(chalk.blue('🗑️ '), chalk.bold('Removendo histórico Git...'));
  
  try {
    const gitPath = path.join(projectPath, '.git');
    if (fs.existsSync(gitPath)) {
      fs.rmSync(gitPath, { recursive: true, force: true });
    }
    console.log(chalk.green('✅'), chalk.bold('Histórico Git removido!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Aviso: Não foi possível remover o histórico Git\n'));
  }
}

/**
 * Atualizar package.json
 */
async function updatePackageJson(projectPath, projectName) {
  console.log(chalk.blue('📝'), chalk.bold('Atualizando package.json...'));
  
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.name = projectName;
      packageJson.version = '1.0.0';
      
      // Remover campos específicos do boilerplate original
      delete packageJson.repository;
      delete packageJson.bugs;
      delete packageJson.homepage;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(chalk.green('✅'), chalk.bold('package.json atualizado!\n'));
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Aviso: Não foi possível atualizar package.json\n'));
  }
}

/**
 * Instalar dependências
 */
async function installProjectDependencies(projectPath) {
  console.log(chalk.blue('📦'), chalk.bold('Instalando dependências...'));
  console.log(chalk.gray('  Isso pode demorar alguns minutos...\n'));
  
  try {
    execSync('npm install', {
      cwd: projectPath,
      stdio: 'inherit'
    });
    console.log(chalk.green('✅'), chalk.bold('Dependências instaladas!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Aviso: Falha ao instalar dependências automaticamente'));
    console.log(chalk.gray('  Execute "npm install" manualmente na pasta do projeto\n'));
  }
}

/**
 * Inicializar novo repositório Git
 */
async function initializeNewGit(projectPath) {
  console.log(chalk.blue('📚'), chalk.bold('Inicializando novo repositório Git...'));
  
  try {
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
    execSync('git add .', { cwd: projectPath, stdio: 'inherit' });
    execSync('git commit -m "Initial commit from Next.js boilerplate"', { 
      cwd: projectPath, 
      stdio: 'inherit' 
    });
    console.log(chalk.green('✅'), chalk.bold('Novo repositório Git inicializado!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Aviso: Git não foi inicializado\n'));
  }
}

/**
 * Abrir no VS Code
 */
async function openInVSCode(projectPath) {
  console.log(chalk.blue('🆚'), chalk.bold('Abrindo no VS Code...'));
  
  try {
    execSync(`code "${projectPath}"`, { stdio: 'inherit' });
    console.log(chalk.green('✅'), chalk.bold('Projeto aberto no VS Code!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Aviso: Não foi possível abrir no VS Code'));
    console.log(chalk.gray('  Verifique se o VS Code está instalado e disponível no PATH\n'));
  }
}

/**
 * Mostrar mensagem de sucesso
 */
function showNextjsSuccessMessage(projectName, installedDeps, openedVscode) {
  console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('║'), chalk.bold.white(`✅ Boilerplate Next.js criado: ${projectName}`).padEnd(58), chalk.green('║'));
  console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝\n'));
  
  console.log(chalk.bold.white('⚡ Recursos incluídos no boilerplate:'));
  console.log(chalk.gray('   • Next.js 14+ com App Router'));
  console.log(chalk.gray('   • TypeScript configurado'));
  console.log(chalk.gray('   • Tailwind CSS'));
  console.log(chalk.gray('   • shadcn/ui componentes'));
  console.log(chalk.gray('   • ESLint + Prettier'));
  console.log(chalk.gray('   • Estrutura organizada'));
  console.log(chalk.gray('   • Configurações prontas para produção'));
  
  console.log(chalk.bold.white('\n🚀 Próximos passos:'));
  console.log(chalk.gray(`   cd ${projectName}`));
  
  if (!installedDeps) {
    console.log(chalk.gray('   npm install'));
  }
  
  console.log(chalk.gray('   npm run dev'));
  
  if (!openedVscode) {
    console.log(chalk.gray(`   code ${projectName}  # Para abrir no VS Code`));
  }
  
  console.log(chalk.bold.white('\n📚 Comandos disponíveis:'));
  console.log(chalk.gray('   npm run dev         - Servidor de desenvolvimento'));
  console.log(chalk.gray('   npm run build       - Build para produção'));
  console.log(chalk.gray('   npm run start       - Iniciar em produção'));
  console.log(chalk.gray('   npm run lint        - Executar ESLint'));
  
  console.log(chalk.bold.yellow('\n🔗 Links úteis:'));
  console.log(chalk.gray('   📖 Boilerplate: https://github.com/thiagonmiziara/boileerplate-next'));
  console.log(chalk.gray('   📘 Next.js: https://nextjs.org/docs'));
  console.log(chalk.gray('   🎨 shadcn/ui: https://ui.shadcn.com'));
  console.log();
}