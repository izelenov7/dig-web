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
  | 'ANY'         // Все доступные записи
  
  // Безопасность DNS
  | 'DNSKEY'      // Ключ DNSSEC
  | 'DS'          // Delegation Signer
  | 'RRSIG'       // Подпись ресурсной записи
  | 'NSEC'        // Следующая безопасная запись
  | 'NSEC3'       // NSEC версии 3
  | 'TLSA'        // TLS Authentication
  
  // Специализированные
  | 'NAPTR'       // Naming Authority Pointer
  | 'LOC'         // Географическая локация
  | 'HINFO'       // Информация о хосте
  | 'SSHFP'       // SSH Fingerprint
  | 'SVCB'        // Service Binding
  | 'HTTPS'       // HTTPS binding
  | 'SPLICE'      // SPLICE record
  | '*';         // Wildcard

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
  
  // Безопасность DNS
  { type: 'DNSKEY', name: 'DNSKEY', description: 'Публичный ключ для проверки DNSSEC', rfc: 'RFC 4034', category: 'security' },
  { type: 'DS', name: 'DS', description: 'Хэш DNSKEY для цепочки доверия', rfc: 'RFC 4034', category: 'security' },
  { type: 'RRSIG', name: 'RRSIG', description: 'Криптографическая подпись записей DNSSEC', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC', name: 'NSEC', description: 'Доказывает отсутствие записи в зоне', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC3', name: 'NSEC3', description: 'NSEC с хешированием имён', rfc: 'RFC 5155', category: 'security' },
  { type: 'TLSA', name: 'TLSA', description: 'Сопоставление TLS сертификата с доменом', rfc: 'RFC 6698', category: 'security' },
  
  // Специализированные
  { type: 'NAPTR', name: 'NAPTR', description: 'Правила для преобразования URI', rfc: 'RFC 3403', category: 'specialized' },
  { type: 'LOC', name: 'LOC', description: 'Географические координаты сервера', rfc: 'RFC 1876', category: 'specialized' },
  { type: 'HINFO', name: 'HINFO', description: 'Тип CPU и ОС сервера', rfc: 'RFC 1035', category: 'specialized' },
  { type: 'SSHFP', name: 'SSHFP', description: 'Отпечаток SSH ключа', rfc: 'RFC 4255', category: 'specialized' },
  { type: 'SVCB', name: 'SVCB', description: 'Параметры для подключения к сервису', rfc: 'RFC 9460', category: 'specialized' },
  { type: 'HTTPS', name: 'HTTPS', description: 'Параметры для HTTPS подключений', rfc: 'RFC 9460', category: 'specialized' },
];

/**
 * Группировка типов по категориям
 */
export const DNS_RECORD_CATEGORIES = {
  basic: 'Основные',
  security: 'Безопасность',
  specialized: 'Специализированные',
} as const;

export type DnsRecordCategory = keyof typeof DNS_RECORD_CATEGORIES;
