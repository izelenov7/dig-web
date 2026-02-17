/**
 * Опции DNS-запроса
 */
export interface DnsQueryOptions {
  // Отображение
  showCommand: boolean;

  // Отладка
  trace: boolean;
  whois: boolean;
  noRecursive: boolean;
}

/**
 * Опции по умолчанию
 */
export const DEFAULT_QUERY_OPTIONS: DnsQueryOptions = {
  showCommand: false,
  trace: false,
  whois: false,
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
    key: 'trace',
    label: 'Трассировка',
    description: 'Трассировка пути запроса',
    group: 'debug',
  },
  {
    key: 'whois',
    label: 'Whois',
    description: 'Whois-запрос информации о домене',
    group: 'debug',
  },
  {
    key: 'noRecursive',
    label: 'Без рекурсии',
    description: 'Нерекурсивный запрос от корневых серверов',
    group: 'debug',
  },
];

export const OPTION_GROUPS = {
  display: 'Отображение',
  debug: 'Отладка',
} as const;

export type OptionGroup = keyof typeof OPTION_GROUPS;
