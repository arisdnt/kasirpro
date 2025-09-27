# KasirPro - Point of Sale Desktop App

This is a Point of Sale (POS) desktop application built with React + TypeScript + Vite and packaged with Electron.

## 🚀 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Running the Application in Development Mode

To run the application in development mode with Electron:

```bash
npm run dev
```

This command will:
1. Start the Vite dev server on http://localhost:5173
2. Wait for the server to be ready
3. Automatically launch the Electron desktop application

### Alternative Development Methods

**Option 1: Using the batch file (Windows only)**
```bash
start-dev.bat
```

**Option 2: Running components separately**
```bash
# Terminal 1 - Start Vite dev server
npm run vite:dev

# Terminal 2 - Start Electron (wait for Vite to be ready first)
npm run electron:dev
```

## 📦 Building for Production

### Build for Distribution
```bash
npm run electron:build
```

This will create distributable packages in the `dist-electron` folder.

### Build without Publishing
```bash
npm run electron:dist
```

## 🛠 Available Scripts

- `npm run dev` - Start development with Electron
- `npm run vite:dev` - Start only Vite dev server
- `npm run electron:dev` - Start only Electron (requires Vite server to be running)
- `npm run build` - Build the React app for production
- `npm run electron:build` - Build and package the Electron app for distribution
- `npm run electron:dist` - Build Electron app without publishing
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## 🧰 Git helper

This repo includes a helper to quickly add, commit (with a timestamp by default), and push to `origin main`.

- Windows PowerShell:

```powershell
./git-push.ps1 "your commit message"
```

- Windows Command Prompt:

```bat
git-push.cmd "your commit message"
```

- macOS/Linux (Bash):

```bash
./git-push "your commit message"
```

## 🏗 Project Structure

```
├── electron/
│   ├── main.js          # Main Electron process
│   └── preload.js       # Preload script for security
├── src/                 # React application source
├── public/              # Static assets
├── dist/                # Built React app
└── dist-electron/       # Electron distribution files
```

## 🔧 Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Desktop Framework**: Electron
- **UI Components**: HeroUI, Radix UI
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: Supabase
- **Router**: React Router DOM

## 🔒 Security Features

The Electron app is configured with security best practices:
- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Secure preload script

---

# Original Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
