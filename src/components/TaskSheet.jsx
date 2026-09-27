import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Sheet from './Sheet';
import { CategoryIcon } from './CategoryChip';
import { CATEGORIES } from '../lib/constants';
import { inputToMinutes, minutesToInput } from '../lib/date';

const blank = { name: '', category: 'Work', time: '09:00', label: '', description: '', rule: '' };

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12.5px] text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  'min-h-[50px] w-full appearance-none rounded-2xl border border-gray-200 bg-canvas/60 px-4 py-3 text-[16px] text-ink placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none';

export default function TaskSheet({ open, task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setConfirmDelete(false);
    setForm(
      task
        ? {
            name: task.name,
            category: task.category,
            time: minutesToInput(task.minutes),
            label: task.label || '',
            description: task.description || '',
            rule: task.rule || '',
          }
        : blank
    );
  }, [open, task]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      name: form.name.trim(),
      category: form.category,
      minutes: inputToMinutes(form.time),
      label: form.label.trim(),
      description: form.description.trim(),
      rule: form.rule.trim(),
    });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={task ? 'Edit task' : 'New task'}
      footer={
        <div className="flex gap-3">
          {task && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => (confirmDelete ? onDelete(task.id) : setConfirmDelete(true))}
              className={`flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-[16px] font-semibold transition-colors ${
                confirmDelete ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              {confirmDelete ? 'Confirm' : 'Delete'}
            </motion.button>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={!valid}
            onClick={submit}
            className="flex-1 rounded-2xl bg-brand py-3.5 text-[16px] font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {task ? 'Save changes' : 'Add task'}
          </motion.button>
        </div>
      }
    >
      <div className="space-y-5 pt-2">
        <Field label="Task name">
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Evening walk" />
        </Field>

        <div>
          <span className="mb-2 block text-[13.5px] font-semibold text-ink">Category</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = form.category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: c }))}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[14px] font-semibold transition-colors ${
                    active ? 'border-brand bg-brand text-white' : 'border-gray-200 bg-white text-ink'
                  }`}
                >
                  <CategoryIcon category={c} className="h-4 w-4" />
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time" hint="Sets the order">
            <input type="time" className={inputCls} value={form.time} onChange={set('time')} />
          </Field>
          <Field label="Display as" hint="Optional, e.g. After Lunch">
            <input className={inputCls} value={form.label} onChange={set('label')} placeholder="Clock time" />
          </Field>
        </div>

        <Field label="Description">
          <input
            className={inputCls}
            value={form.description}
            onChange={set('description')}
            placeholder="What this time is for"
          />
        </Field>

        <Field label="Rule" hint="A boundary that protects this habit">
          <input className={inputCls} value={form.rule} onChange={set('rule')} placeholder="e.g. No phone" />
        </Field>
      </div>
    </Sheet>
  );
}
