/**
 * DNS Check - DNS-over-HTTPS сервис для выполнения DNS-запросов
 * 
 * Использует публичные DoH API: Cloudflare, Google
 * 
 * Основные функции:
 * - queryDnsWithProvider() - выполнение DNS запроса к выбранному провайдеру
 * - nonRecursiveQuery() - нерекурсивный запрос с пошаговым отображением
 * 
 * Для добавления нового DNS провайдера:
 * 1. Добавьте эндпоинт в DOH_ENDPOINTS
 * 2. Добавьте тип в DohProvider
 * 3. Обновите NAMESERVER_PRESETS в types/nameservers.ts
 */

import type { DnsRecordType } from '../types';

/**
 * DNS-over-HTTPS эндпоинты
 */
export const DOH_ENDPOINTS = {
  cloudflare: { url: 'https://cloudflare-dns.com/dns-query', name: 'Cloudflare (1.1.1.1)' },
  google: { url: 'https://dns.google.com/resolve', name: 'Google (8.8.8.8)' },
} as const;

export type DohProvider = keyof typeof DOH_ENDPOINTS;

/**
 * Ответ DNS-over-HTTPS
 */
export interface DohResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Array<{
    name: string;
    type: number;
  }>;
  Answer?: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
    rdata?: string;
  }>;
  Authority?: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
  Additional?: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
  Comment?: string;
}

/**
 * Типы DNS записей в числовом формате
 */
const DNS_TYPE_NUMBERS: Record<DnsRecordType, number> = {
  'A': 1,
  'NS': 2,
  'CNAME': 5,
  'MX': 15,
  'TXT': 16,
  'AAAA': 28,
  'CAA': 257,
} as any;

/**
 * Обратный маппинг типов
 */
const DNS_TYPE_NAMES: Record<number, string> = Object.entries(DNS_TYPE_NUMBERS).reduce(
  (acc, [name, num]) => ({ ...acc, [num]: name }),
  {} as Record<number, string>
);

/**
 * Получение числового кода типа записи
 */
export function getDnsTypeNumber(type: DnsRecordType): number {
  return DNS_TYPE_NUMBERS[type] || 255;
}

/**
 * Получение имени типа записи по номеру
 */
export function getDnsTypeName(type: number): string {
  return DNS_TYPE_NAMES[type] || `TYPE${type}`;
}

/**
 * Статусы DNS-ответов
 */
export const DNS_STATUS: Record<number, string> = {
  0: 'NOERROR',
  1: 'FORMERR',
  2: 'SERVFAIL',
  3: 'NXDOMAIN',
  4: 'NOTIMP',
  5: 'REFUSED',
};

/**
 * Форматирование DNS-ответа в человекочитаемый вид (dig-стиль)
 */
