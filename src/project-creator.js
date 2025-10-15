import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Criar projeto React com Vite
 */
export async function createProject(options) {
  const { projectName, ts, installShadcn, shadcnComponents, additionalPackages, initGit } = options;
  
  const projectPath = path.join(process.cwd(), projectName);
  
  // Verificar se o diretório já existe
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red.bold('❌ ERRO:'), chalk.red(`O diretório '${projectName}' já existe!`));
    return;
  }

  console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║'), chalk.bold.white(`🚀 Criando projeto: ${projectName}`).padEnd(58), chalk.cyan('║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝\n'));

  try {
    // 1. Criar projeto Vite
    await createViteProject(projectName, ts);
    
    // 2. Instalar dependências base
    await installBaseDependencies(projectPath);
    
    // 3. Configurar shadcn/ui se solicitado
    if (installShadcn) {
      await setupShadcn(projectPath, ts, shadcnComponents);
    }
    
    // 4. Instalar pacotes adicionais
    if (additionalPackages.length > 0) {
      await installAdditionalPackages(projectPath, additionalPackages);
    }
    
    // 5. Criar estrutura de pastas
    await createFolderStructure(projectPath, ts);
    
    // 6. Criar arquivos de exemplo
    await createExampleFiles(projectPath, ts, installShadcn);
    
    // 7. Criar exemplos baseados nos pacotes selecionados
    await createPackageExamples(projectPath, ts, additionalPackages);
    
    // 8. Inicializar Git se solicitado
    if (initGit) {
      await initializeGit(projectPath);
    }
    
    // Mostrar mensagem de sucesso
    showSuccessMessage(projectName, installShadcn, additionalPackages);
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ ERRO ao criar projeto:'), chalk.red(error.message));
    console.log(chalk.gray('\n💡 Tente executar os comandos manualmente.'));
  }
}

/**
 * Criar projeto Vite
 */
async function createViteProject(projectName, ts) {
  console.log(chalk.blue('📦'), chalk.bold('Criando projeto Vite...'));
  
  const template = ts ? 'react-ts' : 'react';
  
  try {
    // Criar projeto sem prompts interativos
    // Usar echo para responder "n" (não usar rolldown) e "n" (não instalar/iniciar agora)
    execSync(`echo -e "n\\nn" | npm create vite@latest ${projectName} -- --template ${template}`, {
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: '/bin/bash'
    });
    console.log(chalk.green('✅'), chalk.bold('Projeto Vite criado com sucesso!\n'));
  } catch (error) {
    throw new Error('Falha ao criar projeto Vite');
  }
}

/**
 * Instalar dependências base
 */
async function installBaseDependencies(projectPath) {
  console.log(chalk.blue('📦'), chalk.bold('Instalando dependências base...'));
  
  try {
    execSync('npm install', {
      cwd: projectPath,
      stdio: 'inherit'
    });
    console.log(chalk.green('✅'), chalk.bold('Dependências base instaladas!\n'));
  } catch (error) {
    throw new Error('Falha ao instalar dependências base');
  }
}

/**
 * Configurar shadcn/ui
 */
async function setupShadcn(projectPath, ts, components) {
  console.log(chalk.blue('🎨'), chalk.bold('Configurando shadcn/ui...'));
  
  try {
    // Instalar dependências do shadcn
    console.log(chalk.gray('  📦 Instalando dependências do shadcn...'));
    execSync('npm install -D tailwindcss@^3 postcss autoprefixer tailwindcss-animate', {
      cwd: projectPath,
      stdio: 'inherit'
    });
    execSync('npm install class-variance-authority clsx tailwind-merge lucide-react', {
      cwd: projectPath,
      stdio: 'inherit'
    });
    console.log(chalk.green('  ✅ Dependências instaladas!'));
    
    // Inicializar Tailwind
    console.log(chalk.gray('  ⚙️  Criando arquivos de configuração do Tailwind...'));
    
    // Criar tailwind.config.js com configurações do shadcn
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
    fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), tailwindConfigContent);
    
    // Criar postcss.config.js
    const postcssConfigContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    fs.writeFileSync(path.join(projectPath, 'postcss.config.js'), postcssConfigContent);
    
    console.log(chalk.green('  ✅ Arquivos de configuração criados!'));
    
    // Criar arquivo de configuração do shadcn
    createShadcnConfig(projectPath, ts);
    
    // Atualizar tailwind.config
    updateTailwindConfig(projectPath);
    
    // Criar arquivo globals.css
    createGlobalsCss(projectPath);
    
    // Criar utils
    createUtils(projectPath, ts);
    
    // Instalar componentes do shadcn
    if (components.length > 0) {
      console.log(chalk.gray('  📦 Instalando componentes do shadcn...'));
      for (const component of components) {
        console.log(chalk.gray(`    Instalando ${component}...`));
        try {
          execSync(`npx shadcn-ui@latest add ${component} --yes`, {
            cwd: projectPath,
            stdio: 'inherit'
          });
        } catch (error) {
          console.log(chalk.yellow(`    ⚠️  Aviso: Falha ao instalar ${component}, continuando...`));
        }
      }
    }
    
    console.log(chalk.green('✅'), chalk.bold('shadcn/ui configurado!\n'));
  } catch (error) {
    throw new Error('Falha ao configurar shadcn/ui: ' + error.message);
  }
}

