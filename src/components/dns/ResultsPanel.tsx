import React, { useState, useCallback } from 'react';
import { Card, Badge, Button } from '../ui';
import { useDnsStore } from '../../store';
import { getDnsTypeName } from '../../lib/dnsService';

interface ResultsPanelProps {
  hasSearched?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  hasSearched = false,
}) => {
  const status = useDnsStore((state) => state.status);
  const result = useDnsStore((state) => state.result);
  const error = useDnsStore((state) => state.error);
  const clearResult = useDnsStore((state) => state.clearResult);
  const options = useDnsStore((state) => state.options);
  const stats = useDnsStore((state) => state.result?.stats);

  const [copied, setCopied] = useState(false);
  const [copyFormat, setCopyFormat] = useState<'bind' | 'dig' | 'trace' | 'whois' | 'noRecursive'>('bind');
  const [answersCopied, setAnswersCopied] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

  // Генерация dig команды
  const digCommand = React.useMemo(() => {
    if (!result || !stats) return '';
    const { query } = result;
    const args: string[] = [query.type, query.domain];

    // Извлекаем IP сервера из stats.server
    const serverMatch = stats.server.match(/\(([^)]+)\)/);
    const serverIp = serverMatch ? serverMatch[1] : '1.1.1.1';
    
    args.push(`@${serverIp}`);

    if (options.noRecursive) args.push('+norecurse');

    return `dig ${args.join(' ')}`;
  }, [result, options, stats]);

  // Копирование dig команды
  const handleCopyCommand = useCallback(() => {
    if (digCommand) {
      navigator.clipboard.writeText(digCommand);
      setCommandCopied(true);
      setTimeout(() => setCommandCopied(false), 2000);
    }
  }, [digCommand]);

  // Копирование результата (BIND/Dig/Trace/Whois/NoRecursive)
  const handleCopy = useCallback(async () => {
    let textToCopy = '';
    if (copyFormat === 'bind') {
      textToCopy = result?.bindOutput || '';
    } else if (copyFormat === 'trace' && result?.traceOutput) {
      textToCopy = result.traceOutput;
    } else if (copyFormat === 'whois' && result?.whoisOutput) {
      textToCopy = result.whoisOutput;
    } else if (copyFormat === 'noRecursive' && result?.nonRecursiveOutput) {
      textToCopy = result.nonRecursiveOutput;
    } else {
      textToCopy = result?.digFullOutput || '';
    }

    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [result, copyFormat]);

  // Копирование всех ответов
  const handleCopyAllAnswers = useCallback(() => {
    if (result?.answers) {
      const allAnswers = result.answers.map(a =>
        `${a.name}.\t\t${a.TTL}\tIN\t${getDnsTypeName(a.type)}\t${a.data || a.rdata}`
      ).join('\n');
      navigator.clipboard.writeText(allAnswers);
      setAnswersCopied(true);
      setTimeout(() => setAnswersCopied(false), 2000);
    }
  }, [result]);

  // Сохранение в файл
  const handleSaveToFile = useCallback(() => {
    if (result?.answers) {
      const allAnswers = result.answers.map(a =>
        `${a.name}.\t\t${a.TTL}\tIN\t${getDnsTypeName(a.type)}\t${a.data || a.rdata}`
      ).join('\n');
      
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const filename = `${result.query.domain}_${day}-${month}-${year}.txt`;
      
      const blob = new Blob([allAnswers], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [result]);

  if (!hasSearched) {
    return (
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Готов к диагностике
          </h3>
          <p className="text-slate-500 mb-6">
            Введите доменное имя и выберите тип DNS-записи для начала диагностики
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="info">A</Badge>
            <Badge variant="info">AAAA</Badge>
            <Badge variant="info">MX</Badge>
            <Badge variant="info">NS</Badge>
            <Badge variant="info">TXT</Badge>
            <Badge variant="info">CNAME</Badge>
          </div>
        </div>
      </Card>
    );
  }

  // Состояние загрузки
  if (status === 'loading') {
    return (
      <Card className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-400 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Загрузка результатов...
          </h3>
          <p className="text-slate-500">
            Выполнение DNS-запроса через Cloudflare DoH
          </p>
        </div>
      </Card>
    );
  }

  // Состояние ошибки
  if (status === 'error') {
    return (
      <Card className="py-12 border-red-200 bg-red-50">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Ошибка запроса
          </h3>
          <p className="text-red-700 mb-4 font-medium">{error}</p>
          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearResult}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Состояние успеха
  if (status === 'success' && result) {
    const { stats, answers, authority, additional, bindOutput, digFullOutput, traceOutput, whoisOutput, nonRecursiveOutput } = result;

    return (
      <div className="space-y-4">
        {/* Dig команда */}
        {options.showCommand && digCommand && (
          <Card
            title="Dig команда"
            rightElement={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCommand}
                leftIcon={
                  commandCopied ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )
                }
              >
                {commandCopied ? 'Скопировано!' : 'Копировать'}
              </Button>
            }
          >
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-green-400">{digCommand}</code>
            </div>
          </Card>
        )}

        {/* Секция ответов */}
        {answers && answers.length > 0 && (
          <Card
            title={`Ответы (${answers.length})`}
            rightElement={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveToFile}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Сохранить в файл
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAllAnswers}
                  leftIcon={
                    answersCopied ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )
                  }
                >
                  {answersCopied ? 'Скопировано!' : 'Копировать все'}
                </Button>
              </div>
            }
          >
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="font-mono text-sm text-slate-700 space-y-1">
                {answers.map((answer, index) => (
                  <div key={index}>
                    <span className="text-slate-700">{answer.name}.</span>
                    <span className="text-slate-400 mx-2">{answer.TTL}</span>
                    <span className="text-primary-600 font-semibold">IN {getDnsTypeName(answer.type)}</span>
                    <span className="text-slate-900 ml-2">{answer.data || answer.rdata}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Секция авторитетности */}
        {authority && authority.length > 0 && (
          <Card title={`Авторитетность (${authority.length})`}>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="font-mono text-sm text-slate-700 space-y-1">
                {authority.map((auth, index) => (
                  <div key={index}>
                    <span className="text-slate-700">{auth.name}.</span>
                    <span className="text-slate-400 mx-2">{auth.TTL}</span>
                    <span className="text-amber-600 font-semibold">IN {getDnsTypeName(auth.type)}</span>
                    <span className="text-slate-900 ml-2">{auth.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Дополнительная секция */}
        {additional && additional.length > 0 && (
          <Card title={`Дополнительно (${additional.length})`}>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-mono text-sm text-slate-700 space-y-1">
                {additional.map((add, index) => (
                  <div key={index}>
                    <span className="text-slate-700">{add.name}.</span>
                    <span className="text-slate-400 mx-2">{add.TTL}</span>
                    <span className="text-blue-600 font-semibold">IN {getDnsTypeName(add.type)}</span>
                    <span className="text-slate-900 ml-2">{add.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Нет записей */}
        {(!answers || answers.length === 0) && (!authority || authority.length === 0) && (!additional || additional.length === 0) && (
          <Card className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Записей не найдено
              </h3>
              <p className="text-slate-500">
                Для данного типа запроса нет доступных записей
              </p>
            </div>
          </Card>
        )}

        {/* Вывод данных с кнопкой копирования */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 mr-2">Формат:</span>
              <button
                onClick={() => setCopyFormat('bind')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  copyFormat === 'bind'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="BIND-стиль: домен TTL IN TYPE данные"
              >
                BIND
              </button>
              <button
                onClick={() => setCopyFormat('dig')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  copyFormat === 'dig'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="dig-стиль: с заголовками и секциями"
              >
                Dig
              </button>
              {traceOutput && (
                <button
                  onClick={() => setCopyFormat('trace')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    copyFormat === 'trace'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Трассировка: путь от корневых серверов"
                >
                  Trace
                </button>
              )}
              {whoisOutput && (
                <button
                  onClick={() => setCopyFormat('whois')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    copyFormat === 'whois'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Whois: информация о домене"
                >
                  Whois
                </button>
              )}
              {nonRecursiveOutput && (
                <button
                  onClick={() => setCopyFormat('noRecursive')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    copyFormat === 'noRecursive'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Нерекурсивный запрос: от корневых серверов"
                >
                  NoRec
                </button>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={
                copied ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              }
            >
              {copied ? 'Скопировано!' : `Копировать (${copyFormat === 'bind' ? 'BIND' : copyFormat === 'trace' ? 'Trace' : copyFormat === 'whois' ? 'Whois' : copyFormat === 'noRecursive' ? 'NoRec' : 'Dig'})`}
            </Button>
          </div>
          
          {/* BIND формат - чистые записи без заголовков */}
          {copyFormat === 'bind' && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-xs text-slate-400 font-mono">BIND-стиль (только записи)</span>
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                {bindOutput || 'Нет записей'}
              </pre>
            </div>
          )}
          
          {/* Dig формат - с заголовками, сервером и полным выводом */}
          {copyFormat === 'dig' && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Dig-стиль (с заголовками)</span>
                <span className="text-xs text-slate-500">Server: {stats.server}</span>
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                {digFullOutput || 'Нет записей'}
              </pre>
            </div>
          )}

          {/* Trace формат - трассировка */}
          {copyFormat === 'trace' && traceOutput && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Trace-стиль (трассировка)</span>
                <span className="text-xs text-slate-500">Путь от корневых серверов</span>
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                {traceOutput}
              </pre>
            </div>
          )}

          {/* Whois формат - информация о домене */}
          {copyFormat === 'whois' && whoisOutput && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Whois-стиль (информация о домене)</span>
                <span className="text-xs text-slate-500">Регистрационные данные</span>
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                {whoisOutput}
              </pre>
            </div>
          )}

          {/* NoRec формат - нерекурсивный запрос */}
          {copyFormat === 'noRecursive' && nonRecursiveOutput && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">NoRec-стиль (нерекурсивный запрос)</span>
                <span className="text-xs text-slate-500">Пошаговый путь от корневых серверов</span>
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                {nonRecursiveOutput}
              </pre>
            </div>
          )}
        </Card>

        {/* Блок DNS серверов - отображается всегда */}
        <>
          {/* Авторитетные серверы зоны (TLD) */}
          {stats.tldNameservers && stats.tldNameservers.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-slate-700">Авторитативные серверы зоны:</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="font-mono text-sm text-slate-700 space-y-3">
                  {stats.tldNameservers.map((ns, idx) => (
                    <div key={idx} className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-semibold text-slate-700">{ns.name}</span>
                      {ns.ipv4 && (
                        <span className="font-mono text-slate-500">{ns.ipv4}</span>
                      )}
                      {ns.ipv6 && (
                        <span className="font-mono text-slate-400 text-xs">{ns.ipv6}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Источник: IANA Root Servers
              </p>
            </Card>
          )}

          {/* Текущие NS серверы домена (из ответа) */}
          {stats.authoritativeNameservers && stats.authoritativeNameservers.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <span className="text-sm font-semibold text-slate-700">Текущие DNS серверы домена:</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="font-mono text-sm text-slate-700 space-y-1">
                  {stats.authoritativeNameservers.map((ns, idx) => (
                    <div key={idx}>{ns}</div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      </div>
    );
  }

  return null;
};
