import { Link } from 'react-router-dom';
import {
  Header,
  DomainInput,
  RecordTypeSelector,
  NameserverSelector,
  SubmitButton,
  ResultsPanel,
  QueryOptionsDropdown,
} from './components/dns';
import { Card } from './components/ui';
import { useDnsQuery } from './hooks';
import { useDnsStore } from './store';

function App() {
  const { executeQuery } = useDnsQuery();
  const { status } = useDnsStore();

  const handleSubmit = () => {
    executeQuery();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Герой-секция */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            DNS Диагностика
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Профессиональный инструмент для проверки DNS-записей доменов.
            Поддержка всех типов записей и популярных DNS-резолверов.
          </p>
        </div>

        {/* Основная форма */}
        <Card className="mb-6">
          <div className="space-y-6">
            {/* Домен и тип записи */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <DomainInput />
              </div>
              <div>
                <RecordTypeSelector />
              </div>
            </div>

            {/* Nameservers */}
            <NameserverSelector />

            {/* Кнопки действия */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <SubmitButton onSubmit={handleSubmit} />
              <QueryOptionsDropdown />
            </div>
          </div>
        </Card>

        {/* Результаты */}
        <ResultsPanel hasSearched={status !== 'idle'} />
      </main>

      {/* Футер */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 DNS Dig. Инструмент для диагностики DNS-записей
            </p>
            <div className="flex items-center gap-6">
              <Link to="/docs" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Документация
              </Link>
              <a
                href="mailto:izelenov7@gmail.com"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Связаться с автором проекта
              </a>
              <a
                href="https://github.com/izelenov7/dig-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
