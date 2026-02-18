/**
 * Опции DNS-запроса
 */
export interface DnsQueryOptions {
  // Отображение
  showCommand: boolean;

  // Отладка
  noRecursive: boolean;
}

/**
 * Опции по умолчанию
 */
export const DEFAULT_QUERY_OPTIONS: DnsQueryOptions = {
  showCommand: false,
  noRecursive: false,
};

/**
 * Описание опции для UI
 */
export interface QueryOptionDefinition {
  key: keyof DnsQueryOptions;
  label: string;
  description: string;
  group: 'display' | 'debug';
}

export const QUERY_OPTIONS: QueryOptionDefinition[] = [
  // Отображение
  {
    key: 'showCommand',
    label: 'Показать команду',
    description: 'Отобразить выполняемую dig команду',
    group: 'display',
  },

  // Отладка
  {
    key: 'noRecursive',
    label: 'Без рекурсии',
    description: 'Нерекурсивный запрос с пошаговым отображением',
    group: 'debug',
  },
];

export const OPTION_GROUPS = {
  display: 'Отображение',
  debug: 'Отладка',
} as const;

export type OptionGroup = keyof typeof OPTION_GROUPS;
