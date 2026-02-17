import { useCallback } from 'react';
import { useDnsStore } from '../store';
import type { DnsRecordType } from '../types';
import { NAMESERVER_PRESETS } from '../types/nameservers';
import {
  queryDns,
  formatDohResponse,
  formatRecordsBindStyle,
  formatDigFullOutput,
  traceDnsQuery,
  whoisQuery,
  nonRecursiveQuery,
  DNS_STATUS,
  type DohResponse,
  getAuthoritativeNameservers,
} from '../lib/dnsService';
import { isValidDomain, normalizeInput, getTop3TldNameservers, toPunycode } from '../lib';

export interface DnsQueryParams {
  domain: string;
  type: DnsRecordType;
}

/**
 * Хук для выполнения DNS-запросов
 */
export function useDnsQuery() {
  const { 
    domain, 
    recordType,
    nameserverConfig,
    options,
    setLoading, 
    setSuccess, 
    setError,
    setDomain,
  } = useDnsStore();

  /**
   * Выполнение DNS-запроса
   */
  const executeQuery = useCallback(async (overrideDomain?: string, overrideType?: DnsRecordType) => {
    const queryDomain = normalizeInput(overrideDomain || domain);
    const queryType = overrideType || recordType;

    // Валидация домена
    if (!queryDomain.trim()) {
      setError('Введите доменное имя или IP-адрес');
      return;
    }

    // Нормализация
    const normalizedDomain = normalizeInput(queryDomain);
    
    // Конвертация IDN доменов в Punycode для валидации и DNS запросов
    const punycodeDomain = toPunycode(normalizedDomain);
    
    // Валидация после конвертации в punycode
    if (!isValidDomain(punycodeDomain)) {
      setError(`Некорректный домен или IP-адрес: "${queryDomain}"`);
      return;
    }

    // Обновляем домен в сторе после нормализации
    if (normalizedDomain !== queryDomain) {
      setDomain(normalizedDomain);
    }

    setLoading();

    try {
      const startTime = performance.now();

      let response: DohResponse;
      let authoritativeNameservers: string[] = [];
      let tldNameservers: Array<{ name: string; ipv4?: string; ipv6?: string }> = [];
      let selectedProvider: string = 'Cloudflare (1.1.1.1)';

      // Получаем авторитативные серверы зоны (TLD) - используем punycode для IDN
      tldNameservers = getTop3TldNameservers(punycodeDomain);

      // Получаем текущие NS серверы домена (всегда) - используем punycode
      authoritativeNameservers = await getAuthoritativeNameservers(punycodeDomain);

      // Определение провайдера на основе выбранного пресета
      let dohProvider: 'cloudflare' | 'google' | 'quad9' | 'adguard' = 'cloudflare';
      if (nameserverConfig.mode === 'preset' && nameserverConfig.presetId) {
        const preset = NAMESERVER_PRESETS.find(p => p.id === nameserverConfig.presetId);
        if (preset?.dohProvider) {
          dohProvider = preset.dohProvider;
          selectedProvider = preset.name + ' (' + preset.servers[0] + ')';
        } else if (preset) {
          // Для пресетов без DoH (Яндекс, OpenDNS и др.) используем Cloudflare по умолчанию
          selectedProvider = preset.name + ' (' + preset.servers[0] + ')';
        }
      }

      // Подготовка опций запроса
      const queryOptions = {
        trace: options.trace,
        noRecursive: options.noRecursive,
      };

      // Режим Authoritative
      if (nameserverConfig.mode === 'authoritative') {
        selectedProvider = `Authoritative (${authoritativeNameservers.join(', ')})`;
      }

      // Выполнение запроса к выбранному провайдеру - используем punycode
      let traceOutput = '';
      let whoisOutput = '';
      let nonRecursiveOutput = '';
      
      // Выполняем все выбранные опции
      if (options.trace) {
        // Режим трассировки
        traceOutput = await traceDnsQuery(punycodeDomain, queryType);
      }
      
      if (options.noRecursive) {
        // Нерекурсивный запрос
        nonRecursiveOutput = await nonRecursiveQuery(punycodeDomain, queryType);
      }
      
      if (options.whois) {
        // Whois-запрос - используем оригинальный домен для whois
        whoisOutput = await whoisQuery(normalizedDomain);
      }
      
      // Основной DNS запрос
      response = await queryDns(punycodeDomain, queryType, dohProvider, queryOptions);

      const endTime = performance.now();
      const queryTime = Math.round(endTime - startTime);

      // Проверка статуса ответа
      if (response.Status === 3) { // NXDOMAIN
        setError(`Домен "${normalizedDomain}" не найден (NXDOMAIN)`);
        return;
      }
      
      if (response.Status === 5) { // REFUSED
        setError(`Запрос отклонён сервером (REFUSED)`);
        return;
      }
      
      if (response.Status === 2) { // SERVFAIL
        setError(`Ошибка сервера (SERVFAIL)`);
        return;
      }

      // Формирование результата
      const result = {
        query: {
          domain: normalizedDomain,
          punycodeDomain,
          type: queryType,
          timestamp: new Date().toISOString(),
        },
        answers: response.Answer || [],
        authority: response.Authority || [],
        additional: response.Additional || [],
        stats: {
          queryTime,
          server: selectedProvider,
          when: new Date().toLocaleString('ru-RU'),
          status: DNS_STATUS[response.Status] || `UNKNOWN (${response.Status})`,
          flags: {
            rd: response.RD,
            ra: response.RA,
            ad: response.AD,
            cd: response.CD,
            tc: response.TC,
          },
          authoritativeNameservers,
          tldNameservers,
        },
        rawOutput: formatDohResponse(response, queryType),
        bindOutput: formatRecordsBindStyle(
          response.Answer || [],
          response.Authority || [],
          response.Additional || []
        ),
        digFullOutput: formatDigFullOutput(response, queryType, {
          server: selectedProvider,
          queryTime,
          status: DNS_STATUS[response.Status] || `UNKNOWN (${response.Status})`,
        }),
        traceOutput: traceOutput || undefined,
        whoisOutput: whoisOutput || undefined,
        nonRecursiveOutput: nonRecursiveOutput || undefined,
        fullResponse: response,
      };

      setSuccess(result);
    } catch (error) {
      console.error('DNS query error:', error);
      setError(
        error instanceof Error 
          ? `Ошибка запроса: ${error.message}` 
          : 'Неизвестная ошибка при выполнении запроса'
      );
    }
  }, [domain, recordType, nameserverConfig, options, setLoading, setSuccess, setError, setDomain]);

  /**
   * Очистка результатов
   */
  const clearQuery = useCallback(() => {
    // Очистка через store будет вызвана из компонента
  }, []);

  return {
    executeQuery,
    clearQuery,
  };
}
