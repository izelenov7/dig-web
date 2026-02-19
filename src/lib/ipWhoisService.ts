/**
 * Сервис для определения владельца IP-адреса (IP WHOIS)
 * Использует публичные API для получения информации об организации,
 * которой принадлежит IP-адрес
 */

/**
 * Результат WHOIS lookup для IP-адреса
 */
export interface IpWhoisResult {
  ip: string;
  organization: string;
  asn?: string;
  country?: string;
}

/**
 * RIPE WHOIS API для получения информации об IP в европейском регионе
 */
const RIPE_WHOIS_API = 'https://stat.ripe.net/data/';

/**
 * Альтернативный API для получения информации об IP (ipapi.co - бесплатный с HTTPS и CORS)
 */
const IPAPI_ENDPOINT = 'https://ipapi.co';

/**
 * Получение информации о владельце IP-адреса через RIPE API
 */
export async function getIpWhoisInfo(ip: string): Promise<IpWhoisResult | null> {
  try {
    console.log('[ipWhoisService] Fetching RIPE WHOIS for IP:', ip);
    // Получаем информацию из RIPE API - используем правильный формат URL
    const response = await fetch(`${RIPE_WHOIS_API}addr-lookup.json?resource=${ip}`);

    if (!response.ok) {
      console.warn(`[ipWhoisService] RIPE WHOIS API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('[ipWhoisService] RIPE addr-lookup response:', data);

    // Проверяем, есть ли данные в ответе
    if (!data.data || !data.data.resources || data.data.resources.length === 0) {
      console.log('[ipWhoisService] No resources found in RIPE response');
      return null;
    }

    // Ищем запись с типом "inetnum" или "inet6num" - там информация о владельце
    const inetnumData = data.data.resources.find((r: any) =>
      r.type === 'inetnum' || r.type === 'inet6num'
    );
    console.log('[ipWhoisService] inetnumData:', inetnumData);

    if (!inetnumData) {
      console.log('[ipWhoisService] No inetnum/inet6num data found');
      return null;
    }

    // Получаем детальную информацию по handle
    const handle = inetnumData.handle || inetnumData.key;
    if (!handle) {
      console.log('[ipWhoisService] No handle found for inetnum data');
      return null;
    }

    const detailResponse = await fetch(`${RIPE_WHOIS_API}object.json?identifier=${handle}`);
    if (!detailResponse.ok) {
      console.warn(`[ipWhoisService] RIPE object API error: ${detailResponse.status}`);
      return null;
    }

    const detailData = await detailResponse.json();
    console.log('[ipWhoisService] RIPE object detail:', detailData);

    const record = detailData.data?.record;
    if (!record) {
      console.log('[ipWhoisService] No record in RIPE object response');
      return null;
    }

    // Ищем поле descr - это реальный владелец
    let organization = 'Неизвестно';
    let netname = '';
    let objects: any[] = [];

    // Структура RIPE: record -> section -> objects
    const section = record.section;
    if (section) {
      const sectionData = Array.isArray(section) ? section[0] : section;
      objects = sectionData?.objects || [];
      console.log('[ipWhoisService] Objects from section:', objects);

      for (const obj of objects) {
        if (obj.name === 'descr' && obj.value) {
          const descrValue = Array.isArray(obj.value) ? obj.value[0] : obj.value;
          if (typeof descrValue === 'string') {
            organization = descrValue;
            break;
          }
        }
        if (obj.name === 'netname' && obj.value) {
          const netnameValue = Array.isArray(obj.value) ? obj.value[0] : obj.value;
          if (typeof netnameValue === 'string') {
            netname = netnameValue;
          }
        }
      }
    }

    // Если не нашли descr, используем netname
    if (organization === 'Неизвестно' && netname) {
      organization = netname;
    }

    // Получаем ASN
    let asn: string | undefined;
    const originObj = objects.find((o: any) => o.name === 'origin');
    if (originObj) {
      const originValue = Array.isArray(originObj.value) ? originObj.value[0] : originObj.value;
      if (typeof originValue === 'string') {
        asn = originValue.startsWith('AS') ? originValue : `AS${originValue}`;
      }
    }

    // Получаем страну
    let country: string | undefined;
    const countryObj = objects.find((o: any) => o.name === 'country');
    if (countryObj) {
      const countryValue = Array.isArray(countryObj.value) ? countryObj.value[0] : countryObj.value;
      if (typeof countryValue === 'string') {
        country = countryValue.toUpperCase();
      }
    }

    const result = {
      ip: ip,
      organization,
      asn,
      country,
    };
    console.log('[ipWhoisService] Final RIPE result:', result);
    return result;
  } catch (error) {
    console.error('[ipWhoisService] Failed to get IP WHOIS info from RIPE:', error);
    return null;
  }
}

/**
 * Получение информации о владельце IP через ipapi.co API (альтернативный метод)
 * Бесплатный API с поддержкой HTTPS и CORS
 */
async function getIpInfoFromIpApi(ip: string): Promise<IpWhoisResult | null> {
  try {
    console.log('[ipWhoisService] Fetching from ipapi.co for IP:', ip);
    const response = await fetch(`${IPAPI_ENDPOINT}/${ip}/json/`);

    if (!response.ok) {
      console.warn(`[ipWhoisService] ipapi.co API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('[ipWhoisService] ipapi.co response:', data);

    if (data && data.ip) {
      const result: IpWhoisResult = {
        ip: data.ip || ip,
        organization: data.org || data.company_name || data.isp || 'Неизвестно',
        asn: data.asn ? `AS${data.asn}` : undefined,
        country: data.country_code || undefined,
      };
      console.log('[ipWhoisService] ipapi.co result:', result);
      return result;
    }

    console.log('[ipWhoisService] No valid data from ipapi.co');
    return null;
  } catch (error) {
    console.error('[ipWhoisService] Failed to get IP info from ipapi.co:', error);
    return null;
  }
}

/**
 * Получение информации о владельце IP
 * Пробует сначала RIPE API, затем ipapi.com
 */
export async function getIpOwnerInfo(ip: string): Promise<IpWhoisResult | null> {
  console.log('[ipWhoisService] getIpOwnerInfo called for IP:', ip);
  
  // Сначала пробуем RIPE API
  const ripeResult = await getIpWhoisInfo(ip);
  if (ripeResult) {
    console.log('[ipWhoisService] Got result from RIPE:', ripeResult);
    return ripeResult;
  }

  // Если RIPE не вернул результат, пробуем ipapi.com
  console.log('[ipWhoisService] RIPE returned null, trying ipapi.com...');
  const ipApiResult = await getIpInfoFromIpApi(ip);
  if (ipApiResult) {
    console.log('[ipWhoisService] Got result from ipapi.com:', ipApiResult);
    return ipApiResult;
  }

  console.log('[ipWhoisService] All APIs returned null for IP:', ip);
  return null;
}

/**
 * Форматирование информации об организации для отображения
 */
export function formatOrganizationName(org: string): string {
  if (!org || org === 'Неизвестно') {
    return 'Неизвестно';
  }
  
  // Убираем лишние пробелы
  let formatted = org.trim();
  
  // Если название слишком длинное, сокращаем
  if (formatted.length > 100) {
    formatted = formatted.substring(0, 97) + '...';
  }
  
  return formatted;
}
