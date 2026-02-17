import React, { useState, useCallback } from 'react';
import { useDnsStore } from '../../store';

interface QueryOptionsDropdownProps {}

export const QueryOptionsDropdown: React.FC<QueryOptionsDropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { options, updateOption } = useDnsStore();

  const toggleOption = useCallback(
    (key: keyof typeof options) => {
      updateOption(key, !options[key]);
    },
    [options, updateOption]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-slate-700">Опции запроса</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Опции запроса</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {/* Показать команду */}
            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.showCommand}
                onChange={() => toggleOption('showCommand')}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">Показать команду</div>
                <div className="text-xs text-slate-500">Отобразить выполняемую dig команду</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.trace}
                onChange={() => toggleOption('trace')}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">Трассировка</div>
                <div className="text-xs text-slate-500">Трассировка пути запроса (+trace)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.whois}
                onChange={() => toggleOption('whois')}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">Whois</div>
                <div className="text-xs text-slate-500">Whois-запрос информации о домене</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.noRecursive}
                onChange={() => toggleOption('noRecursive')}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">Без рекурсии</div>
                <div className="text-xs text-slate-500">Нерекурсивный запрос от корневых серверов</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Клик вне dropdown закрывает его */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
