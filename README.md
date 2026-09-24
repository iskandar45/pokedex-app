<div align="center">

<img src="public/icon.jpg" alt="PokéDex App" width="128" />

# PokéDex App

[![CI](https://github.com/iskandar45/pokedex-app/actions/workflows/ci.yml/badge.svg)](https://github.com/iskandar45/pokedex-app/actions/workflows/ci.yml)

Telusuri dan cari Pokémon dari [PokéAPI](https://pokeapi.co/) — daftar berhalaman, pencarian cepat, dan halaman detail lengkap dengan tipe, ability, dan statistik.

</div>

## Tech Stack

| Layer | Teknologi |
|---|---|
| Bundler & dev server | [Vite 8](https://vite.dev/) |
| UI | [React 19](https://react.dev/) |
| Routing | [React Router 7](https://reactrouter.com/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (plugin Vite, config CSS-first) |
| HTTP | [Axios](https://axios-http.com/) |
| Testing | [Vitest 5](https://vitest.dev/) + [Testing Library](https://testing-library.com/) (jsdom) |
| Lint | [ESLint 10](https://eslint.org/) (flat config) |
| Font | [Montserrat](https://fontsource.org/fonts/montserrat) via `@fontsource` |

## Persyaratan

- Node.js **24 LTS** direkomendasikan (lihat `.nvmrc`); minimum `>= 22.12.0`

```bash
nvm use
```

## Mulai Cepat

```bash
npm install     # pasang dependensi
npm run dev     # mode pengembangan (HMR) -> http://localhost:5173
```

## Skrip

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan dengan HMR |
| `npm test` | Jalankan seluruh suite Vitest sekali |
| `npm run test:watch` | Mode watch untuk pengembangan |
| `npm run test:coverage` | Laporan coverage (`coverage/`) |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Serve hasil build untuk dicek lokal |
| `npm run lint` | ESLint atas seluruh proyek |

## Pengujian

Suite terdiri dari **35 unit test** dengan **cakupan 100%** (statements, branches, functions, lines) atas kode `src/`, mencakup:

- Alur pencarian (Enter menavigasi dengan trim + lowercase; query kosong diabaikan)
- Paginasi (halaman berikut/sebelumnya, tombol disabled di kedua ujung, grid tetap terlihat saat refetch)
- Halaman detail (render data, pesan 404 vs gagal koneksi, reset state saat parameter berubah, perlindungan race condition respons basi)
- Utilitas format ID sprite dan penyusunan rute aplikasi

```bash
npm run test:coverage
```

## Struktur Proyek

```
index.html              Entry document Vite
vite.config.js          Konfigurasi Vite + Vitest
eslint.config.js        Flat config ESLint
.github/workflows/      CI (lint + test + build, matrix Node 22 & 24)
src/main.jsx            Entrypoint aplikasi
src/App.jsx             Router dan layout
src/Home.jsx            Daftar Pokémon berhalaman + pencarian nama
src/Detail.jsx          Tampilan detail satu Pokémon
src/Navbar.jsx          Navigasi atas
src/Footer.jsx          Footer
src/utils/              Helper (format ID sprite PokéAPI)
src/*.test.jsx          Unit test (Vitest + Testing Library)
```

## Deploy

`npm run build` menghasilkan situs statis di `dist/` yang bisa di-deploy ke hosting apa pun
(Vercel, Netlify, Cloudflare Pages, dsb). Karena memakai client-side routing, arahkan semua
path fallback ke `index.html` (di Vercel cukup tambahkan rewrite:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

).

## Sumber Data

Seluruh data berasal dari PokéAPI publik (`https://pokeapi.co/api/v2`) dan artwork Pokémon
dari `https://assets.pokemon.com`. Tidak perlu API key maupun backend.
