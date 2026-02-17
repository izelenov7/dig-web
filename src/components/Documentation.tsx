import React from 'react';
import { Link } from 'react-router-dom';

export const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">DNS Dig</h1>
                  <p className="text-xs text-slate-500">Документация</p>
                </div>
              </Link>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вернуться в сервис
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Документация DNS Dig
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Полное руководство по использованию сервиса диагностики DNS-записей
          </p>
        </div>

        {/* Содержание */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Содержание</h3>
          <ul className="space-y-2">
            <li><a href="#basic-query" className="text-primary-600 hover:text-primary-700 hover:underline">Базовый DNS-запрос</a></li>
            <li><a href="#record-types" className="text-primary-600 hover:text-primary-700 hover:underline">Типы DNS-записей</a></li>
            <li><a href="#nameservers" className="text-primary-600 hover:text-primary-700 hover:underline">Выбор DNS-резолвера</a></li>
            <li><a href="#query-options" className="text-primary-600 hover:text-primary-700 hover:underline">Опции запроса</a></li>
            <li><a href="#trace" className="text-primary-600 hover:text-primary-700 hover:underline">Трассировка (Trace)</a></li>
            <li><a href="#whois" className="text-primary-600 hover:text-primary-700 hover:underline">Whois-запрос</a></li>
            <li><a href="#no-recursive" className="text-primary-600 hover:text-primary-700 hover:underline">Нерекурсивный запрос</a></li>
            <li><a href="#output-formats" className="text-primary-600 hover:text-primary-700 hover:underline">Форматы вывода</a></li>
            <li><a href="#idn" className="text-primary-600 hover:text-primary-700 hover:underline">Поддержка IDN (.рф)</a></li>
          </ul>
        </div>

        {/* Базовый DNS-запрос */}
        <section id="basic-query" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Базовый DNS-запрос</h3>
          <p className="text-slate-600 mb-6">
            Для выполнения базового DNS-запроса введите доменное имя и выберите тип записи.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Пример:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Введите домен: <code className="bg-slate-200 px-2 py-1 rounded">google.com</code></li>
              <li>Выберите тип записи: <code className="bg-slate-200 px-2 py-1 rounded">A</code></li>
              <li>Нажмите <strong>«Выполнить Dig»</strong></li>
            </ol>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-green-400 font-mono text-sm">
              google.com.		300	IN	A	142.250.50.46
            </p>
          </div>
        </section>

        {/* Типы DNS-записей */}
        <section id="record-types" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Типы DNS-записей</h3>
          <p className="text-slate-600 mb-6">
            Сервис поддерживает 7 основных типов DNS-записей.
          </p>

          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Основные</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li><strong>A</strong> — IPv4 адрес хоста</li>
              <li><strong>AAAA</strong> — IPv6 адрес хоста</li>
              <li><strong>CNAME</strong> — Каноническое имя (псевдоним)</li>
              <li><strong>MX</strong> — Почтовый обменник для приёма email</li>
              <li><strong>NS</strong> — Авторитативные DNS-серверы домена</li>
              <li><strong>TXT</strong> — Текстовая запись для SPF, DKIM, DMARC</li>
              <li><strong>CAA</strong> — Разрешённые центры выдачи сертификатов</li>
            </ul>
          </div>
        </section>

        {/* Выбор DNS-резолвера */}
        <section id="nameservers" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Выбор DNS-резолвера</h3>
          <p className="text-slate-600 mb-6">
            Выберите DNS-сервер для выполнения запроса.
          </p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-700">Режим</th>
                <th className="text-left py-2 text-slate-700">Описание</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Default</td>
                <td className="py-3">Резолвер по умолчанию</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Cloudflare</td>
                <td className="py-3">1.1.1.1 — быстрый и приватный</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Google</td>
                <td className="py-3">8.8.8.8 — публичный DNS</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Quad9</td>
                <td className="py-3">9.9.9.9 — с блокировкой угроз</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">AdGuard</td>
                <td className="py-3">94.140.14.14 — с блокировкой рекламы</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">OpenDNS</td>
                <td className="py-3">208.67.222.222 — надёжный DNS от Cisco</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Яндекс.DNS</td>
                <td className="py-3">77.88.8.8 — быстрый DNS от Яндекса</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">NextDNS</td>
                <td className="py-3">45.90.28.0 — настраиваемый облачный DNS</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Mullvad</td>
                <td className="py-3">194.242.2.2 — приватный DNS без логов</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-mono">Authoritative</td>
                <td className="py-3">Авторитативные серверы домена</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Опции запроса */}
        <section id="query-options" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Опции запроса</h3>
          <p className="text-slate-600 mb-6">
            Дополнительные опции для выполнения запроса расположены справа от кнопки «Выполнить DNS Check».
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">☑ Команда</h4>
              <p className="text-sm text-slate-600">
                Показывает dig команду, которая выполняется для текущего запроса. 
                Команда отображается в отдельном блоке над результатами.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">☑ Трассировка</h4>
              <p className="text-sm text-slate-600">
                Показывает полный путь DNS-запроса от корневых серверов до авторитативных серверов домена.
                Результат отображается в формате Trace с пошаговым описанием каждого этапа.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">☑ Whois</h4>
              <p className="text-sm text-slate-600">
                Выполняет Whois-запрос для получения регистрационной информации о домене.
                Показывает данные о регистраторе, датах создания и окончания регистрации, статусы домена.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">☑ Без рекурсии</h4>
              <p className="text-sm text-slate-600">
                Выполняет нерекурсивный запрос, показывая пошаговый путь делегирования.
                В отличие от трассировки, каждый шаг выполняется отдельно без кэширования.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              <strong>Примечание:</strong> Можно включить несколько опций одновременно. 
              Результаты каждой опции будут отображены в отдельных вкладках форматов вывода.
            </p>
          </div>
        </section>

        {/* Трассировка */}
        <section id="trace" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Трассировка (Trace)</h3>
          <p className="text-slate-600 mb-6">
            Показывает полный путь DNS-запроса от корневых серверов до авторитативных серверов домена.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Как работает:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Запрос к корневым серверам (.)</li>
              <li>Запрос к TLD серверам (.com, .ru)</li>
              <li>Запрос к авторитативным серверам домена</li>
              <li>Финальный ответ</li>
            </ol>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`;; Step 1: Root Servers
;; Querying root servers for TLD nameservers...

;; Step 2: TLD Servers for .com
;; Querying .com TLD nameservers...

;; Step 3: Authoritative Nameservers
;; Querying authoritative nameservers for google.com...

;; ANSWER SECTION:
google.com.		300	IN	A	142.250.50.46`}
            </p>
          </div>
        </section>

        {/* Whois-запрос */}
        <section id="whois" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Whois-запрос</h3>
          <p className="text-slate-600 mb-6">
            Получение регистрационной информации о домене.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Возвращаемые данные:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Доменное имя</li>
              <li>Регистратор</li>
              <li>Дата создания</li>
              <li>Дата окончания регистрации</li>
              <li>Статусы домена</li>
              <li>DNS-серверы</li>
              <li>Контактная информация (если доступна)</li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`Domain Name: GOOGLE.COM
Registrar: MarkMonitor Inc.
Creation Date: 1997-09-15
Registry Expiry Date: 2028-09-14
Status: clientDeleteProhibited
Name Servers:
  NS1.GOOGLE.COM
  NS2.GOOGLE.COM`}
            </p>
          </div>
        </section>

        {/* Нерекурсивный запрос */}
        <section id="no-recursive" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Нерекурсивный запрос</h3>
          <p className="text-slate-600 mb-6">
            Выполняет запрос без рекурсии, показывая пошаговый путь делегирования.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Отличие от трассировки:</h4>
            <p className="text-slate-700">
              Трассировка показывает путь с рекурсией, а нерекурсивный запрос выполняет 
              каждый шаг отдельно без кэширования.
            </p>
          </div>
        </section>

        {/* Форматы вывода */}
        <section id="output-formats" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Форматы вывода</h3>
          <p className="text-slate-600 mb-6">
            Сервис поддерживает 5 форматов вывода результатов.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">BIND</h4>
              <p className="text-slate-600 text-sm mb-2">Чистые записи без заголовков в формате: домен TTL IN TYPE данные</p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm">
                  google.com.		300	IN	A	142.250.50.46
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Dig</h4>
              <p className="text-slate-600 text-sm mb-2">Полный вывод с заголовками и секциями (QUESTION, ANSWER, AUTHORITY, ADDITIONAL)</p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`;; <<>> DiG 9.18.0 <<>> A google.com
;; QUESTION SECTION:
;google.com.			IN	A

;; ANSWER SECTION:
google.com.		300	IN	A	142.250.50.46`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Trace</h4>
              <p className="text-slate-600 text-sm mb-2">Трассировка пути от корневых серверов до авторитативных (4 шага)</p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`;; Step 1: Root Servers
.	518400	IN	NS	a.root-servers.net.

;; Step 2: TLD Servers for .com
com.	172800	IN	NS	a.gtld-servers.net.

;; Step 3: Authoritative Nameservers
google.com.	172800	IN	NS	ns1.google.com.

;; Step 4: Final Query
google.com.	300	IN	A	142.250.50.46`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Whois</h4>
              <p className="text-slate-600 text-sm mb-2">Регистрационная информация о домене (владелец, даты, статусы)</p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`Domain Name: GOOGLE.COM
Registrar: MarkMonitor Inc.
Creation Date: 1997-09-15
Registry Expiry Date: 2028-09-14
Status: clientDeleteProhibited
Name Servers:
  NS1.GOOGLE.COM
  NS2.GOOGLE.COM`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">NoRec</h4>
              <p className="text-slate-600 text-sm mb-2">Нерекурсивный запрос с пошаговым отображением делегирования</p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm whitespace-pre-line">
{`;; Step 1: Root Servers
;; Step 2: TLD Servers for .com
;; Step 3: Authoritative Nameservers
;; Step 4: Final Query
google.com.	300	IN	A	142.250.50.46`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Копирование и экспорт</h4>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• <strong>Копировать все</strong> — копирует все записи из секции Ответы</li>
                <li>• <strong>Копировать (BIND/Dig/Trace/Whois/NoRec)</strong> — копирует выбранный формат</li>
                <li>• <strong>Сохранить в файл</strong> — скачивает файл в формате BIND</li>
              </ul>
            </div>
          </div>
        </section>

        {/* IDN поддержка */}
        <section id="idn" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Поддержка IDN (.рф)</h3>
          <p className="text-slate-600 mb-6">
            Сервис автоматически работает с интернационализированными доменами.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Пример:</h4>
            <ul className="space-y-2 text-slate-700">
              <li>
                <strong>Ввод:</strong> <code className="bg-slate-200 px-2 py-1 rounded">пример.рф</code>
              </li>
              <li>
                <strong>DNS запрос:</strong> <code className="bg-slate-200 px-2 py-1 rounded">xn--e1afmkfd.xn--p1ai</code>
              </li>
              <li>
                <strong>Whois:</strong> <code className="bg-slate-200 px-2 py-1 rounded">пример.рф</code> (оригинальный вид)
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-3">Поддерживаемые зоны:</h4>
            <ul className="space-y-1 text-slate-700">
              <li><code className="bg-slate-200 px-2 py-1 rounded">.ru</code> — Россия</li>
              <li><code className="bg-slate-200 px-2 py-1 rounded">.su</code> — Советский Союз</li>
              <li><code className="bg-slate-200 px-2 py-1 rounded">.рф</code> — Российская Федерация (кириллица)</li>
            </ul>
          </div>
        </section>

        {/* Кнопка возврата */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться в сервис
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 DNS Dig. Инструмент для диагностики DNS-записей
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Сервис
              </Link>
              <a
                href="https://vk.com/igorqx"
                target="_blank"
                rel="noopener noreferrer"
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
};