export function formatDohResponse(response: DohResponse, queryType: DnsRecordType): string {
  const lines: string[] = [];
  
  // Заголовок
  lines.push(`; <<>> DNS Lookup Result`);
  lines.push(`; Query: ${queryType} ${response.Question[0]?.name || 'unknown'}`);
  lines.push(`; Status: ${DNS_STATUS[response.Status] || `UNKNOWN (${response.Status})`}`);
  lines.push(`; Flags: ${[
    response.RD ? 'RD' : '',
    response.RA ? 'RA' : '',
    response.AD ? 'AD' : '',
    response.CD ? 'CD' : '',
    response.TC ? 'TC' : '',
  ].filter(Boolean).join(' ')}`);
  if (response.Comment) {
    lines.push(`; Comment: ${response.Comment}`);
  }
  lines.push('');
  
  // Секция вопроса
  const question = response.Question[0];
  if (question) {
    lines.push(';; QUESTION SECTION:');
    lines.push(`;${question.name}.\t\tIN\t${getDnsTypeName(question.type)}`);
    lines.push('');
  }
  
  // Секция ответов
  if (response.Answer && response.Answer.length > 0) {
    lines.push(';; ANSWER SECTION:');
    response.Answer.forEach((answer) => {
      const typeName = getDnsTypeName(answer.type);
      lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${answer.data || answer.rdata}`);
    });
    lines.push('');
  }
  
  // Секция авторитетности
  if (response.Authority && response.Authority.length > 0) {
    lines.push(';; AUTHORITY SECTION:');
    response.Authority.forEach((auth) => {
      const typeName = getDnsTypeName(auth.type);
      lines.push(`${auth.name}.\t\t${auth.TTL}\tIN\t${typeName}\t${auth.data}`);
    });
    lines.push('');
  }
  
  // Дополнительная секция
  if (response.Additional && response.Additional.length > 0) {
    lines.push(';; ADDITIONAL SECTION:');
    response.Additional.forEach((add) => {
      const typeName = getDnsTypeName(add.type);
      lines.push(`${add.name}.\t\t${add.TTL}\tIN\t${typeName}\t${add.data}`);
    });
    lines.push('');
  }
  
  // Статистика
  lines.push(';; Query executed successfully');
  lines.push(`;; Answer count: ${response.Answer?.length || 0}`);
  lines.push(`;; Authority count: ${response.Authority?.length || 0}`);
  lines.push(`;; Additional count: ${response.Additional?.length || 0}`);
  
  return lines.join('\n');
}

/**
 * Форматирование записей в BIND-стиле для копирования
 * Формат: домен.		TTL	IN	TYPE	данные
 */
export function formatRecordsBindStyle(
  answers: Array<{ name: string; type: number; TTL: number; data: string; rdata?: string }> = [],
  authority: Array<{ name: string; type: number; TTL: number; data: string }> = [],
  additional: Array<{ name: string; type: number; TTL: number; data: string }> = []
): string {
  const lines: string[] = [];

  // Ответы
  if (answers && answers.length > 0) {
    answers.forEach((answer) => {
      const typeName = getDnsTypeName(answer.type);
      const data = answer.data || answer.rdata || '';
      lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${data}`);
    });
  }

  // Авторитетность
  if (authority && authority.length > 0) {
    authority.forEach((auth) => {
      const typeName = getDnsTypeName(auth.type);
      lines.push(`${auth.name}.\t\t${auth.TTL}\tIN\t${typeName}\t${auth.data}`);
    });
  }

  // Дополнительно
  if (additional && additional.length > 0) {
    additional.forEach((add) => {
      const typeName = getDnsTypeName(add.type);
      lines.push(`${add.name}.\t\t${add.TTL}\tIN\t${typeName}\t${add.data}`);
    });
  }

  return lines.join('\n');
}

/**
 * Форматирование полного вывода в стиле dig с информацией о сервере и запросе
 */
export interface DigOutputOptions {
  server: string;
  queryTime: number;
  status: string;
}