/**
 * Criar arquivo de configuração do shadcn
 */
function createShadcnConfig(projectPath, ts) {
  const configContent = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "default",
    "rsc": false,
    "tsx": ts,
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/index.css",
      "baseColor": "slate",
      "cssVariables": true
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  };
  
  fs.writeFileSync(
    path.join(projectPath, 'components.json'),
    JSON.stringify(configContent, null, 2)
  );
}

/**
 * Atualizar tailwind.config
 */
function updateTailwindConfig(projectPath) {
  const configContent = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}`;
  
  fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), configContent);
}

/**
 * Criar globals.css
 */
function createGlobalsCss(projectPath) {
  const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'index.css'), cssContent);
}

/**
 * Criar arquivo utils
 */
function createUtils(projectPath, ts) {
  const libPath = path.join(projectPath, 'src', 'lib');
  if (!fs.existsSync(libPath)) {
    fs.mkdirSync(libPath, { recursive: true });
  }
  
  const ext = ts ? 'ts' : 'js';
  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs${ts ? ': ClassValue[]' : ''}) {
  return twMerge(clsx(inputs))
}`;
  
  fs.writeFileSync(path.join(libPath, `utils.${ext}`), utilsContent);
}

/**
 * Instalar pacotes adicionais
 */
async function installAdditionalPackages(projectPath, packages) {
  if (packages.length === 0) {
    return;
  }
  
  console.log(chalk.blue('📦'), chalk.bold('Instalando pacotes adicionais...'));
  console.log(chalk.gray(`  Pacotes: ${packages.join(', ')}`));
  
  try {
    const packagesStr = packages.join(' ');
    execSync(`npm install ${packagesStr}`, {
      cwd: projectPath,
      stdio: 'inherit'
    });
    console.log(chalk.green('✅'), chalk.bold('Pacotes adicionais instalados!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Alguns pacotes podem não ter sido instalados corretamente\n'));
  }
}

/**
 * Criar estrutura de pastas
 */
