export default function Header({ title, action }) {
  return (
    <header className="pt-safe flex items-center justify-between px-5 pb-5">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">{title}</h1>
      {action}
    </header>
  );
}
