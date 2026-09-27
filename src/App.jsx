import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart3, ListTodo, NotebookPen, Sun, UserRound } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Today from './screens/Today';
import Progress from './screens/Progress';
import Routine from './screens/Routine';
import Journal from './screens/Journal';
import Profile from './screens/Profile';

const TABS = [
  { id: 'today', label: 'Today', icon: Sun, Screen: Today },
  { id: 'progress', label: 'Progress', icon: BarChart3, Screen: Progress },
  { id: 'routine', label: 'Routine', icon: ListTodo, Screen: Routine },
  { id: 'journal', label: 'Journal', icon: NotebookPen, Screen: Journal },
  { id: 'profile', label: 'Profile', icon: UserRound, Screen: Profile },
];

export default function App() {
  const [tab, setTab] = useState('today');
  const { Screen } = TABS.find((t) => t.id === tab);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md">
      {/* Keyed remount gives each tab a calm fade-and-rise entrance. */}
      <motion.main
        key={tab}
        className="pb-nav"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Screen onNavigate={setTab} />
      </motion.main>
      <BottomNav tabs={TABS} active={tab} onChange={setTab} />
    </div>
  );
}