async function createFolderStructure(projectPath, ts) {
  console.log(chalk.blue('📁'), chalk.bold('Criando estrutura de pastas...'));
  
  const folders = [
    'src/components/ui',
    'src/pages',
    'src/hooks',
    'src/lib',
    'src/services',
    'src/stores',
    'src/contexts',
    'src/types',
    'src/utils',
    'src/assets'
  ];
  
  folders.forEach(folder => {
    const folderPath = path.join(projectPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
  
  console.log(chalk.green('✅'), chalk.bold('Estrutura de pastas criada!\n'));
}

/**
 * Criar arquivos de exemplo
 */
async function createExampleFiles(projectPath, ts, hasShadcn) {
  console.log(chalk.blue('📝'), chalk.bold('Criando arquivos de exemplo...'));
  
  const ext = ts ? 'tsx' : 'jsx';
  
  // Criar App.tsx/jsx
  const appContent = hasShadcn ? `import './index.css'
import { Terminal, Code, Sparkles, Package, FileCode, Settings, GitBranch, Check } from 'lucide-react'

function App() {
  const commands = [
    { cmd: 'crc --interactive', desc: 'Modo interativo com perguntas', icon: '🎯' },
    { cmd: 'crc --project', desc: 'Criar projeto React + Vite completo', icon: '🚀' },
    { cmd: 'crc Button --ts', desc: 'Componente TypeScript', icon: '🔷' },
    { cmd: 'crc Header --styled', desc: 'Com Styled Components', icon: '💅' },
    { cmd: 'crc Card --path ./src', desc: 'Em pasta específica', icon: '📁' },
    { cmd: 'crc UserStore --zustand --ts', desc: 'Com Zustand store', icon: '🏪' }
  ]

  const features = [
    { title: 'Componentes React', desc: 'Crie componentes rapidamente com estrutura organizada', icon: <FileCode className="w-6 h-6" /> },
    { title: 'TypeScript', desc: 'Suporte completo para TypeScript', icon: <Code className="w-6 h-6" /> },
    { title: 'Styled Components', desc: 'CSS-in-JS com Styled Components ou Emotion', icon: <Sparkles className="w-6 h-6" /> },
    { title: 'Zustand Store', desc: 'Gerenciamento de estado com Zustand', icon: <Package className="w-6 h-6" /> },
    { title: 'Context API', desc: 'Contextos React pré-configurados', icon: <Settings className="w-6 h-6" /> },
    { title: 'Projetos Completos', desc: 'Crie projetos Vite + shadcn/ui automaticamente', icon: <GitBranch className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">CLI React Component Generator</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Crie Componentes React
            <br />
            em Segundos
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            CLI poderosa para gerar componentes React com suporte a TypeScript, 
            Styled Components, Zustand, Context API e projetos completos com Vite + shadcn/ui
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <a 
              href="https://github.com/thiagonmiziara/cli-react" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <GitBranch className="w-5 h-5" />
              Ver no GitHub
            </a>
            <a 
              href="https://www.npmjs.com/package/mizi-react-component-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-slate-700"
            >
              <Package className="w-5 h-5" />
              NPM Package
            </a>
          </div>

          {/* Installation */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-slate-400 text-sm mb-2">Instalação</p>
            <code className="text-purple-300 text-lg font-mono">
              npm install -g mizi-react-component-generator
            </code>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            ✨ Funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commands Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            💡 Exemplos de Comandos
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {commands.map((item, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <code className="text-purple-300 font-mono text-sm block mb-1">
                      {item.cmd}
                    </code>
                    <p className="text-slate-400 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            📦 O que está incluído neste projeto
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>React + Vite</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>shadcn/ui + Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Estrutura organizada</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Path aliases (@/)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Pronto para produção</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-400">
          <p>Feito com ❤️ por Thiago Miziara</p>
          <p className="text-sm mt-2">
            Comece editando <code className="text-purple-400">src/App.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App` : `import './index.css'

function App() {
  const commands = [
    { cmd: 'crc --interactive', desc: 'Modo interativo com perguntas', icon: '🎯' },
    { cmd: 'crc --project', desc: 'Criar projeto React + Vite completo', icon: '🚀' },
    { cmd: 'crc Button --ts', desc: 'Componente TypeScript', icon: '🔷' },
    { cmd: 'crc Header --styled', desc: 'Com Styled Components', icon: '💅' },
    { cmd: 'crc Card --path ./src', desc: 'Em pasta específica', icon: '📁' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)', color: 'white', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '9999px', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#c084fc', fontWeight: '500' }}>⚡ CLI React Component Generator</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', background: 'linear-gradient(to right, #c084fc, #f9a8d4, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Crie Componentes React em Segundos
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem' }}>
            CLI poderosa para gerar componentes React com TypeScript, Styled Components, Zustand e projetos completos
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <a 
              href="https://github.com/thiagonmiziara/cli-react" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#7c3aed', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', color: 'white' }}
            >
              📚 Ver no GitHub
            </a>
            <a 
              href="https://www.npmjs.com/package/mizi-react-component-generator"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', color: 'white', border: '1px solid #334155' }}
            >
              📦 NPM Package
            </a>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '42rem', margin: '0 auto' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Instalação</p>
            <code style={{ color: '#c084fc', fontSize: '1.125rem', fontFamily: 'monospace' }}>
              npm install -g mizi-react-component-generator
            </code>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            💡 Exemplos de Comandos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', maxWidth: '56rem', margin: '0 auto' }}>
            {commands.map((item, index) => (
              <div 
                key={index}
                style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <code style={{ color: '#c084fc', fontFamily: 'monospace', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      {item.cmd}
                    </code>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>
          <p>Feito com ❤️ por Thiago Miziara</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Comece editando <code style={{ color: '#c084fc' }}>src/App.${ext}</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App`;
  
  fs.writeFileSync(path.join(projectPath, 'src', `App.${ext}`), appContent);
  
  // Criar vite.config com alias
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`;
  
  fs.writeFileSync(path.join(projectPath, 'vite.config.' + (ts ? 'ts' : 'js')), viteConfig);
  
  // Atualizar tsconfig.json se for TypeScript
  if (ts) {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*']
        }
      };
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
  }
  
  console.log(chalk.green('✅'), chalk.bold('Arquivos de exemplo criados!\n'));
}

/**
 * Criar exemplos baseados nos pacotes selecionados
 */
async function createPackageExamples(projectPath, ts, packages) {
  const ext = ts ? 'ts' : 'js';
  const hasZustand = packages.includes('zustand');
  const hasReactQuery = packages.includes('@tanstack/react-query');
  const hasAxios = packages.includes('axios');
  const hasZod = packages.includes('zod');
  
  // Se nenhum pacote relevante foi selecionado, retornar
  if (!hasZustand && !hasReactQuery && !hasAxios && !hasZod) {
    return;
  }
  
  console.log(chalk.blue('✨'), chalk.bold('Criando arquivos de exemplo dos pacotes selecionados...'));
  
  // 1. Criar exemplos de Zustand Store
  if (hasZustand) {
    console.log(chalk.gray('  📦 Criando exemplos de Zustand Store...'));
    createZustandExamples(projectPath, ts);
  }
  
  // 2. Criar exemplos de Services com Axios
  if (hasAxios) {
    console.log(chalk.gray('  🌐 Criando exemplos de Services com Axios...'));
    createAxiosExamples(projectPath, ts, hasZod);
  }
  
  // 3. Criar exemplos de React Query
  if (hasReactQuery && hasAxios) {
    console.log(chalk.gray('  🔄 Criando exemplos de React Query...'));
    createReactQueryExamples(projectPath, ts, hasZod);
  }
  
  // 4. Criar queryClient e Provider se tiver React Query
  if (hasReactQuery) {
    console.log(chalk.gray('  ⚙️  Configurando React Query Provider...'));
    createReactQuerySetup(projectPath, ts);
  }
  
  // 5. Criar página de exemplo usando os hooks
  if (hasZustand || hasReactQuery) {
    console.log(chalk.gray('  📄 Criando página de exemplo...'));
    createExampleUsagePage(projectPath, ts, hasZustand, hasReactQuery, hasAxios, hasZod);
  }
  
  // 6. Criar README com documentação dos exemplos
  console.log(chalk.gray('  📋 Criando documentação...'));
  createExamplesReadme(projectPath, hasZustand, hasReactQuery, hasAxios, hasZod);
  
  console.log(chalk.green('✅'), chalk.bold('Exemplos dos pacotes criados com sucesso!\n'));
}

/**
 * Criar exemplos de Zustand
 */
function createZustandExamples(projectPath, ts) {
  const ext = ts ? 'ts' : 'js';
  
  // Store de usuário com persistência
  const userStoreContent = ts ? `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definição dos tipos
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  toggleTheme: () => void;
}

// Store com persistência no localStorage
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        theme: state.theme 
      }),
    }
  )
);` : `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'light',
};

