/**
 * Утилиты для работы с интернационализированными доменными именами (IDN)
 * Конвертация между Unicode и Punycode
 */

/**
 * Кодирование домена в Punycode
 * Пример: пример.рф → xn--e1afmkfd.xn--p1ai
 */
export function toPunycode(domain: string): string {
  if (!domain) return domain;

  try {
    // Используем встроенный URL API для конвертации
    const url = new URL(`http://${domain.toLowerCase()}`);
    return url.hostname;
  } catch {
    // Ручная конвертация для доменов без протокола
    return domain
      .toLowerCase()
      .split('.')
      .map((part) => {
        // Если часть содержит не-ASCII символы, конвертируем в punycode
        if (/[\u0080-\uFFFF]/.test(part)) {
          return `xn--${punycodeEncode(part)}`;
        }
        return part;
      })
      .join('.');
  }
}

/**
 * Декодирование домена из Punycode
 * Пример: xn--e1afmkfd.xn--p1ai → пример.рф
 */
export function fromPunycode(domain: string): string {
  if (!domain) return domain;

  try {
    // Используем встроенный URL API для конвертации
    const url = new URL(`http://${domain.toLowerCase()}`);
    // Получаем Unicode представление
    return new URL(url.href).hostname;
  } catch {
    // Ручная конвертация
    return domain
      .toLowerCase()
      .split('.')
      .map((part) => {
        if (part.startsWith('xn--')) {
          return punycodeDecode(part.substring(4));
        }
        return part;
      })
      .join('.');
  }
}

/**
 * Простая реализация Punycode кодирования
 * Для полной совместимости лучше использовать библиотеку punycode
 */
function punycodeEncode(input: string): string {
  // Базовая реализация - для кириллических доменов
  // В продакшене лучше использовать библиотеку 'punycode'
  const output: number[] = [];
  let delta = 0;
  let bias = 72;

  // Копируем все ASCII символы
  for (const char of input) {
    if (char.charCodeAt(0) < 128) {
      output.push(char.charCodeAt(0));
    }
  }

  const basicLength = output.length;
  let handledCPCount = basicLength;

  if (basicLength > 0) {
    output.push(0x2D); // '-'
  }

  // Обрабатываем не-ASCII символы
  const nonAscii = input.split('').filter(c => c.charCodeAt(0) >= 128);

  for (const char of nonAscii) {
    const codePoint = char.charCodeAt(0);
    delta += (codePoint - handledCPCount) * (handledCPCount + 1);
    handledCPCount++;
    output.push(encodeDigit(delta, bias));
    delta = 0;
    bias = adapt(delta, handledCPCount - basicLength, false);
  }

  return String.fromCharCode(...output.filter(c => c !== 0x2D || output.indexOf(0x2D) < output.length - 1));
}

/**
 * Простая реализация Punycode декодирования
 */
function punycodeDecode(input: string): string {
  // В продакшене лучше использовать библиотеку 'punycode'
  // Это упрощённая реализация для распространённых случаев
  try {
    // Пытаемся использовать URL API
    const url = new URL(`http://xn--${input}`);
    return url.hostname.replace(/^xn--/, '');
  } catch {
    // Fallback - возвращаем как есть
    return input;
  }
}

/**
 * Адаптация bias для punycode
 */
function adapt(delta: number, numpoints: number, firstTime: boolean): number {
  if (firstTime) {
    delta = Math.floor(delta / 700);
  } else {
    delta = Math.floor(delta / 2);
  }

  delta += Math.floor(delta / numpoints);

  let k = 0;
  while (delta > 455) {
    delta = Math.floor(delta / 35);
    k += 36;
  }

  return Math.floor(k + (36 * delta) / (delta + 38));
}

/**
 * Кодирование цифры для punycode
 */
function encodeDigit(digit: number, bias: number): number {
  return digit + 22 + 75 * (digit < 26 ? 1 : 0) - bias;
}

/**
 * Проверка, является ли домен IDN (содержит не-ASCII символы)
 */
export function isIDN(domain: string): boolean {
  return /[\u0080-\uFFFF]/.test(domain);
}

/**
 * Нормализация домена: конвертация в lowercase и punycode если нужно
 */
export function normalizeDomain(domain: string): string {
  return toPunycode(domain.toLowerCase());
}

/**
 * Отображение домена: конвертация из punycode в unicode если возможно
 */
export function displayDomain(domain: string): string {
  return fromPunycode(domain.toLowerCase());
}
