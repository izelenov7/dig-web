/**
 * DNS Dig - Типы DNS-записей
 * 
 * Этот файл определяет типы DNS-записей, поддерживаемые сервисом.
 * 
 * Для добавления нового типа DNS-записи:
 * 1. Добавьте тип в DnsRecordType union type
 * 2. Добавьте запись в DNS_RECORD_TYPES с описанием и RFC
 * 3. Добавьте числовой код в DNS_TYPE_NUMBERS (lib/dnsService.ts)
 * 4. При необходимости обновите быстрые кнопки в RecordTypeSelector.tsx
 */

/**
 * Типы DNS-записей
 * Поддерживаемые сервисом типы записей
 */
export type DnsRecordType =
  // Основные типы
  | 'A'           // IPv4 адрес
  | 'AAAA'        // IPv6 адрес
  | 'CNAME'       // Каноническое имя
  | 'MX'          // Почтовый обменник
  | 'NS'          // Сервер имён
  | 'TXT'         // Текстовая запись
  | 'CAA';        // Certificate Authority Authorization

/**
 * Информация о типе DNS-записи
 */
export interface DnsRecordTypeInfo {
  type: DnsRecordType;
  name: string;
  description: string;
  rfc?: string;
  category: 'basic' | 'security' | 'service' | 'specialized' | 'deprecated';
}

/**
 * Список всех типов DNS-записей с метаданными
 */
export const DNS_RECORD_TYPES: DnsRecordTypeInfo[] = [
  // Основные
  { type: 'A', name: 'A', description: 'IPv4 адрес хоста', rfc: 'RFC 1035', category: 'basic' },
  { type: 'AAAA', name: 'AAAA', description: 'IPv6 адрес хоста', rfc: 'RFC 3596', category: 'basic' },
  { type: 'CNAME', name: 'CNAME', description: 'Каноническое имя (псевдоним)', rfc: 'RFC 1035', category: 'basic' },
  { type: 'MX', name: 'MX', description: 'Почтовый обменник для приёма email', rfc: 'RFC 1035', category: 'basic' },
  { type: 'NS', name: 'NS', description: 'Авторитативные DNS-серверы домена', rfc: 'RFC 1035', category: 'basic' },
  { type: 'TXT', name: 'TXT', description: 'Текстовая запись для SPF, DKIM, DMARC', rfc: 'RFC 1035', category: 'basic' },
  { type: 'CAA', name: 'CAA', description: 'Разрешённые центры выдачи сертификатов', rfc: 'RFC 8659', category: 'basic' },
];

/**
 * Группировка типов по категориям
 */
export const DNS_RECORD_CATEGORIES = {
  basic: 'Основные',
} as const;

export type DnsRecordCategory = keyof typeof DNS_RECORD_CATEGORIES;
