import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import TaskSheet from '../components/TaskSheet';
import CategoryIcon from '../components/CategoryIcon';
import { useStore } from '../lib/store';
import { taskTime } from '../lib/date';

export default function Routine() {
  const { sortedTasks, addTask, updateTask, deleteTask, restoreDefaultRoutine } = useStore();
  const [sheet, setSheet] = useState({ open: false, task: null });
  const [confirmReset, setConfirmReset] = useState(false);
  const close = () => setSheet((s) => ({ ...s, open: false }));

  return (
    <>
      <Header
        title="Routine"
        action={
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSheet({ open: true, task: null })}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-black"
            aria-label="Add task"
          >
            <Plus className="h-5 w-5" strokeWidth={2.8} />
          </motion.button>
        }
      />

      <div className="px-5">
        <ul className="divide-y divide-line rounded-[24px] bg-surface px-4">
          {sortedTasks.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setSheet({ open: true, task: t })}
                className="flex w-full items-center gap-3 py-3.5 text-left"
              >
                <CategoryIcon category={t.category} className="h-[18px] w-[18px] shrink-0 text-brand" />
                <span className="w-[84px] shrink-0 truncate whitespace-nowrap text-[13px] tabular-nums text-muted">{taskTime(t)}</span>
                <span className="min-w-0 flex-1 truncate text-[15px]">{t.name}</span>
              </button>
            </li>
          ))}
          {sortedTasks.length === 0 && <li className="py-6 text-center text-[15px] text-muted">Tap + to add a task.</li>}
        </ul>

        <button
          type="button"
          onClick={() => {
            if (confirmReset) {
              restoreDefaultRoutine();
              setConfirmReset(false);
            } else setConfirmReset(true);
          }}
          className={`mt-6 w-full py-3 text-[14px] ${confirmReset ? 'font-semibold text-gold' : 'text-faint'}`}
        >
          {confirmReset ? 'Tap again to restore' : 'Restore default routine'}
        </button>
      </div>

      <TaskSheet
        open={sheet.open}
        task={sheet.task}
        onClose={close}
        onSave={(data) => {
          if (sheet.task) updateTask(sheet.task.id, data);
          else addTask(data);
          close();
        }}
        onDelete={(id) => {
          deleteTask(id);
          close();
        }}
      />
    </>
  );
}
