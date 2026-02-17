import React, { useState, useCallback, useMemo } from 'react';
import { Input, Badge } from '../ui';
import { NAMESERVER_PRESETS } from '../../types';
import { useDnsStore } from '../../store';

type NameserverMode = 'default' | 'preset' | 'all' | 'authoritative' | 'custom';

interface NameserverSelectorProps {
  compact?: boolean;
}

export const NameserverSelector: React.FC<NameserverSelectorProps> = ({
  compact = false,
}) => {
  const { nameserverConfig, updateNameserverConfig } = useDnsStore();
  const [customInput, setCustomInput] = useState('');

  const { mode, presetId, customServers } = nameserverConfig;

  // Текущий пресет
  const currentPreset = useMemo(
    () => NAMESERVER_PRESETS.find((p) => p.id === presetId),
    [presetId]
  );

  // Обработчик смены режима
  const handleModeChange = useCallback(
    (newMode: NameserverMode) => {
      updateNameserverConfig({ mode: newMode });
    },
    [updateNameserverConfig]
  );

  // Обработчик выбора пресета
  const handlePresetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNameserverConfig({ presetId: e.target.value });
    },
    [updateNameserverConfig]
  );

  // Добавление кастомного сервера
  const handleAddCustomServer = useCallback(() => {
    const servers = customInput
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (servers.length > 0) {
      updateNameserverConfig({
        customServers: [...customServers, ...servers],
      });
      setCustomInput('');
    }
  }, [customInput, customServers, updateNameserverConfig]);

  // Удаление кастомного сервера
  const handleRemoveCustomServer = useCallback(
    (server: string) => {
      updateNameserverConfig({
        customServers: customServers.filter((s) => s !== server),
      });
    },
    [customServers, updateNameserverConfig]
  );

  // Очистка всех кастомных серверов
  const handleClearCustomServers = useCallback(() => {
    updateNameserverConfig({ customServers: [] });
  }, [updateNameserverConfig]);

  if (compact) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nameservers
        </label>
        <select
          value={mode === 'preset' ? presetId : mode}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'default' || value === 'all' || value === 'authoritative') {
              handleModeChange(value as NameserverMode);
            } else {
              handleModeChange('preset');
              updateNameserverConfig({ presetId: value });
            }
          }}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer text-sm"
        >
          <option value="default">Default resolver</option>
          <option value="all">All resolvers</option>
          <option value="authoritative">Authoritative</option>
          <optgroup label="Предустановленные">
            {NAMESERVER_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.servers.join(', ')})
              </option>
            ))}
          </optgroup>
          <option value="custom">Custom...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        DNS-резолверы
      </label>

      {/* Режимы выбора */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleModeChange('default')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'default'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Default
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'all'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('authoritative')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'authoritative'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Authoritative
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('preset')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'preset'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Preset
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('custom')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'custom'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Выбор пресета */}
      {mode === 'preset' && (
        <div className="space-y-3">
          <select
            value={presetId || ''}
            onChange={handlePresetChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer"
          >
            <option value="" disabled>
              Выберите резолвер...
            </option>
            {NAMESERVER_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} — {preset.description}
              </option>
            ))}
          </select>

          {currentPreset && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {currentPreset.country && (
                  <span className="text-lg" title={currentPreset.country}>
                    🌐
                  </span>
                )}
                <div>
                  <div className="font-medium text-slate-900">
                    {currentPreset.name}
                  </div>
                  <div className="text-sm text-slate-500 font-mono">
                    {currentPreset.servers.join(', ')}
                  </div>
                </div>
              </div>
              <Badge variant="info">{currentPreset.servers.length} сервера</Badge>
            </div>
          )}
        </div>
      )}

      {/* Кастомные серверы */}
      {mode === 'custom' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="8.8.8.8, 1.1.1.1"
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomServer();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomServer}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Добавить
            </button>
          </div>

          {customServers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Добавлено серверов: {customServers.length}
                </span>
                <button
                  type="button"
                  onClick={handleClearCustomServers}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Очистить все
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customServers.map((server) => (
                  <span
                    key={server}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-700"
                  >
                    {server}
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomServer(server)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label={`Удалить ${server}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Информация о режиме */}
      {mode !== 'custom' && mode !== 'preset' && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            {mode === 'default' &&
              'Использовать резолвер по умолчанию'}
            {mode === 'all' &&
              'Запросить все доступные резолверы'}
            {mode === 'authoritative' &&
              'Использовать авторитативные серверы для домена'}
          </p>
        </div>
      )}
    </div>
  );
};
