/**
 * DNS Dig - Zustand Store для управления состоянием приложения
 * 
 * Этот файл содержит центральное хранилище состояния для всего приложения.
 * Zustand выбран за простоту и минимальный boilerplate код.
 * 
 * Состоит из трёх основных частей:
 * 1. DnsFormState - состояние формы (домен, тип записи, резолверы, опции)
 * 2. QueryResultState - состояние результатов запроса (статус, данные, ошибки)
 * 3. HistoryState - история запросов (последние 10 запросов)
 * 
 * Для добавления нового поля состояния:
 * 1. Добавьте поле в соответствующий интерфейс
 * 2. Добавьте начальное значение в create()
 * 3. Добавьте action для изменения значения (если нужно)
 */

import { create } from 'zustand';
import type { DnsRecordType, DnsQueryOptions, NameserverConfig } from '../types';
import { DEFAULT_QUERY_OPTIONS } from '../types';
import type { DohResponse } from '../lib/dnsService';

/**
 * Статус выполнения запроса
 */
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Результат DNS-запроса
 */
export interface QueryResult {
  query: {
    domain: string;
    punycodeDomain?: string;
    type: DnsRecordType;
    timestamp: string;
  };
  answers: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
    rdata?: string;
  }>;
  authority: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
  additional: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
  stats: {
    queryTime: number;
    server: string;
    when: string;
    status: string;
    flags: {
      rd: boolean;
      ra: boolean;
      ad: boolean;
      cd: boolean;
      tc: boolean;
    };
    authoritativeNameservers?: string[];
    tldNameservers?: Array<{ name: string; ipv4?: string; ipv6?: string }>;
  };
  rawOutput: string;
  bindOutput: string;
  digFullOutput: string;
  nonRecursiveOutput?: string;
  fullResponse: DohResponse;
}

/**
 * Состояние формы DNS-запроса
 */
interface DnsFormState {
  // Основные поля
  domain: string;
  recordType: DnsRecordType;
  
  // Конфигурация неймсерверов
  nameserverConfig: NameserverConfig;
  
  // Опции запроса
  options: DnsQueryOptions;
  
  // Действия формы
  setDomain: (domain: string) => void;
  setRecordType: (type: DnsRecordType) => void;
  updateNameserverConfig: (config: Partial<NameserverConfig>) => void;
  updateOption: <K extends keyof DnsQueryOptions>(key: K, value: DnsQueryOptions[K]) => void;
  resetForm: () => void;
}

/**
 * Состояние результатов запроса
 */
interface QueryResultState {
  status: QueryStatus;
  result: QueryResult | null;
  error: string | null;

  // Действия результатов
  setLoading: () => void;
  setSuccess: (result: QueryResult) => void;
  setError: (error: string) => void;
  clearResult: () => void;
}

/**
 * Состояние истории запросов
 */
interface HistoryState {
  history: QueryResult[];
  addToHistory: (result: QueryResult) => void;
  clearHistory: () => void;
}

/**
 * Объединённое состояние приложения
 */
interface AppState extends DnsFormState, QueryResultState, HistoryState {}

/**
 * Начальное состояние конфигурации неймсерверов
 */
const DEFAULT_NAMESERVER_CONFIG: NameserverConfig = {
  mode: 'default',
  customServers: [],
};

/**
 * Создание store для DNS-диагностики
 */
export const useDnsStore = create<AppState>((set) => ({
  // === Форма ===
  domain: '',
  recordType: 'A',
  nameserverConfig: DEFAULT_NAMESERVER_CONFIG,
  options: DEFAULT_QUERY_OPTIONS,
  
  setDomain: (domain) => set({ domain }),
  
  setRecordType: (recordType) => set({ recordType }),
  
  updateNameserverConfig: (config) => set((state) => ({
    nameserverConfig: { ...state.nameserverConfig, ...config },
  })),
  
  updateOption: (key, value) => set((state) => ({
    options: { ...state.options, [key]: value },
  })),
  
  resetForm: () => set({
    domain: '',
    recordType: 'A',
    nameserverConfig: DEFAULT_NAMESERVER_CONFIG,
    options: DEFAULT_QUERY_OPTIONS,
  }),
  
  // === Результаты ===
  status: 'idle',
  result: null,
  error: null,

  setLoading: () => set({ status: 'loading', error: null }),

  setSuccess: (result) => set({
    status: 'success',
    result,
    error: null,
  }),

  setError: (error) => set({
    status: 'error',
    error,
    result: null,
  }),

  clearResult: () => set({
    status: 'idle',
    result: null,
    error: null,
  }),
  
  // === История ===
  history: [],
  
  addToHistory: (result) => set((state) => ({
    history: [result, ...state.history].slice(0, 10), // Хранить последние 10
  })),
  
  clearHistory: () => set({ history: [] }),
}));

/**
 * Селекторы для удобного доступа к состоянию
 */
export const selectFormState = (state: AppState) => ({
  domain: state.domain,
  recordType: state.recordType,
  nameserverConfig: state.nameserverConfig,
  options: state.options,
});

export const selectResultState = (state: AppState) => ({
  status: state.status,
  result: state.result,
  error: state.error,
});

export const selectIsFormValid = (state: AppState): boolean => {
  const { domain, nameserverConfig } = state;
  
  // Проверка домена
  if (!domain.trim()) return false;
  
  // Проверка конфигурации неймсерверов
  if (nameserverConfig.mode === 'custom' && nameserverConfig.customServers.length === 0) {
    return false;
  }
  
  return true;
};
