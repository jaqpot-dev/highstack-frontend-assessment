import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="text-lg font-bold tracking-tight">
            High<span className="text-emerald-400">Stack</span>
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        Play responsibly. 18+
      </footer>
    </div>
  );
}
