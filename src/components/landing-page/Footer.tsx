import AppIcon from "@/components/ui/AppIcon";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-[12.5px] text-faint sm:flex-row">
        <AppIcon />
        <span>&copy; MOLUNO</span>
      </div>
    </footer>
  );
};

export default Footer;
