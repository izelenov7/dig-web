/**
 * Авторитативные DNS серверы для доменных зон (TLD)
 * Данные из IANA whois
 */

export interface TldNameservers {
  tld: string;
  nameservers: Array<{
    name: string;
    ipv4?: string;
    ipv6?: string;
  }>;
}

/**
 * Авторитативные серверы для популярных доменных зон
 * Источник: https://www.iana.org/domains/root/servers
 */
export const TLD_AUTHORITATIVE_SERVERS: Record<string, TldNameservers> = {
  'ru': {
    tld: 'ru',
    nameservers: [
      { name: 'A.DNS.RIPN.NET', ipv4: '193.232.128.6', ipv6: '2001:678:17:0:193:232:128:6' },
      { name: 'B.DNS.RIPN.NET', ipv4: '194.85.252.62', ipv6: '2001:678:16:0:194:85:252:62' },
      { name: 'D.DNS.RIPN.NET', ipv4: '194.190.124.17', ipv6: '2001:678:18:0:194:190:124:17' },
      { name: 'E.DNS.RIPN.NET', ipv4: '193.232.142.17', ipv6: '2001:678:15:0:193:232:142:17' },
      { name: 'F.DNS.RIPN.NET', ipv4: '193.232.156.17', ipv6: '2001:678:14:0:193:232:156:17' },
    ],
  },
  'su': {
    tld: 'su',
    nameservers: [
      { name: 'A.DNS.RIPN.NET', ipv4: '193.232.128.6', ipv6: '2001:678:17:0:193:232:128:6' },
      { name: 'B.DNS.RIPN.NET', ipv4: '194.85.252.62', ipv6: '2001:678:16:0:194:85:252:62' },
      { name: 'D.DNS.RIPN.NET', ipv4: '194.190.124.17', ipv6: '2001:678:18:0:194:190:124:17' },
      { name: 'E.DNS.RIPN.NET', ipv4: '193.232.142.17', ipv6: '2001:678:15:0:193:232:142:17' },
      { name: 'F.DNS.RIPN.NET', ipv4: '193.232.156.17', ipv6: '2001:678:14:0:193:232:156:17' },
    ],
  },
  'xn--p1ai': {
    tld: 'рф',
    nameservers: [
      { name: 'A.DNS.RIPN.NET', ipv4: '193.232.128.6', ipv6: '2001:678:17:0:193:232:128:6' },
      { name: 'B.DNS.RIPN.NET', ipv4: '194.85.252.62', ipv6: '2001:678:16:0:194:85:252:62' },
      { name: 'D.DNS.RIPN.NET', ipv4: '194.190.124.17', ipv6: '2001:678:18:0:194:190:124:17' },
      { name: 'E.DNS.RIPN.NET', ipv4: '193.232.142.17', ipv6: '2001:678:15:0:193:232:142:17' },
      { name: 'F.DNS.RIPN.NET', ipv4: '193.232.156.17', ipv6: '2001:678:14:0:193:232:156:17' },
    ],
  },
  'com': {
    tld: 'com',
    nameservers: [
      { name: 'A.GTLD-SERVERS.NET', ipv4: '192.5.6.30', ipv6: '2001:503:a83e::2:30' },
      { name: 'B.GTLD-SERVERS.NET', ipv4: '192.33.14.30', ipv6: '2001:503:231d::2:30' },
      { name: 'C.GTLD-SERVERS.NET', ipv4: '192.26.92.30', ipv6: '2001:503:457e::2:30' },
      { name: 'D.GTLD-SERVERS.NET', ipv4: '192.31.80.30', ipv6: '2001:500:856e::2:30' },
      { name: 'E.GTLD-SERVERS.NET', ipv4: '192.12.94.30', ipv6: '2001:503:1779::2:30' },
    ],
  },
  'net': {
    tld: 'net',
    nameservers: [
      { name: 'A.GTLD-SERVERS.NET', ipv4: '192.5.6.30', ipv6: '2001:503:a83e::2:30' },
      { name: 'B.GTLD-SERVERS.NET', ipv4: '192.33.14.30', ipv6: '2001:503:231d::2:30' },
      { name: 'C.GTLD-SERVERS.NET', ipv4: '192.26.92.30', ipv6: '2001:503:457e::2:30' },
      { name: 'D.GTLD-SERVERS.NET', ipv4: '192.31.80.30', ipv6: '2001:500:856e::2:30' },
      { name: 'E.GTLD-SERVERS.NET', ipv4: '192.12.94.30', ipv6: '2001:503:1779::2:30' },
    ],
  },
  'org': {
    tld: 'org',
    nameservers: [
      { name: 'A0.ORG.AFILIAS-NST.INFO', ipv4: '199.19.54.1' },
      { name: 'A2.ORG.AFILIAS-NST.INFO', ipv4: '199.19.56.1' },
      { name: 'B0.ORG.AFILIAS-NST.ORG', ipv4: '199.19.57.1' },
      { name: 'B2.ORG.AFILIAS-NST.ORG', ipv4: '199.19.59.1' },
      { name: 'C0.ORG.AFILIAS-NST.INFO', ipv4: '199.19.58.1' },
    ],
  },
  'io': {
    tld: 'io',
    nameservers: [
      { name: 'A0.NIC.IO', ipv4: '199.249.112.1', ipv6: '2001:500:13::1' },
      { name: 'A2.NIC.IO', ipv4: '199.249.114.1', ipv6: '2001:500:13::2' },
      { name: 'B0.NIC.IO', ipv4: '199.249.116.1', ipv6: '2001:500:13::3' },
      { name: 'C0.NIC.IO', ipv4: '199.249.118.1', ipv6: '2001:500:13::4' },
      { name: 'D0.NIC.IO', ipv4: '199.249.120.1', ipv6: '2001:500:13::5' },
    ],
  },
  'dev': {
    tld: 'dev',
    nameservers: [
      { name: 'NS1.GOOGLE.COM', ipv4: '216.239.32.10' },
      { name: 'NS2.GOOGLE.COM', ipv4: '216.239.34.10' },
      { name: 'NS3.GOOGLE.COM', ipv4: '216.239.36.10' },
      { name: 'NS4.GOOGLE.COM', ipv4: '216.239.38.10' },
    ],
  },
  'ua': {
    tld: 'ua',
    nameservers: [
      { name: 'HOSTMASTER.UA', ipv4: '193.19.208.2' },
      { name: 'NS.UANIC.NET', ipv4: '193.19.208.4' },
      { name: 'NS2.UANIC.NET', ipv4: '193.19.208.5' },
    ],
  },
  'by': {
    tld: 'by',
    nameservers: [
      { name: 'NS1.OPEN.BY', ipv4: '178.124.160.10' },
      { name: 'NS2.OPEN.BY', ipv4: '178.124.160.11' },
      { name: 'NS.BYFLIX.BY', ipv4: '82.209.200.10' },
    ],
  },
  'kz': {
    tld: 'kz',
    nameservers: [
      { name: 'A.NIC.KZ', ipv4: '194.0.9.1' },
      { name: 'B.NIC.KZ', ipv4: '194.0.9.2' },
      { name: 'C.NIC.KZ', ipv4: '194.0.9.3' },
    ],
  },
};

/**
 * Извлечение TLD из доменного имени
 */
export function getTldFromDomain(domain: string): string {
  const parts = domain.toLowerCase().split('.');
  if (parts.length >= 2) {
    const tld = parts[parts.length - 1];
    // Для .рф доменов возвращаем xn--p1ai
    if (tld === 'рф') return 'xn--p1ai';
    return tld;
  }
  return '';
}

/**
 * Получение авторитативных серверов для доменной зоны
 */
export function getTldNameservers(domain: string): TldNameservers | null {
  const tld = getTldFromDomain(domain);
  return TLD_AUTHORITATIVE_SERVERS[tld] || null;
}

/**
 * Получение топ-3 авторитативных серверов зоны
 */
export function getTop3TldNameservers(domain: string): Array<{ name: string; ipv4?: string; ipv6?: string }> {
  const tldData = getTldNameservers(domain);
  if (tldData && tldData.nameservers.length > 0) {
    return tldData.nameservers.slice(0, 3);
  }
  return [];
}
