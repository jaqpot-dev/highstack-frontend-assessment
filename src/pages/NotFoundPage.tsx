export function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-zinc-400">This page does not exist.</p>
      <a href="/" className="mt-6 inline-block text-emerald-400 underline">
        Back to the lobby
      </a>
    </section>
  );
}
