import {
  BedDouble,
  BookOpen,
  Briefcase,
  Clapperboard,
  HeartPulse,
  ListChecks,
  MessageCircle,
  Moon,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

export const CATEGORY_ICONS = {
  Faith: Moon,
  Communication: MessageCircle,
  Health: HeartPulse,
  Planning: ListChecks,
  Work: Briefcase,
  Break: UtensilsCrossed,
  Relaxation: Clapperboard,
  Learning: BookOpen,
  Life: BedDouble,
};

export function CategoryIcon({ category, className = 'h-3.5 w-3.5' }) {
  const Icon = CATEGORY_ICONS[category] || Sparkles;
  return <Icon className={className} strokeWidth={2.2} aria-hidden />;
}

export default function CategoryChip({ category, muted = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[12px] font-semibold ${
        muted ? 'bg-gray-100 text-muted' : 'bg-brand-light text-brand-dark'
      }`}
    >
      <CategoryIcon category={category} />
      {category}
    </span>
  );
}
