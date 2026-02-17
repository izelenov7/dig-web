/**
 * Валидация доменного имени
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) {
    return false;
  }

  // Проверка на IP-адрес (IPv4)
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(domain)) {
    return true;
  }

  // Проверка на IPv6 (упрощённая)
  if (domain.includes(':')) {
    return true; // Принимаем любой IPv6 для простоты
  }

  // Проверка доменного имени
  const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?$/;
  return domainPattern.test(domain);
}

/**
 * Валидация IP-адреса
 */
export function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(ip)) {
    return true;
  }

  // IPv6 (упрощённая проверка)
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:^((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  return ipv6Pattern.test(ip);
}

/**
 * Извлечение домена из URL
 */
export function extractDomainFromUrl(url: string): string | null {
  try {
    // Добавляем протокол если нет
    const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const parsed = new URL(normalizedUrl);
    return parsed.hostname;
  } catch {
    return null;
  }
}

/**
 * Извлечение домена из email
 */
export function extractDomainFromEmail(email: string): string | null {
  const parts = email.split('@');
  if (parts.length === 2 && parts[1].length > 0) {
    return parts[1];
  }
  return null;
}

/**
 * Нормализация ввода (URL, email, домен)
 */
export function normalizeInput(input: string): string {
  const trimmed = input.trim();
  
  // Попытка извлечь из URL
  if (trimmed.includes('://') || trimmed.includes('www.')) {
    const domain = extractDomainFromUrl(trimmed);
    if (domain) return domain;
  }
  
  // Попытка извлечь из email
  if (trimmed.includes('@')) {
    const domain = extractDomainFromEmail(trimmed);
    if (domain) return domain;
  }
  
  // Удаляем trailing dot если есть
  return trimmed.replace(/\.$/, '');
}

/**
 * Форматирование размера в человекочитаемый вид
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Форматирование времени в человекочитаемый вид
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(2)} s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  return `${minutes}m ${remainingSeconds}s`;
}
