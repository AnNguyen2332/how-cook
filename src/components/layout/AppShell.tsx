import type { ReactNode } from "react";

type AppShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function AppShell({ header, sidebar, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 sm:px-5 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {header}
        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-5">{sidebar}</aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
