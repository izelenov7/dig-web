/**
 * Предустановленные DNS-резолверы
 */
export interface NameserverPreset {
  id: string;
  name: string;
  description: string;
  servers: string[];
  country?: string;
  dohProvider?: 'cloudflare' | 'google';
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
