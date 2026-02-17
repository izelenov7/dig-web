import React from 'react';
import { Card, Badge } from '../ui';
import { useDnsStore } from '../../store';

interface ResultsPlaceholderProps {
  hasSearched?: boolean;
}

export const ResultsPlaceholder: React.FC<ResultsPlaceholderProps> = ({
  hasSearched = false,
}) => {
  const { status, result, error } = useDnsStore();

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
            Получение DNS-записей
          </p>
        </div>
      </Card>
    );
  }

  // Состояние ошибки
  if (status === 'error') {
    return (
      <Card className="py-12 border-red-200">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-xl flex items-center justify-center">
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
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-slate-500">
            Проверьте правильность доменного имени и повторите попытку
          </p>
        </div>
      </Card>
    );
  }

  // Состояние успеха (заглушка для будущего функционала)
  if (status === 'success' && result) {
    return (
      <Card title="Результаты запроса">
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <Badge variant="success">Успешно</Badge>
            <span className="text-sm text-slate-500 font-mono">
              {result.query.type} {result.query.domain}
            </span>
            <span className="text-sm text-slate-500">
              {result.stats.queryTime} ms
            </span>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
              {result.rawOutput}
            </pre>
          </div>
          
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">
              🚧 Полное отображение результатов в разработке
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return null;
};
