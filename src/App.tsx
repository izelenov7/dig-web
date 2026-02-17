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
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Документация
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                API
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
