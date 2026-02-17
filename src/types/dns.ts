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
  { type: 'A', name: 'A', description: 'IPv4 адрес хоста. Сопоставляет доменное имя с 32-битным IPv4 адресом.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'AAAA', name: 'AAAA', description: 'IPv6 адрес хоста. Сопоставляет доменное имя с 128-битным IPv6 адресом.', rfc: 'RFC 3596', category: 'basic' },
  { type: 'CNAME', name: 'CNAME', description: 'Каноническое имя. Псевдоним для другого доменного имени.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'MX', name: 'MX', description: 'Почтовый обменник. Указывает серверы для приёма электронной почты для домена.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'NS', name: 'NS', description: 'Сервер имён. Указывает авторитативные DNS-серверы для домена.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'PTR', name: 'PTR', description: 'Указатель. Используется для обратного DNS (IP → домен).', rfc: 'RFC 1035', category: 'basic' },
  { type: 'SOA', name: 'SOA', description: 'Начало авторитета. Содержит административную информацию о зоне DNS.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'TXT', name: 'TXT', description: 'Текстовая запись. Произвольный текст для SPF, DKIM, DMARC и других целей.', rfc: 'RFC 1035', category: 'basic' },
  { type: 'CAA', name: 'CAA', description: 'Certificate Authority Authorization. Указывает, какие CA могут выдавать сертификаты для домена.', rfc: 'RFC 8659', category: 'basic' },
  { type: 'SRV', name: 'SRV', description: 'Сервис. Определяет хост и порт для сервисов (SIP, XMPP, LDAP).', rfc: 'RFC 2782', category: 'basic' },
  { type: 'ANY', name: 'ANY', description: 'Запрос всех доступных записей для домена.', rfc: 'RFC 1035', category: 'basic' },
  
  // Безопасность DNS
  { type: 'DNSKEY', name: 'DNSKEY', description: 'Ключ DNSSEC. Содержит публичный ключ для проверки DNSSEC подписей.', rfc: 'RFC 4034', category: 'security' },
  { type: 'DS', name: 'DS', description: 'Delegation Signer. Хэш DNSKEY для цепочки доверия DNSSEC.', rfc: 'RFC 4034', category: 'security' },
  { type: 'RRSIG', name: 'RRSIG', description: 'Resource Record Signature. Криптографическая подпись набора записей DNSSEC.', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC', name: 'NSEC', description: 'Next Secure. Доказывает отсутствие записи в зоне DNSSEC.', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC3', name: 'NSEC3', description: 'NSEC версии 3. Улучшенная версия NSEC с хешированием имён.', rfc: 'RFC 5155', category: 'security' },
  { type: 'TLSA', name: 'TLSA', description: 'TLS Authentication. Сопоставляет TLS сертификат с доменом (DANE).', rfc: 'RFC 6698', category: 'security' },
  
  // Специализированные
  { type: 'NAPTR', name: 'NAPTR', description: 'Naming Authority Pointer. Правила для преобразования URI (ENUM, SIP).', rfc: 'RFC 3403', category: 'specialized' },
  { type: 'LOC', name: 'LOC', description: 'Географическая локация. Координаты (широта, долгота, высота) сервера.', rfc: 'RFC 1876', category: 'specialized' },
  { type: 'HINFO', name: 'HINFO', description: 'Информация о хосте. Тип CPU и ОС сервера.', rfc: 'RFC 1035', category: 'specialized' },
  { type: 'SSHFP', name: 'SSHFP', description: 'SSH Fingerprint. Отпечаток SSH ключа для проверки подлинности.', rfc: 'RFC 4255', category: 'specialized' },
  { type: 'SVCB', name: 'SVCB', description: 'Service Binding. Параметры для подключения к сервису.', rfc: 'RFC 9460', category: 'specialized' },
  { type: 'HTTPS', name: 'HTTPS', description: 'HTTPS binding. Параметры для HTTPS подключений (ALPN, ECH).', rfc: 'RFC 9460', category: 'specialized' },
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
