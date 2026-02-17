import React from 'react';
import { useDnsStore } from '../../store';

export const QueryOptionsBar: React.FC = () => {
  const { options, updateOption } = useDnsStore();

  const toggleOption = (key: keyof typeof options) => {
    updateOption(key, !options[key]);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Опция: Показать команду */}
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={options.showCommand}
          onChange={() => toggleOption('showCommand')}
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900">
          Команда
        </span>
      </label>

      {/* Опция: Трассировка */}
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={options.trace}
          onChange={() => toggleOption('trace')}
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900">
          Трассировка
        </span>
      </label>

      {/* Опция: Whois */}
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={options.whois}
          onChange={() => toggleOption('whois')}
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900">
          Whois
        </span>
      </label>

      {/* Опция: Без рекурсии */}
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={options.noRecursive}
          onChange={() => toggleOption('noRecursive')}
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900">
          Без рекурсии
        </span>
      </label>
    </div>
  );
};
