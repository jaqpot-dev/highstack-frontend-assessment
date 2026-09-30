# HighStack — Frontend Take-Home

Thank you for your time. This task is close to the work we do every day.

## Setup

You need **Node.js 22 or newer** and **pnpm** (`corepack enable` gives you the right version).

```bash
pnpm install
cp .env.example .env    # optional, the defaults work
```

Run the mock API and the app in two terminals:

```bash
pnpm mock-api   # mock API on http://localhost:4000
pnpm dev        # app with SSR on http://localhost:5173
```

Other commands:

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm build`     | Builds the client and the server bundles. |
| `pnpm start`     | Runs the production build (SSR).          |
| `pnpm test`      | Runs the tests (Vitest).                  |
| `pnpm typecheck` | Runs the TypeScript compiler.             |

### What is in the starter

- `server.ts` — a small Node server. It uses Vite middleware in dev and the built files in production.
- `src/entry-server.tsx` and `src/entry-client.tsx` — server render and client hydration.
- `src/routes.ts` — a very small route match and a data loader. Loader data goes to the client in `window.__DATA__`.
- `src/lib/graphql.ts` — a typed GraphQL helper that uses plain `fetch`.
- `src/components/Layout.tsx` — the page shell.
- `mock-api/` — the mock GraphQL API and the mock CMS.

You can change anything. You can add libraries. Tell us why in your README.

## The task

Build the category page: **`/games/:category`** (for example `/games/slots`).

1. The first page of games is in the SSR HTML. We check with "view source".
2. The user can filter by provider. The filter state lives in the URL. A shared link opens the same view, and the back button works.
3. A "Load more" button loads the next page.
4. The top of the page comes from the CMS endpoint. Render the blocks (`hero`, `banner`, `text`) from a component map.
5. Show loading, empty and error states. A failed API call must not break the whole page.
6. Images must not cause layout shift.
7. Write tests for the parts that you think are risky.

We care more about good decisions than about many features.

## API reference

The mock API runs on `http://localhost:4000`. Responses are not instant, like on a real network.

### GraphQL — `POST /graphql`

Send `{ "query": "...", "variables": { ... } }` as JSON. The response has the standard GraphQL shape: `{ "data": ..., "errors": [...] }`.

```graphql
type Game {
  id: ID!
  name: String!
  slug: String!
  provider: Provider
  thumbnail: String
  width: Int!
  height: Int!
  rtp: Float
  volatility: String!
}

type Provider {
  id: ID!
  name: String!
}

type GamePage {
  items: [Game!]!
  total: Int!
  nextOffset: Int
}

type Query {
  games(category: String!, provider: ID, offset: Int = 0, limit: Int = 12): GamePage!
  providers(category: String!): [Provider!]!
}
```

Notes:

- `category` is one of `slots`, `live`, `crash`.
- `provider` is a provider `id` from the `providers` query.
- `offset` and `limit` are for pagination. `nextOffset` is the `offset` for the next page, or `null` if there are no more games. `limit` is between 1 and 50.
- `provider`, `thumbnail` and `rtp` can be `null`.
- `width` and `height` are the size of the thumbnail image in pixels.
- `thumbnail` is an absolute URL to an image.

Example:

```bash
curl -s http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ games(category: \"slots\") { total nextOffset items { id name thumbnail width height provider { name } } } }"}'
```

### CMS — `GET /cms/pages/:slug`

The slug is the category (`slots`, `live`, `crash`). An unknown slug returns `404`.

```ts
interface CmsPage {
  slug: string;
  blocks: CmsBlock[];
}

// Every block has a unique `_uid` and a `component` name.
interface BaseBlock {
  _uid: string;
  component: string;
}

interface HeroBlock extends BaseBlock {
  component: 'hero';
  title: string;
  subtitle: string;
  image: { url: string; alt: string; width: number; height: number };
  ctaLabel: string;
  ctaHref: string;
}

interface BannerBlock extends BaseBlock {
  component: 'banner';
  message: string;
  tone: 'info' | 'warning' | 'success';
}

interface TextBlock extends BaseBlock {
  component: 'text';
  body: string; // plain text with simple markdown: paragraphs split by a blank line, **bold**
}
```

Example:

```bash
curl -s http://localhost:4000/cms/pages/slots
```

## What to send back

1. A link to your repository, with your commit history.
2. A README (or a section in this one) that tells us:
   - Your main decisions and why you made them.
   - What you did not do, and what you would do next.
   - How you used AI: which tools, where they helped, and where they were wrong. This does not change your score. We want to know how you work.

## Time

You have **3 days** from the day you get this brief. Unfinished work is fine. Tell us what is missing and how you would do it.

## AI tools

AI tools are allowed.

---

Created for HighStack hiring. Please submit in a private repo and invite the reviewers we give you.