export const useUserStore = create(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'stores', `userStore.${ext}`), userStoreContent);
  
  // Store de todos com DevTools
  const todoStoreContent = ts ? `import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, data: Partial<Todo>) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      filter: 'all',

      addTodo: (todo) =>
        set(
          (state) => ({
            todos: [
              ...state.todos,
              {
                ...todo,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          }),
          false,
          'addTodo'
        ),

      removeTodo: (id) =>
        set(
          (state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }),
          false,
          'removeTodo'
        ),

      toggleTodo: (id) =>
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          }),
          false,
          'toggleTodo'
        ),

      updateTodo: (id, data) =>
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...data } : todo
            ),
          }),
          false,
          'updateTodo'
        ),

      setFilter: (filter) =>
        set({ filter }, false, 'setFilter'),

      clearCompleted: () =>
        set(
          (state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
          }),
          false,
          'clearCompleted'
        ),
    }),
    { name: 'TodoStore' }
  )
);

// Selector customizado
export const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
};` : `import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useTodoStore = create(
  devtools(
    (set) => ({
      todos: [],
      filter: 'all',

      addTodo: (todo) =>
        set(
          (state) => ({
            todos: [
              ...state.todos,
              {
                ...todo,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          }),
          false,
          'addTodo'
        ),

      removeTodo: (id) =>
        set(
          (state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }),
          false,
          'removeTodo'
        ),

      toggleTodo: (id) =>
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          }),
          false,
          'toggleTodo'
        ),

      updateTodo: (id, data) =>
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...data } : todo
            ),
          }),
          false,
          'updateTodo'
        ),

      setFilter: (filter) =>
        set({ filter }, false, 'setFilter'),

      clearCompleted: () =>
        set(
          (state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
          }),
          false,
          'clearCompleted'
        ),
    }),
    { name: 'TodoStore' }
  )
);

export const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
};`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'stores', `todoStore.${ext}`), todoStoreContent);
}

