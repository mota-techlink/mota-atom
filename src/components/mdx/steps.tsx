// src/components/mdx/steps.tsx
export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-4 mb-12 border-l pl-8 [counter-reset:step] space-y-8">
      {children}
    </div>
  );
}

export function Step({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -left-[41px] top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-semibold tabular-nums shadow-sm [counter-increment:step] content-[counter(step)]">
        {/* CSS counter 会自动填充数字 */}
      </div>
      <h3 className="mb-2 text-base font-semibold tracking-tight">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}