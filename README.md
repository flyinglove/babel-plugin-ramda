# babel-plugin-ramda Monorepo

This repository is now organised as a pnpm workspace so that shared tooling and dependencies can be managed in one place. The existing Babel plugin continues to live under [`packages/babel-plugin-ramda`](packages/babel-plugin-ramda).

## Getting started

```sh
corepack enable
pnpm install
```

Useful scripts:

- `pnpm lint` – run ESLint across the workspace.
- `pnpm format` – verify Prettier formatting.
- `pnpm format:write` – apply Prettier formatting.
- `pnpm test` – execute package level unit tests.
- `pnpm build` – run package build steps.

## Tooling

- **ESLint + Prettier** keep JavaScript formatting and lint rules consistent. ESLint integrates `eslint-plugin-import` and `eslint-config-prettier` to avoid stylistic conflicts.
- **Husky + lint-staged** run ESLint/Prettier on staged files before every commit to maintain quality without slowing down day-to-day development.

## Continuous Integration

GitHub Actions (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)) installs dependencies via pnpm, runs linting, unit tests, and performs package builds on every push and pull request. Workflow caching keeps installs fast while ensuring the monorepo stays healthy.

## Deployment planning

The plugin itself is published as a package, but this repository also documents an opinionated deployment strategy should the monorepo evolve into an application stack:

- **Builder (static or SSR)** – produce static assets or server bundles using modern tooling (e.g. Vite/Next). Static builds can be deployed directly to object storage/CDN, while SSR bundles can be shipped to container registries.
- **Renderer (Nuxt SSR or static hosting + serverless API)** – host a Nuxt (or equivalent) renderer behind a managed platform. Pair it with serverless APIs for dynamic capabilities to keep the footprint small and scalable.

These guidelines allow the repository to scale beyond the current plugin with consistent automation and deployment primitives.