/**
 * Criar exemplos de Axios Services
 */
function createAxiosExamples(projectPath, ts, hasZod) {
  const ext = ts ? 'ts' : 'js';
  
  // API base configuration
  const apiContent = ts ? `import axios${hasZod ? ', { AxiosError, type AxiosRequestConfig }' : ''} from 'axios';

// Configuração base do Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta - trata erros
api.interceptors.response.use(
  (response) => response,
  (error${ts ? ': AxiosError' : ''}) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acesso negado');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
      }
    }
    return Promise.reject(error);
  }
);${hasZod ? `

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api.request<T>(config);
  return response.data;
};` : ''}` : `import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acesso negado');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
      }
    }
    return Promise.reject(error);
  }
);`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'services', `api.${ext}`), apiContent);
  
  // User Service com Zod
  const userServiceContent = hasZod ? (ts ? `import { api } from './api';
import { z } from 'zod';

// Schema Zod para validação
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  avatar: z.string().url().optional(),
  createdAt: z.string().datetime().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Tipos inferidos do Zod
export type User = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Serviço de usuários
export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(\`/users/\${id}\`);
    return userSchema.parse(response.data);
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const validatedData = createUserSchema.parse(data);
    const response = await api.post<User>('/users', validatedData);
    return userSchema.parse(response.data);
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const validatedData = updateUserSchema.parse(data);
    const response = await api.patch<User>(\`/users/\${id}\`, validatedData);
    return userSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(\`/users/\${id}\`);
  },
};` : `import { api } from './api';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  avatar: z.string().url().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().url().optional(),
});

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(\`/users/\${id}\`);
    return userSchema.parse(response.data);
  },

  create: async (data) => {
    const validatedData = createUserSchema.parse(data);
    const response = await api.post('/users', validatedData);
    return userSchema.parse(response.data);
  },

  update: async (id, data) => {
    const response = await api.patch(\`/users/\${id}\`, data);
    return userSchema.parse(response.data);
  },

  delete: async (id) => {
    await api.delete(\`/users/\${id}\`);
  },
};`) : (ts ? `import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(\`/users/\${id}\`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(\`/users/\${id}\`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(\`/users/\${id}\`);
  },
};` : `import { api } from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(\`/users/\${id}\`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(\`/users/\${id}\`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(\`/users/\${id}\`);
  },
};`);
  
  fs.writeFileSync(path.join(projectPath, 'src', 'services', `userService.${ext}`), userServiceContent);
}

/**
 * Criar exemplos de React Query
 */
