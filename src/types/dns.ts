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
  | 'PTR'         // Указатель
  | 'SOA'         // Начало авторитета
  | 'TXT'         // Текстовая запись
  | 'CAA'         // Certificate Authority Authorization
  | 'SRV'         // Сервис
  | 'ANY';        // Все доступные записи

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
  { type: 'PTR', name: 'PTR', description: 'Обратный DNS (IP → домен)', rfc: 'RFC 1035', category: 'basic' },
  { type: 'SOA', name: 'SOA', description: 'Административная информация о зоне', rfc: 'RFC 1035', category: 'basic' },
  { type: 'TXT', name: 'TXT', description: 'Текстовая запись для SPF, DKIM, DMARC', rfc: 'RFC 1035', category: 'basic' },
  { type: 'CAA', name: 'CAA', description: 'Разрешённые центры выдачи сертификатов', rfc: 'RFC 8659', category: 'basic' },
  { type: 'SRV', name: 'SRV', description: 'Хост и порт для сервисов (SIP, XMPP)', rfc: 'RFC 2782', category: 'basic' },
  { type: 'ANY', name: 'ANY', description: 'Все доступные записи домена', rfc: 'RFC 1035', category: 'basic' },
];

/**
 * Группировка типов по категориям
 */
export const DNS_RECORD_CATEGORIES = {
  basic: 'Основные',
} as const;

export type DnsRecordCategory = keyof typeof DNS_RECORD_CATEGORIES;
