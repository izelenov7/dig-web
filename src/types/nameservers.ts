/**
 * Предустановленные DNS-резолверы
 */
export interface NameserverPreset {
  id: string;
  name: string;
  description: string;
  servers: string[];
  country?: string;
  dohProvider?: 'cloudflare' | 'google' | 'quad9' | 'adguard';
}

export const NAMESERVER_PRESETS: NameserverPreset[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description: 'Быстрый и приватный DNS',
    servers: ['1.1.1.1', '1.0.0.1'],
    country: 'US',
    dohProvider: 'cloudflare',
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Публичный DNS от Google',
    servers: ['8.8.8.8', '8.8.4.4'],
    country: 'US',
    dohProvider: 'google',
  },
  {
    id: 'quad9',
    name: 'Quad9',
    description: 'Безопасный DNS с блокировкой угроз',
    servers: ['9.9.9.9', '149.112.112.112'],
    country: 'CH',
    dohProvider: 'quad9',
  },
  {
    id: 'adguard',
    name: 'AdGuard',
    description: 'DNS с блокировкой рекламы',
    servers: ['94.140.14.14', '94.140.15.15'],
    country: 'CY',
    dohProvider: 'adguard',
  },
  {
    id: 'opendns',
    name: 'OpenDNS',
    description: 'Надёжный DNS от Cisco',
    servers: ['208.67.222.222', '208.67.220.220'],
    country: 'US',
  },
  {
    id: 'yandex',
    name: 'Яндекс.DNS',
    description: 'Быстрый DNS от Яндекса',
    servers: ['77.88.8.8', '77.88.8.1'],
    country: 'RU',
  },
  {
    id: 'nextdns',
    name: 'NextDNS',
    description: 'Настраиваемый облачный DNS',
    servers: ['45.90.28.0', '45.90.30.0'],
    country: 'US',
  },
  {
    id: 'mullvad',
    name: 'Mullvad',
    description: 'Приватный DNS без логов',
    servers: ['194.242.2.2', '194.242.2.3'],
    country: 'SE',
  },
];

/**
 * Режим выбора резолверов
 */
export type NameserverMode = 'default' | 'preset' | 'all' | 'authoritative' | 'custom';

/**
 * Конфигурация выбора неймсерверов
 */
export interface NameserverConfig {
  mode: NameserverMode;
  presetId?: string;
  customServers: string[];
}