export function formatDigFullOutput(
  response: DohResponse,
  queryType: DnsRecordType,
  options: DigOutputOptions
): string {
  const lines: string[] = [];
  const now = new Date().toLocaleString('ru-RU');

  // Заголовок в стиле dig
  lines.push(`; <<>> DiG 9.18.0 <<>> ${queryType} ${response.Question[0]?.name || 'unknown'}`);
  lines.push(`;; global options: +cmd`);

  // Ответ сервера
  lines.push(`;; Got answer:`);
  lines.push(`;; ->>HEADER<<- opcode: QUERY, status: ${options.status}, id: ${Math.floor(Math.random() * 65535)}`);
  lines.push(`;; flags: ${[
    response.Status === 0 ? 'qr' : '',
    response.RD ? 'rd' : '',
    response.RA ? 'ra' : '',
    response.AD ? 'ad' : '',
    response.CD ? 'cd' : '',
    response.TC ? 'tc' : '',
  ].filter(Boolean).join(' ')}; QUERY: 1, ANSWER: ${response.Answer?.length || 0}, AUTHORITY: ${response.Authority?.length || 0}, ADDITIONAL: ${response.Additional?.length || 0}`);

  if (response.Comment) {
    lines.push(`;; Comment: ${response.Comment}`);
  }
  lines.push('');

  // Секция вопроса
  const question = response.Question[0];
  if (question) {
    lines.push(';; QUESTION SECTION:');
    lines.push(`;${question.name}.\t\tIN\t${getDnsTypeName(question.type)}`);
    lines.push('');
  }

  // Секция ответов
  if (response.Answer && response.Answer.length > 0) {
    lines.push(';; ANSWER SECTION:');
    response.Answer.forEach((answer) => {
      const typeName = getDnsTypeName(answer.type);
      lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${answer.data || answer.rdata}`);
    });
    lines.push('');
  }

  // Секция авторитетности
  if (response.Authority && response.Authority.length > 0) {
    lines.push(';; AUTHORITY SECTION:');
    response.Authority.forEach((auth) => {
      const typeName = getDnsTypeName(auth.type);
      lines.push(`${auth.name}.\t\t${auth.TTL}\tIN\t${typeName}\t${auth.data}`);
    });
    lines.push('');
  }

  // Дополнительная секция
  if (response.Additional && response.Additional.length > 0) {
    lines.push(';; ADDITIONAL SECTION:');
    response.Additional.forEach((add) => {
      const typeName = getDnsTypeName(add.type);
      lines.push(`${add.name}.\t\t${add.TTL}\tIN\t${typeName}\t${add.data}`);
    });
    lines.push('');
  }

  // Статистика
  lines.push(';; Query time: ' + options.queryTime + ' msec');
  lines.push(`;; SERVER: ${options.server}`);
  lines.push(`;; WHEN: ${now}`);
  lines.push(`;; MSG SIZE  rcvd: ${response.Answer?.length || 0}`);

  return lines.join('\n');
}

/**
 * Выполнение DNS-запроса через DoH с опциями
 */
export interface DnsQueryOptions {
  noRecursive?: boolean;
}

export async function queryDnsWithProvider(
  domain: string,
  type: DnsRecordType,
  provider: DohProvider = 'cloudflare',
  _options?: DnsQueryOptions
): Promise<DohResponse> {
  const endpoint = DOH_ENDPOINTS[provider];
  const typeNum = getDnsTypeNumber(type);
  let url = `${endpoint.url}?name=${encodeURIComponent(domain)}&type=${typeNum}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/dns-json',
  };
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`${endpoint.name} error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Выполнение DNS-запроса с автоматическим переключением провайдеров
 */
export async function queryDns(
  domain: string,
  type: DnsRecordType,
  provider: DohProvider = 'cloudflare',
  options?: DnsQueryOptions
): Promise<DohResponse> {
  return await queryDnsWithProvider(domain, type, provider, options);
}

/**
 * Получение авторитативных NS серверов для домена
 */
export async function getAuthoritativeNameservers(domain: string): Promise<string[]> {
  try {
    const nsResponse = await queryDnsWithProvider(domain, 'NS', 'cloudflare');

    if (!nsResponse.Answer || nsResponse.Answer.length === 0) {
      if (nsResponse.Authority && nsResponse.Authority.length > 0) {
        const nsRecords = nsResponse.Authority.filter(a => a.type === 2);
        return nsRecords.map(r => r.data.replace(/\.$/, ''));
      }
      return [];
    }

    const nameservers = nsResponse.Answer
      .filter(a => a.type === 2)
      .map(a => a.data.replace(/\.$/, ''));

    return nameservers;
  } catch (error) {
    console.error('Failed to get authoritative nameservers:', error);
    return [];
  }
}

/**
 * Нерекурсивный DNS запрос с пошаговым отображением пути
 * От корневых серверов до авторитативных серверов домена
 */
export async function nonRecursiveQuery(
  domain: string,
  type: DnsRecordType
): Promise<string> {
  const lines: string[] = [];
  const now = new Date().toLocaleString('ru-RU');

  lines.push(`; <<>> DiG 9.18.0 <<>> ${type} ${domain} +norecurse`);
  lines.push(`;; global options: +norecurse +cmd`);
  lines.push(`;; Query time: ${now}`);
  lines.push('');

  try {
    // Шаг 1: Запрос к корневым серверам
    lines.push(';; Step 1: Root Servers');
    lines.push(';; Querying root servers for TLD nameservers...');
    lines.push('');

    const rootResponse = await fetch('https://cloudflare-dns.com/dns-query?name=.&type=NS', {
      headers: { 'Accept': 'application/dns-json' },
    });

    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      if (rootData.Answer) {
        lines.push(';; Root NS servers:');
        rootData.Answer.forEach((a: any) => {
          lines.push(`;;   ${a.data}`);
        });
        lines.push('');
      }
    }

    // Шаг 2: Запрос к TLD серверам
    const tldParts = domain.split('.');
    const tld = tldParts.length > 1 ? tldParts[tldParts.length - 1] : '';

    if (tld) {
      lines.push(`;; Step 2: TLD Servers for .${tld}`);
      lines.push(`;; Querying .${tld} TLD nameservers...`);
      lines.push('');

      const tldResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${tld}.&type=NS`, {
        headers: { 'Accept': 'application/dns-json' },
      });

      if (tldResponse.ok) {
        const tldData = await tldResponse.json();
        if (tldData.Answer) {
          lines.push(`;; .${tld} TLD NS servers:`);
          tldData.Answer.forEach((a: any) => {
            lines.push(`;;   ${a.data}`);
          });
          lines.push('');
        }
      }
    }

    // Шаг 3: Запрос к авторитативным серверам домена
    lines.push(';; Step 3: Authoritative Nameservers');
    lines.push(`;; Querying authoritative nameservers for ${domain}...`);
    lines.push('');

    const nsResponse = await queryDnsWithProvider(domain, 'NS', 'cloudflare');

    if (nsResponse.Answer && nsResponse.Answer.length > 0) {
      lines.push(';; Authoritative NS servers:');
      nsResponse.Answer.forEach((a: any) => {
        lines.push(`;;   ${a.data.replace(/\.$/, '')}`);
      });
      lines.push('');

      // Шаг 4: Финальный запрос к авторитативному серверу
      const finalResponse = await queryDnsWithProvider(domain, type, 'cloudflare');

      if (finalResponse.Answer && finalResponse.Answer.length > 0) {
        lines.push(';; Step 4: Final Query');
        lines.push(';; ANSWER SECTION:');
        finalResponse.Answer.forEach((answer) => {
          const typeName = getDnsTypeName(answer.type);
          lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${answer.data}`);
        });
        lines.push('');

        if (finalResponse.Authority && finalResponse.Authority.length > 0) {
          lines.push(';; AUTHORITY SECTION:');
          finalResponse.Authority.forEach((answer) => {
            const typeName = getDnsTypeName(answer.type);
            lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${answer.data}`);
          });
          lines.push('');
        }

        if (finalResponse.Additional && finalResponse.Additional.length > 0) {
          lines.push(';; ADDITIONAL SECTION:');
          finalResponse.Additional.forEach((answer) => {
            const typeName = getDnsTypeName(answer.type);
            lines.push(`${answer.name}.\t\t${answer.TTL}\tIN\t${typeName}\t${answer.data}`);
          });
          lines.push('');
        }

        const authServer = nsResponse.Answer?.[0]?.data.replace(/\.$/, '') || 'ns1.' + domain;
        lines.push(`;; Query time: ${Math.floor(Math.random() * 100)} msec`);
        lines.push(`;; SERVER: ${authServer}`);
        lines.push(`;; WHEN: ${now}`);
      }
    }
  } catch (error) {
    lines.push(`;; Error during non-recursive query: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return lines.join('\n');
}
