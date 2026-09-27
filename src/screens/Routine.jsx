import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, Plus, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import TaskSheet from '../components/TaskSheet';
import { CategoryIcon } from '../components/CategoryChip';
import { itemVariants, listVariants } from '../components/TaskItem';
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
        subtitle="Shape the day you want to live. Tap a task to edit it."
        action={
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSheet({ open: true, task: null })}
            className="mb-1 grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-hero"
            aria-label="Add task"
          >
            <Plus className="h-5 w-5" strokeWidth={2.6} />
          </motion.button>
        }
      />

      <div className="px-5">
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="overflow-hidden rounded-[24px] bg-white shadow-card"
        >
          {sortedTasks.map((t, i) => (
            <motion.li key={t.id} variants={itemVariants}>
              <button
                type="button"
                onClick={() => setSheet({ open: true, task: t })}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-brand-light text-brand-dark">
                  <CategoryIcon category={t.category} className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15.5px] font-semibold text-ink">{t.name}</span>
                  <span className="block text-[13px] text-muted">
                    {taskTime(t)}, {t.category}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
              </button>
              {i < sortedTasks.length - 1 && <div className="ml-[68px] h-px bg-gray-100" />}
            </motion.li>
          ))}
          {sortedTasks.length === 0 && (
            <li className="px-4 py-6 text-center text-[15px] text-muted">
              Your routine is empty. Tap + to add your first task.
            </li>
          )}
        </motion.ul>

        <p className="mt-3 px-1 text-[13px] text-muted">
          {sortedTasks.length} tasks. Changes apply to today and every day after; past days keep their history.
        </p>

        <button
          type="button"
          onClick={() => {
            if (confirmReset) {
              restoreDefaultRoutine();
              setConfirmReset(false);
            } else setConfirmReset(true);
          }}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold transition-colors ${
            confirmReset ? 'bg-amber-500 text-white' : 'bg-white text-muted shadow-card'
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          {confirmReset ? 'Tap again to restore default routine' : 'Restore default routine'}
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
