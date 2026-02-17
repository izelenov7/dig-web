/**
 * Типы DNS-записей
 * Основано на RFC и поддержке в современных DNS-серверах
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
  | 'ANY'         // Все доступные записи
  
  // Безопасность DNS
  | 'DNSKEY'      // Ключ DNSSEC
  | 'DS'          // Delegation Signer
  | 'RRSIG'       // Подпись ресурсной записи
  | 'NSEC'        // Следующая безопасная запись
  | 'NSEC3'       // NSEC версии 3
  | 'NSEC3PARAM'  // Параметры NSEC3
  
  // Сертификаты и безопасность
  | 'TLSA'        // TLS Authentication
  | 'SMIMEA'      // S/MIME Authentication
  | 'CERT'        // Сертификат
  | 'OPENPGPKEY'  // OpenPGP ключ
  
  // Сервисные записи
  | 'SRV'         // Сервис
  | 'CAA'         // Certificate Authority Authorization
  | 'HTTPS'       // HTTPS binding
  | 'SVCB'        // Service Binding
  
  // Специализированные
  | 'HINFO'       // Информация о хосте
  | 'NAPTR'       // Naming Authority Pointer
  | 'LOC'         // Географическая локация
  | 'RP'          // Ответственное лицо
  | 'AFSDB'       // AFS Database
  | 'ALIAS'       // Псевдоним
  
  // Устаревшие / редкие
  | 'ISDN'        // ISDN адрес
  | 'X25'         // X.25 адрес
  | 'GPOS'        // Географическая позиция
  | 'WKS'         // Well Known Services
  | 'RT'          // Route Through
  | 'NSAP'        // NSAP адрес
  | 'NSAP-PTR'    // NSAP указатель
  | 'SIG'         // Подпись
  | 'KEY'         // Ключ
  | 'PX'          // Pointer to X.400
  | 'ATMA'        // ATM адрес
  | 'EID'         // Endpoint Identifier
  | 'NIMLOC'      // Nimrod Locator
  | 'KX'          // Key Exchanger
  | 'DNAME'       // Делегирование имени
  | 'SINK'        // SINK запись
  | 'APL'         // Address Prefix List
  | 'IPSECKEY'    // IPsec Key
  | 'DHCID'       // DHCP Identifier
  | 'NINFO'       // NINFO
  | 'RKEY'        // RKEY
  | 'TALINK'      // Trust Anchor LINK
  | 'CDS'         // Child DS
  | 'CDNSKEY'     // Child DNSKEY
  | 'ONION'       // Onion Service
  | 'TA'          // Trust Anchor
  | 'DLV'         // DNSSEC Lookaside Validation
  | 'URI'         // URI
  | 'EUI48'       // EUI-48 адрес
  | 'EUI64'       // EUI-64 адрес
  | 'L32'         // Locator 32
  | 'L64'         // Locator 64
  | 'LP'          // Locator Pointer
  | 'NIL'         // NIL
  | 'UID'         // User ID
  | 'GID'         // Group ID
  | 'UINFO'       // User Info
  | 'MINFO'       // Mailbox Info
  | 'MB'          // Mailbox
  | 'MG'          // Mail Group
  | 'MR'          // Mail Rename
  | 'MF'          // Mail Forwarder
  | 'MD'          // Mail Destination
  | 'NULL'        // NULL
  | 'SPF'         // Sender Policy Framework (устарел)
  | 'TKEY'        // Transaction Key
  | 'TSIG'        // Transaction Signature
  | 'IXFR'        // Incremental Zone Transfer
  | 'AXFR'        // Full Zone Transfer
  | 'MAILB'       // Mailbox-related
  | 'MAILA'       // Mail Agent
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
  { type: 'A', name: 'A', description: 'IPv4 адрес', category: 'basic' },
  { type: 'AAAA', name: 'AAAA', description: 'IPv6 адрес', category: 'basic' },
  { type: 'CNAME', name: 'CNAME', description: 'Каноническое имя', category: 'basic' },
  { type: 'MX', name: 'MX', description: 'Почтовый обменник', category: 'basic' },
  { type: 'NS', name: 'NS', description: 'Сервер имён', category: 'basic' },
  { type: 'PTR', name: 'PTR', description: 'Указатель', category: 'basic' },
  { type: 'SOA', name: 'SOA', description: 'Начало авторитета', category: 'basic' },
  { type: 'CAA', name: 'CAA', description: 'Certificate Authority Auth', rfc: 'RFC 8659', category: 'basic' },
  { type: 'TXT', name: 'TXT', description: 'Текстовая запись', category: 'basic' },
  { type: 'ANY', name: 'ANY', description: 'Все доступные записи', category: 'basic' },
  
  // Безопасность DNS
  { type: 'DNSKEY', name: 'DNSKEY', description: 'Ключ DNSSEC', rfc: 'RFC 4034', category: 'security' },
  { type: 'DS', name: 'DS', description: 'Delegation Signer', rfc: 'RFC 4034', category: 'security' },
  { type: 'RRSIG', name: 'RRSIG', description: 'Подпись записи', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC', name: 'NSEC', description: 'Следующая безопасная запись', rfc: 'RFC 4034', category: 'security' },
  { type: 'NSEC3', name: 'NSEC3', description: 'NSEC версии 3', rfc: 'RFC 5155', category: 'security' },
  { type: 'NSEC3PARAM', name: 'NSEC3PARAM', description: 'Параметры NSEC3', rfc: 'RFC 5155', category: 'security' },
  
  // Сертификаты
  { type: 'TLSA', name: 'TLSA', description: 'TLS Authentication', rfc: 'RFC 6698', category: 'security' },
  { type: 'SMIMEA', name: 'SMIMEA', description: 'S/MIME Authentication', rfc: 'RFC 8162', category: 'security' },
  { type: 'CERT', name: 'CERT', description: 'Сертификат', rfc: 'RFC 4398', category: 'security' },
  { type: 'OPENPGPKEY', name: 'OPENPGPKEY', description: 'OpenPGP ключ', rfc: 'RFC 7929', category: 'security' },
  
  // Сервисы
  { type: 'SRV', name: 'SRV', description: 'Сервис', rfc: 'RFC 2782', category: 'service' },
  { type: 'CAA', name: 'CAA', description: 'Certificate Authority Auth', rfc: 'RFC 8659', category: 'service' },
  { type: 'HTTPS', name: 'HTTPS', description: 'HTTPS binding', rfc: 'RFC 9460', category: 'service' },
  { type: 'SVCB', name: 'SVCB', description: 'Service Binding', rfc: 'RFC 9460', category: 'service' },
  
  // Специализированные
  { type: 'HINFO', name: 'HINFO', description: 'Информация о хосте', rfc: 'RFC 1034', category: 'specialized' },
  { type: 'NAPTR', name: 'NAPTR', description: 'Naming Authority Pointer', rfc: 'RFC 3403', category: 'specialized' },
  { type: 'LOC', name: 'LOC', description: 'Геолокация', rfc: 'RFC 1876', category: 'specialized' },
  { type: 'RP', name: 'RP', description: 'Ответственное лицо', rfc: 'RFC 1183', category: 'specialized' },
  { type: 'AFSDB', name: 'AFSDB', description: 'AFS Database', rfc: 'RFC 1183', category: 'specialized' },
  { type: 'ALIAS', name: 'ALIAS', description: 'Псевдоним', category: 'specialized' },
  
  // Устаревшие
  { type: 'ISDN', name: 'ISDN', description: 'ISDN адрес', rfc: 'RFC 1183', category: 'deprecated' },
  { type: 'X25', name: 'X25', description: 'X.25 адрес', rfc: 'RFC 1183', category: 'deprecated' },
  { type: 'GPOS', name: 'GPOS', description: 'Географическая позиция', rfc: 'RFC 1712', category: 'deprecated' },
  { type: 'WKS', name: 'WKS', description: 'Well Known Services', rfc: 'RFC 1035', category: 'deprecated' },
  { type: 'RT', name: 'RT', description: 'Route Through', rfc: 'RFC 1183', category: 'deprecated' },
  { type: 'NSAP', name: 'NSAP', description: 'NSAP адрес', rfc: 'RFC 1706', category: 'deprecated' },
  { type: 'KX', name: 'KX', description: 'Key Exchanger', rfc: 'RFC 2230', category: 'deprecated' },
  { type: 'DNAME', name: 'DNAME', description: 'Делегирование имени', rfc: 'RFC 6672', category: 'deprecated' },
  { type: 'EUI48', name: 'EUI48', description: 'EUI-48 адрес', rfc: 'RFC 7043', category: 'deprecated' },
  { type: 'EUI64', name: 'EUI64', description: 'EUI-64 адрес', rfc: 'RFC 7043', category: 'deprecated' },
  { type: 'SPF', name: 'SPF', description: 'Sender Policy Framework', rfc: 'RFC 7208', category: 'deprecated' },
];

/**
 * Группировка типов по категориям
 */
export const DNS_RECORD_CATEGORIES = {
  basic: 'Основные',
  security: 'Безопасность',
  service: 'Сервисы',
  specialized: 'Специализированные',
  deprecated: 'Устаревшие',
} as const;

export type DnsRecordCategory = keyof typeof DNS_RECORD_CATEGORIES;