function createReactQueryExamples(projectPath, ts, hasZod) {
  const ext = ts ? 'ts' : 'js';
  
  const useUsersContent = ts ? `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService${hasZod ? ', type CreateUserDto, type UpdateUserDto, type User' : ''} } from '@/services/userService';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook para buscar todos os usuários
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar usuário por ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

// Hook para criar usuário
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ${hasZod ? '(data: CreateUserDto)' : '(data: any)'} => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('✅ Usuário criado com sucesso!');
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao criar usuário:', error.message);
    },
  });
}

// Hook para atualizar usuário
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ${hasZod ? 'UpdateUserDto' : 'any'} }) =>
      userService.update(id, data),
    onSuccess: (updatedUser${ts ? ': User' : ''}) => {
      queryClient.setQueryData${ts ? '<User>' : ''}(
        userKeys.detail(updatedUser.id),
        updatedUser
      );
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('✅ Usuário atualizado com sucesso!');
    },
  });
}

// Hook para deletar usuário
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('✅ Usuário deletado com sucesso!');
    },
  });
}` : `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('✅ Usuário criado!');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'hooks', `useUsers.${ext}`), useUsersContent);
}

/**
 * Configurar React Query
 */
function createReactQuerySetup(projectPath, ts) {
  const ext = ts ? 'ts' : 'js';
  
  // Criar queryClient
  const queryClientContent = `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: 0,
    },
  },
});`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'lib', `queryClient.${ext}`), queryClientContent);
}

/**
 * Criar página de exemplo de uso
 */
function createExampleUsagePage(projectPath, ts, hasZustand, hasReactQuery, hasAxios, hasZod) {
  const ext = ts ? 'tsx' : 'jsx';
  
  const imports = [];
  const sections = [];
  
  if (hasZustand) {
    imports.push(`import { useUserStore } from '@/stores/userStore';`);
    imports.push(`import { useTodoStore, useFilteredTodos } from '@/stores/todoStore';`);
    
    sections.push(`      {/* ========== ZUSTAND STORE ========== */}
      <section className="mb-8 p-6 border rounded-lg bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">🏪 Zustand Store</h2>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">Tema: {theme}</p>
            <button 
              onClick={toggleTheme}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Alternar Tema
            </button>
          </div>

          <div>
            <p className="font-medium">Usuário:</p>
            <p>{user ? user.name : 'Não autenticado'}</p>
            <button
              onClick={() => setUser({
                id: '1',
                name: 'Maria Santos',
                email: 'maria@example.com',
              })}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Simular Login
            </button>
          </div>

          <div>
            <p className="font-medium">Filtro: {filter}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setFilter('all')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Todos
              </button>
              <button onClick={() => setFilter('active')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Ativos
              </button>
              <button onClick={() => setFilter('completed')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Completos
              </button>
            </div>
            <button
              onClick={() => addTodo({
                title: 'Nova tarefa',
                description: 'Descrição',
                completed: false,
              })}
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Adicionar Todo
            </button>
            <ul className="mt-2 space-y-1">
              {filteredTodos.slice(0, 5).map((todo) => (
                <li key={todo.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? 'line-through' : ''}>
                    {todo.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>`);
  }
  
  if (hasReactQuery && hasAxios) {
    imports.push(`import { useUsers, useCreateUser } from '@/hooks/useUsers';`);
    
    sections.push(`      {/* ========== REACT QUERY ========== */}
      <section className="mb-8 p-6 border rounded-lg bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">🔄 React Query + Axios${hasZod ? ' + Zod' : ''}</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => createUser.mutate({
              name: 'João Silva',
              email: 'joao@example.com',
              password: '123456',
            })}
            disabled={createUser.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600"
          >
            {createUser.isPending ? 'Criando...' : 'Criar Usuário (Exemplo)'}
          </button>

          {usersLoading && <p>Carregando usuários...</p>}
          {usersError && <p className="text-red-500">Erro: {usersError.message}</p>}
          
          {users && users.length > 0 && (
            <div>
              <p className="font-medium mb-2">Usuários ({users.length}):</p>
              <ul className="space-y-2">
                {users.slice(0, 3).map((user) => (
                  <li key={user.id} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mt-4">
            💡 <strong>Nota:</strong> Configure a URL da API em <code className="bg-gray-100 px-1">.env</code> (VITE_API_URL)
          </p>
        </div>
      </section>`);
  }
  
  const zustandHooks = hasZustand ? `  const { user, theme, setUser, toggleTheme } = useUserStore();
  const { addTodo, toggleTodo, filter, setFilter } = useTodoStore();
  const filteredTodos = useFilteredTodos();` : '';
  
  const reactQueryHooks = hasReactQuery && hasAxios ? `  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const createUser = useCreateUser();` : '';
  
  const exampleContent = `${imports.join('\n')}

/**
 * Página de exemplo mostrando o uso de:
 * ${hasZustand ? '- Zustand Store (gerenciamento de estado)\n * ' : ''}${hasReactQuery ? '- React Query (cache e sincronização de dados)\n * ' : ''}${hasAxios ? '- Axios (requisições HTTP)\n * ' : ''}${hasZod ? '- Zod (validação de dados)' : ''}
 */
export function ExampleUsage() {
${zustandHooks}
${reactQueryHooks}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          📚 Exemplos de Uso
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">🎉 Recursos Implementados:</h2>
          <ul className="list-disc list-inside space-y-1">
            ${hasZustand ? '<li><strong>Zustand:</strong> Store com persistência e DevTools</li>' : ''}
            ${hasReactQuery ? '<li><strong>React Query:</strong> Cache automático e sincronização</li>' : ''}
            ${hasAxios ? '<li><strong>Axios:</strong> Interceptors e tratamento de erros</li>' : ''}
            ${hasZod ? '<li><strong>Zod:</strong> Validação de tipos em runtime</li>' : ''}
          </ul>
        </div>

${sections.join('\n\n')}

        <section className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 shadow">
          <h2 className="text-xl font-semibold mb-2">📖 Arquivos Criados</h2>
          <ul className="text-sm space-y-1 text-gray-700">
            ${hasZustand ? `<li>• <code>src/stores/userStore.${ts ? 'ts' : 'js'}</code> - Store de usuário com persist</li>
            <li>• <code>src/stores/todoStore.${ts ? 'ts' : 'js'}</code> - Store de todos com DevTools</li>` : ''}
            ${hasAxios ? `<li>• <code>src/services/api.${ts ? 'ts' : 'js'}</code> - Configuração do Axios</li>
            <li>• <code>src/services/userService.${ts ? 'ts' : 'js'}</code> - Service de usuários</li>` : ''}
            ${hasReactQuery ? `<li>• <code>src/hooks/useUsers.${ts ? 'ts' : 'js'}</code> - Hooks do React Query</li>
            <li>• <code>src/lib/queryClient.${ts ? 'ts' : 'js'}</code> - Configuração do QueryClient</li>` : ''}
          </ul>
        </section>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync(path.join(projectPath, 'src', 'pages', `ExampleUsage.${ext}`), exampleContent);
}

/**
 * Criar README com documentação dos exemplos
 */
function createExamplesReadme(projectPath, hasZustand, hasReactQuery, hasAxios, hasZod) {
  const readmeContent = `# 📚 Exemplos de Uso

Este projeto foi criado com exemplos práticos de uso dos pacotes selecionados.

## 🎯 Pacotes Incluídos

${hasZustand ? `### Zustand
Gerenciamento de estado leve e simples.

**Arquivos:**
- \`src/stores/userStore.ts\` - Store com persistência no localStorage
- \`src/stores/todoStore.ts\` - Store com DevTools para debugging

**Uso:**
\`\`\`tsx
import { useUserStore } from '@/stores/userStore';

function Component() {
  const { user, setUser, logout } = useUserStore();
  
  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
\`\`\`
` : ''}
${hasAxios ? `### Axios
Cliente HTTP para fazer requisições à API.

**Arquivos:**
- \`src/services/api.ts\` - Configuração base com interceptors
- \`src/services/userService.ts\` - Service de exemplo com CRUD completo

**Características:**
- ✅ Interceptor de autenticação automática
- ✅ Tratamento de erros centralizado  
- ✅ Base URL configurável via .env
${hasZod ? '- ✅ Validação com Zod' : ''}

**Configuração:**
Crie um arquivo \`.env\` na raiz:
\`\`\`
VITE_API_URL=https://sua-api.com
\`\`\`
` : ''}
${hasReactQuery ? `### React Query (TanStack Query)
Gerenciamento de estado do servidor com cache automático.

**Arquivos:**
- \`src/lib/queryClient.ts\` - Configuração do QueryClient
- \`src/hooks/useUsers.ts\` - Hooks customizados com React Query

**Características:**
- ✅ Cache automático de 5 minutos
- ✅ Invalidação inteligente de queries
- ✅ Loading e error states
- ✅ Optimistic updates (em alguns hooks)

**Uso:**
\`\`\`tsx
import { useUsers, useCreateUser } from '@/hooks/useUsers';

function Users() {
  const { data, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={() => createUser.mutate({ 
        name: 'João', 
        email: 'joao@email.com',
        password: '123456'
      })}>
        Criar Usuário
      </button>
    </div>
  );
}
\`\`\`

**Setup no main.tsx:**
\`\`\`tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
\`\`\`
` : ''}
${hasZod ? `### Zod
Validação de schemas e tipos em runtime.

**Uso nos Services:**
\`\`\`tsx
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
});

export type User = z.infer<typeof userSchema>;

// Validação automática
const user = userSchema.parse(response.data);
\`\`\`

**Benefícios:**
- ✅ Validação de tipos em runtime
- ✅ Mensagens de erro customizadas
- ✅ Type-safe com TypeScript
- ✅ Validação de formulários
` : ''}

## 📄 Página de Exemplo

Acesse \`src/pages/ExampleUsage.tsx\` para ver todos os exemplos funcionando.

Para visualizar a página de exemplo:

1. Importe no seu App.tsx:
\`\`\`tsx
import { ExampleUsage } from './pages/ExampleUsage';

function App() {
  return <ExampleUsage />;
}
\`\`\`

2. Ou adicione uma rota (se estiver usando React Router):
\`\`\`tsx
import { ExampleUsage } from './pages/ExampleUsage';

<Route path="/examples" element={<ExampleUsage />} />
\`\`\`

## 🚀 Próximos Passos

1. **Configure a API:** Edite \`.env\` com a URL da sua API
2. **Explore os exemplos:** Abra os arquivos criados e veja a implementação
3. **Customize:** Adapte os exemplos para suas necessidades
4. **Aprenda:** Use como referência para criar seus próprios stores, services e hooks

## 📖 Documentação

${hasZustand ? '- [Zustand](https://github.com/pmndrs/zustand)\n' : ''}${hasReactQuery ? '- [React Query](https://tanstack.com/query/latest)\n' : ''}${hasAxios ? '- [Axios](https://axios-http.com/)\n' : ''}${hasZod ? '- [Zod](https://zod.dev/)\n' : ''}

---

✨ **Criado com mizi-react-component-generator**
`;

  fs.writeFileSync(path.join(projectPath, 'EXAMPLES.md'), readmeContent);
}

/**
 * Inicializar Git
 */
async function initializeGit(projectPath) {
  console.log(chalk.blue('📚'), chalk.bold('Inicializando Git...'));
  
  try {
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
    execSync('git add .', { cwd: projectPath, stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', { cwd: projectPath, stdio: 'inherit' });
    console.log(chalk.green('✅'), chalk.bold('Git inicializado!\n'));
  } catch (error) {
    console.log(chalk.yellow('⚠️'), chalk.bold('Git não foi inicializado\n'));
  }
}

/**
 * Mostrar mensagem de sucesso
 */
function showSuccessMessage(projectName, hasShadcn, additionalPackages) {
  console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('║'), chalk.bold.white(`✅ Projeto ${projectName} criado com sucesso!`).padEnd(58), chalk.green('║'));
  console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝\n'));
  
  console.log(chalk.bold.white('📦 Instalado:'));
  console.log(chalk.gray('   • React + Vite'));
  if (hasShadcn) console.log(chalk.gray('   • shadcn/ui + Tailwind CSS'));
  additionalPackages.forEach(pkg => {
    console.log(chalk.gray(`   • ${pkg}`));
  });
  
  // Verificar se há exemplos criados
  const hasExamples = additionalPackages.some(pkg => 
    ['zustand', '@tanstack/react-query', 'axios', 'zod'].includes(pkg)
  );
  
  if (hasExamples) {
    console.log(chalk.bold.yellow('\n✨ Exemplos criados:'));
    if (additionalPackages.includes('zustand')) {
      console.log(chalk.gray('   • src/stores/ - Stores Zustand com persist e devtools'));
    }
    if (additionalPackages.includes('axios')) {
      console.log(chalk.gray('   • src/services/ - Services com Axios + interceptors'));
    }
    if (additionalPackages.includes('@tanstack/react-query')) {
      console.log(chalk.gray('   • src/hooks/ - Hooks React Query customizados'));
    }
    console.log(chalk.gray('   • src/pages/ExampleUsage - Página com exemplos práticos'));
    console.log(chalk.gray('   • EXAMPLES.md - Documentação completa'));
  }
  
  console.log(chalk.bold.white('\n🚀 Próximos passos:'));
  console.log(chalk.gray(`   cd ${projectName}`));
  console.log(chalk.gray('   npm run dev'));
  
  if (hasExamples) {
    console.log(chalk.bold.white('\n📚 Ver exemplos:'));
    console.log(chalk.gray('   Abra EXAMPLES.md para documentação completa'));
    console.log(chalk.gray('   Importe ExampleUsage em App.tsx para ver funcionando'));
  }
  
  console.log(chalk.bold.white('\n📚 Comandos disponíveis:'));
  console.log(chalk.gray('   npm run dev     - Iniciar servidor de desenvolvimento'));
  console.log(chalk.gray('   npm run build   - Build para produção'));
  console.log(chalk.gray('   npm run preview - Preview da build\n'));
}
