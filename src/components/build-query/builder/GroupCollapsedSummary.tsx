interface GroupCollapsedSummaryProps {
  count: number;
  onExpand: () => void;
}

const GroupCollapsedSummary = ({
  count,
  onExpand,
}: GroupCollapsedSummaryProps) => {
  return (
    <div
      className="cursor-pointer pb-3 pl-11 pr-4 pt-1 font-jetbrains-mono text-[11.5px] text-faint hover:text-muted-foreground"
      onClick={onExpand}
    >
      {count} hidden condition{count !== 1 ? "s" : ""} — click to expand
    </div>
  );
};

export default GroupCollapsedSummary;
