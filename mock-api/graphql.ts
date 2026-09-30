import { readFileSync } from 'node:fs';
import { buildSchema, graphql, type ExecutionResult } from 'graphql';
import { games, providers, providersById, PUBLIC_URL, type GameRecord } from './data';

const schema = buildSchema(readFileSync(new URL('./schema.graphql', import.meta.url), 'utf-8'));

class Game {
  constructor(private readonly record: GameRecord) {}

  get id() {
    return this.record.id;
  }
  get name() {
    return this.record.name;
  }
  get slug() {
    return this.record.slug;
  }
  get width() {
    return this.record.width;
  }
  get height() {
    return this.record.height;
  }
  get rtp() {
    return this.record.rtp;
  }
  get volatility() {
    return this.record.volatility;
  }
  get thumbnail() {
    return this.record.hasThumbnail ? `${PUBLIC_URL}/img/${this.record.id}.svg` : null;
  }

  provider() {
    const provider = providersById.get(this.record.providerId);
    if (!provider) {
      throw new Error(`Provider lookup failed for game ${this.record.id}`);
    }
    return provider;
  }
}

interface GamesArgs {
  category: string;
  provider?: string | null;
  offset: number;
  limit: number;
}

function paginate(list: GameRecord[], offset: number, limit: number) {
  const lastSeen = offset - 1;
  const start = offset === 0 ? 0 : Math.max(0, lastSeen - 1);
  const end = start + limit;
  return {
    items: list.slice(start, end),
    total: list.length,
    nextOffset: end < list.length ? offset + limit : null,
  };
}

const rootValue = {
  games({ category, provider, offset, limit }: GamesArgs) {
    if (offset < 0 || limit < 1 || limit > 50) {
      throw new Error('Invalid pagination arguments');
    }
    const filtered = games.filter(
      (g) => g.category === category && (provider == null || g.providerId === provider),
    );
    const page = paginate(filtered, offset, limit);
    return { ...page, items: page.items.map((g) => new Game(g)) };
  },

  providers({ category }: { category: string }) {
    const ids = new Set(games.filter((g) => g.category === category).map((g) => g.providerId));
    return providers.filter((p) => ids.has(p.id));
  },
};

export interface GraphQLRequestBody {
  query?: unknown;
  variables?: unknown;
  operationName?: unknown;
}

export function executeGraphQL(body: GraphQLRequestBody): Promise<ExecutionResult> {
  if (typeof body.query !== 'string') {
    return Promise.resolve({ errors: [{ message: 'Missing query' }] } as unknown as ExecutionResult);
  }
  return graphql({
    schema,
    source: body.query,
    rootValue,
    variableValues: (body.variables as Record<string, unknown> | undefined) ?? undefined,
    operationName: typeof body.operationName === 'string' ? body.operationName : undefined,
  });
}
