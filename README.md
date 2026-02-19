# Ivy Wang — Portfolio

Personal portfolio site built with **Vite + TypeScript**, deployed to GitHub Pages.

## Project Structure

```
portfolio/
├── index.html              # HTML entry point
├── src/
│   ├── main.ts             # Entry: wires everything together
│   ├── styles.css          # All styles
│   ├── tree.ts             # Animated canvas tree (hero background)
│   ├── nav.ts              # Navigation scroll & active state
│   └── reveal.ts           # Scroll-triggered reveal animations
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions auto-deploy
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Local Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### 1. Set the base URL
In `vite.config.ts`, change `base` to match your repo name:
```ts
base: '/YOUR-REPO-NAME/',
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages
Go to **Settings → Pages → Source** and select **GitHub Actions**.

The site will auto-deploy on every push to `main`.
