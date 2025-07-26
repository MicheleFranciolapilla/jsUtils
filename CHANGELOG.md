# Changelog

All notable changes to this project will be documented in this file.

🔗 [Project Overview](https://github.com/MicheleFranciolapilla/jsUtils/blob/dev/README.md)

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2025-07-25

### 🚀 Initial Production-Ready Release

This is the first stable release of `@mf-coolcode/jsutils`, providing a solid foundation with full TypeScript support and dual module compatibility.

### 🔧 Technical Highlights

- Dual module support: ES Modules (ESM) and CommonJS (CJS) for Node.js and browser environments.
- TypeScript: Auto-generated `.d.ts` type declarations included.
- Optimized ESM bundle for tree shaking and efficient builds.
- Complete build output with `dist/index.cjs`, `dist/index.mjs`, and `dist/index.d.ts`.
- Includes utility functions for robust and precise JavaScript validations and operations.

### 📦 Installation  

- For end-users (production), install from the `release` branch via:

  - ##### With npm:
    ```bash
    npm install git+https://github.com/MicheleFranciolapilla/jsUtils.git#v1.0.0
    ```

  - ##### With yarn:
    ```bash
    yarn add https://github.com/MicheleFranciolapilla/jsUtils.git#v1.0.0
    ```

  - ##### With pnpm:
    ```bash
    pnpm add git+https://github.com/MicheleFranciolapilla/jsUtils.git#v1.0.0
    ```

- For developers interested in source code and tests:
    ```bash
    git clone -b v1.0.0-src https://github.com/MicheleFranciolapilla/jsUtils.git
    cd jsUtils && npm install
    ```