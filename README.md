# PokéDex App

A small React Pokédex that browses and searches Pokémon from [PokéAPI](https://pokeapi.co/).

Built with **Vite**, **React 19**, **React Router 7** and **Tailwind CSS 4**.

## Requirements

- Node.js **24 LTS** or newer (see `.nvmrc`)

```bash
nvm use
```

## Available Scripts

### `npm run dev`

Runs the app in development mode with Vite's HMR.
Open the printed URL (default [http://localhost:5173](http://localhost:5173)).

### `npm test`

Runs the Vitest suite once. Use `npm run test:watch` for watch mode and
`npm run test:coverage` for a coverage report (`coverage/`).

### `npm run build`

Builds the production bundle into `dist/`.

### `npm run preview`

Serves the built `dist/` folder locally so you can sanity-check the production bundle.

### `npm run lint`

Runs ESLint over the project (flat config in `eslint.config.js`).

## Project structure

```
index.html            Vite entry document
vite.config.js        Vite + Vitest configuration
src/main.jsx          Application entrypoint
src/App.jsx           Router and layout
src/Home.jsx          Paginated Pokémon list + name search
src/Detail.jsx        Single Pokémon detail view
src/Navbar.jsx        Top navigation
src/Footer.jsx        Footer
src/utils/            Helpers (PokéAPI sprite id formatting)
src/*.test.jsx        Unit tests (Vitest + Testing Library)
```

## Data source

All data comes from the public PokéAPI (`https://pokeapi.co/api/v2`). Pokémon artwork is loaded
from `https://assets.pokemon.com`. No API key or backend is required.
