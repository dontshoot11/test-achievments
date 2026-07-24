import { useEffect, useState } from 'react'
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleHelp,
  LifeBuoy,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useTradingStore } from '../trading/store'

const TOPICS = [
  {
    id: 'trading-basics',
    icon: CircleHelp,
    title: 'Как устроены демо-сделки?',
    lead: 'Коротко о направлении прогноза, экспирации и расчёте результата.',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pretium, justo vel cursus tempor, nisi mauris consequat sapien, vitae commodo arcu ligula sed neque.',
      'Aenean tristique tellus non lacus tincidunt, ut volutpat lorem feugiat. Выберите актив, сумму и время сделки, затем укажите ожидаемое направление движения цены.',
    ],
  },
  {
    id: 'userscore-guide',
    icon: Sparkles,
    title: 'Как работают ачивки и прокачка?',
    lead: 'Userscore, уровни маскота, задания и эксклюзивные предметы.',
    paragraphs: [
      'Ачивки отмечают важные действия пользователя: первую сделку, серию побед, изучение платформы и регулярные возвращения. У каждой ачивки есть понятное условие, прогресс и награда в userscore. Обычная ачивка открывается один раз, поэтому повторное выполнение условия не дублирует награду.',
      'Userscore определяет уровень профиля. Всего предусмотрено пять ступеней: Новичок, Трейдер, Про, Эксперт и Гуру. При достижении нового порога меняются статус, оформление профиля и версия зелёного треугольного маскота. Полоска в верхней панели показывает, сколько очков осталось до следующего уровня.',
      'Задание дня выбирается заново каждый календарный день и приносит повторяемую награду. Задание месяца требует серии более значимых действий: в демо достаточно закрыть 5 сделок в плюс. За него пользователь получает userscore и эксклюзивный тематический предмет. Полученные предметы навсегда остаются в гардеробе — их можно надевать на маскота, менять или снимать.',
    ],
  },
  {
    id: 'safe-demo',
    icon: ShieldCheck,
    title: 'Это настоящая торговля?',
    lead: 'О данных, балансе и ограничениях демонстрационного режима.',
    paragraphs: [
      'Nullam commodo, felis ac faucibus efficitur, turpis augue viverra mi, eget posuere ipsum libero id lectus. Все котировки создаются локальным генератором случайных тиков.',
      'Donec vulputate sem at erat volutpat, ut tincidunt elit volutpat. Демо не подключено к брокеру, реальным деньгам, аккаунтам или платёжным системам.',
    ],
  },
]

export function HelpPage() {
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[0].id)
  const openHelpTopic = useTradingStore((state) => state.openHelpTopic)
  const completeHelp = useTradingStore((state) => state.completeHelp)
  const helpTopics = useTradingStore((state) => state.helpTopics)
  const isComplete = useTradingStore((state) => Boolean(state.unlocked['help-reader']))

  useEffect(() => {
    openHelpTopic(TOPICS[0].id)
  }, [openHelpTopic])

  const toggleTopic = (topic: string) => {
    setOpenTopic((current) => current === topic ? null : topic)
    openHelpTopic(topic)
  }

  return (
    <div className="help-page">
      <header className="help-hero panel">
        <div>
          <span className="help-icon"><LifeBuoy /></span>
          <p className="eyebrow">База знаний Orbit</p>
          <h1>Хелп-центр</h1>
          <p>Всё, что нужно знать перед первым прогнозом. Или почти всё.</p>
        </div>
        <div className="reading-progress">
          <strong>{helpTopics.length}/3</strong>
          <span>темы изучено</span>
          <div className="mini-track">
            <i style={{ width: `${(helpTopics.length / 3) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="help-layout">
        <section className="help-content">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Начните отсюда</p>
              <h2>Популярные вопросы</h2>
            </div>
            <span>~ 3 минуты</span>
          </div>

          <div className="help-topics">
            {TOPICS.map((topic) => {
              const Icon = topic.icon
              const isOpen = openTopic === topic.id
              const wasRead = helpTopics.includes(topic.id)
              return (
                <article className={`help-topic panel ${isOpen ? 'open' : ''}`} key={topic.id}>
                  <button onClick={() => toggleTopic(topic.id)} aria-expanded={isOpen}>
                    <span className="topic-icon"><Icon /></span>
                    <span>
                      <strong>{topic.title}</strong>
                      <small>{topic.lead}</small>
                    </span>
                    {wasRead && <i className="read-check"><Check size={12} /></i>}
                    <ChevronDown className="topic-chevron" />
                  </button>
                  {isOpen && (
                    <div className="topic-body">
                      {topic.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          <section className="reading-finish panel">
            <BookOpenCheck />
            <div>
              <h2>{isComplete ? 'Руководство прочитано' : 'Дочитали до конца?'}</h2>
              <p>
                {isComplete
                  ? 'Ачивка уже в вашей коллекции, а userscore начислен.'
                  : 'Зафиксируйте прочтение и заберите награду за полезное любопытство.'}
              </p>
            </div>
            <button disabled={isComplete} onClick={completeHelp}>
              {isComplete ? <><Check /> Готово</> : 'Завершить чтение · +70'}
            </button>
          </section>
        </section>

        <aside className="help-aside">
          <section className="support-card panel">
            <MessageCircleQuestion />
            <h2>Не нашли ответ?</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Команда поддержки скоро будет здесь.</p>
            <button disabled>Написать в поддержку</button>
            <small>Демо-элемент · без отправки данных</small>
          </section>
          <section className="tip-card panel">
            <Sparkles />
            <div>
              <strong>Совет</strong>
              <p>Откройте все три темы — за исследование справки спрятана отдельная награда.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
