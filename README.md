# ML Visualizer

This is a [Next.js](https://nextjs.org) App Router project for building a course-shaped machine learning visualization toolbox.

## Next.js 16 App Router Rules

These project rules are grounded in the local Next.js 16.2.4 docs under `node_modules/next/dist/docs/`, especially:

- `01-app/01-getting-started/03-layouts-and-pages.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/11-css.md`

Follow these constraints before adding app code:

- Use `app/` pages and layouts for routing. Avoid Pages Router APIs and conventions.
- Treat pages and layouts as Server Components by default.
- Put interactivity behind focused `"use client"` boundaries, including hooks, event handlers, browser APIs, D3 gestures, and visualizer state.
- Keep pure algorithm logic and course metadata in plain TypeScript modules outside React UI.
- Keep Tailwind and truly global CSS rooted through `app/globals.css`, imported by `app/layout.tsx`.
- Pass only serializable data from Server Components into Client Components.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
