import type { Category } from '../lib/categories';

export function HomePage({ categories }: { categories: Category[] }) {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Game lobby</h1>
      <ul className="grid gap-4 sm:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <a
              href={`/games/${category.slug}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
            >
              <span className="block text-xl font-semibold">{category.label}</span>
              <span className="mt-2 block text-sm text-zinc-400">{category.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
