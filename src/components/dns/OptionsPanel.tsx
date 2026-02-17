import React, { useMemo } from 'react';
import { Checkbox, Card } from '../ui';
import { QUERY_OPTIONS, OPTION_GROUPS } from '../../types';
import { useDnsStore } from '../../store';

type OptionGroup = 'display' | 'debug';

interface OptionsPanelProps {
  collapsed?: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  collapsed = false,
}) => {
  const { options, updateOption } = useDnsStore();

  // Группировка опций
  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof QUERY_OPTIONS> = {};

    QUERY_OPTIONS.forEach((option) => {
      if (!groups[option.group]) {
        groups[option.group] = [];
      }
      groups[option.group].push(option);
    });

    return groups;
  }, []);

  if (collapsed) {
    return null;
  }

  return (
    <Card title="Опции запроса" description="Настройте параметры выполнения DNS-запроса">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedOptions).map(([group, groupOptions]) => (
          <div key={group} className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {OPTION_GROUPS[group as OptionGroup]}
            </h4>
            <div className="space-y-1">
              {groupOptions.map((option) => (
                <Checkbox
                  key={option.key}
                  label={option.label}
                  description={option.description}
                  checked={options[option.key]}
                  onChange={(checked) => updateOption(option.key, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
