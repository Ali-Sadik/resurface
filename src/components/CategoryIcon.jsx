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

export default function CategoryIcon({ category, className = 'h-4 w-4' }) {
  const Icon = CATEGORY_ICONS[category] || Sparkles;
  return <Icon className={className} strokeWidth={2.2} aria-hidden />;
}
