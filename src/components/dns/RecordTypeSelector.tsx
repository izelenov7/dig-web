import React, { useState, useMemo, useCallback } from 'react';
import { DNS_RECORD_TYPES, DNS_RECORD_CATEGORIES, type DnsRecordCategory } from '../../types';
import { useDnsStore } from '../../store';

type CategoryKey = keyof typeof DNS_RECORD_CATEGORIES;

interface RecordTypeSelectorProps {
  compact?: boolean;
}

export const RecordTypeSelector: React.FC<RecordTypeSelectorProps> = ({
  compact = false,
}) => {
  const { recordType, setRecordType } = useDnsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DnsRecordCategory | 'all'>('all');

  // Группировка записей по категориям
  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof DNS_RECORD_TYPES> = {};
    
    DNS_RECORD_TYPES.forEach((record) => {
      if (!groups[record.category]) {
        groups[record.category] = [];
      }
      groups[record.category].push(record);
    });
    
    return groups;
  }, []);

  // Фильтрация по активной категории
  const filteredRecords = useMemo(() => {
    if (activeCategory === 'all') {
      return groupedRecords;
    }
    return {
      [activeCategory]: groupedRecords[activeCategory] || [],
    };
  }, [groupedRecords, activeCategory]);

  // Текущий выбранный тип
  const selectedRecord = useMemo(
    () => DNS_RECORD_TYPES.find((r) => r.type === recordType),
    [recordType]
  );

  const handleSelect = useCallback(
    (type: string) => {
      setRecordType(type as typeof recordType);
      setIsOpen(false);
    },
    [setRecordType, recordType]
  );

  const categories = useMemo(
    () => Object.keys(groupedRecords) as CategoryKey[],
    [groupedRecords]
  );

  if (compact) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Тип записи
        </label>
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value as typeof recordType)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer font-mono text-sm"
        >
          {DNS_RECORD_TYPES.map((record) => (
            <option key={record.type} value={record.type}>
              {record.name} — {record.description}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Тип DNS-записи
      </label>
      
      {/* Кнопка выбора */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-primary-600">
            {selectedRecord?.name}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-sm text-slate-600">
            {selectedRecord?.description}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Табы категорий */}
          <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {DNS_RECORD_CATEGORIES[category as CategoryKey]}
              </button>
            ))}
          </div>

          {/* Список записей */}
          <div className="max-h-80 overflow-y-auto p-3">
            {Object.entries(filteredRecords).map(([category, records]) => (
              <div key={category} className="mb-4 last:mb-0">
                {Object.keys(filteredRecords).length > 1 && (
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {DNS_RECORD_CATEGORIES[category as CategoryKey]}
                  </h4>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {records.map((record) => (
                    <button
                      key={record.type}
                      onClick={() => handleSelect(record.type)}
                      className={`
                        p-2.5 rounded-lg text-left transition-all duration-200
                        ${
                          recordType === record.type
                            ? 'bg-primary-50 border-primary-200 border'
                            : 'hover:bg-slate-50 border border-transparent'
                        }
                      `}
                    >
                      <div className="font-mono text-sm font-semibold text-slate-900">
                        {record.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {record.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Подвал с информацией */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Всего типов: {DNS_RECORD_TYPES.length}</span>
              {selectedRecord?.rfc && (
                <a
                  href={`https://datatracker.ietf.org/doc/html/${selectedRecord.rfc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {selectedRecord.rfc}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Быстрые выборы */}
      <div className="mt-3 flex flex-wrap gap-2">
        {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'ANY'].map((type) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`
              px-4 py-2.5 text-sm font-mono font-medium rounded-lg transition-all duration-200
              ${
                recordType === type
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};
