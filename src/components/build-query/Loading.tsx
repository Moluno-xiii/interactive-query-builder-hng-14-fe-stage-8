const Loading = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div className="flex h-full flex-col items-center justify-center gap-4 font-jetbrains-mono text-[13px] text-faint">
        <div className="size-7.5 animate-spin rounded-full border-2 border-border border-t-accent" />
        <div>initializing queryforge…</div>
      </div>
    </div>
  );
};

export default Loading;
