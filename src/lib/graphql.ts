import { GRAPHQL_URL } from './config';

export interface GraphQLError {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<TData> {
  data?: TData | null;
  errors?: GraphQLError[];
}

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Sends a GraphQL request with plain fetch.
 * Throws on network or HTTP errors. Returns the GraphQL body as-is.
 */
export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, never>>(
  query: string,
  variables?: TVariables,
  init?: { signal?: AbortSignal },
): Promise<GraphQLResponse<TData>> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: init?.signal,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `GraphQL request failed with status ${response.status}`);
  }

  return (await response.json()) as GraphQLResponse<TData>;
}
