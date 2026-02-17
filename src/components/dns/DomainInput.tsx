import React, { useCallback } from 'react';
import { Input } from '../ui';
import { useDnsStore } from '../../store';

interface DomainInputProps {
  placeholder?: string;
}

export const DomainInput: React.FC<DomainInputProps> = ({
  placeholder = 'example.com',
}) => {
  const { domain, setDomain } = useDnsStore();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target.value);
    },
    [setDomain]
  );

  // Извлечение домена из URL или email (функция "Fix")
  const handleExtractDomain = useCallback(() => {
    const value = domain.trim();
    
    // Попытка извлечь домен из URL
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?([^/]+)(?:\/.*)?$/i;
    const urlMatch = value.match(urlPattern);
    
    if (urlMatch) {
      setDomain(urlMatch[1]);
      return;
    }
    
    // Попытка извлечь домен из email
    const emailPattern = /^[^@]+@(.+)$/;
    const emailMatch = value.match(emailPattern);
    
    if (emailMatch) {
      setDomain(emailMatch[1]);
      return;
    }
  }, [domain, setDomain]);

  const hasExtractableContent = domain.includes('://') || domain.includes('@') || domain.includes('/');

  return (
    <div className="w-full">
      <label htmlFor="domain-input" className="block text-sm font-medium text-slate-700 mb-1.5">
        Домен или IP-адрес
      </label>
      <div className="relative">
        <Input
          id="domain-input"
          type="text"
          value={domain}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="pr-20 font-mono text-sm"
          onKeyDown={(e) => {
            // Ctrl+Enter для быстрого запуска
            if (e.ctrlKey && e.key === 'Enter') {
              e.preventDefault();
              // Здесь будет триггер запуска запроса
            }
          }}
          rightAddon={
            hasExtractableContent && (
              <button
                type="button"
                onClick={handleExtractDomain}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                title="Извлечь домен из URL/email"
              >
                Fix
              </button>
            )
          }
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Введите доменное имя (например, google.com) или IP-адрес
      </p>
    </div>
  );
};
