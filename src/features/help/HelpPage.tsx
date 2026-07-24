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
    title: 'How do demo simulations work?',
    lead: 'A quick overview of predictions, duration, and result calculation.',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pretium, justo vel cursus tempor, nisi mauris consequat sapien, vitae commodo arcu ligula sed neque.',
      'Choose a dataset, an amount, and a duration, then select the direction in which you expect the generated value to move.',
    ],
  },
  {
    id: 'userscore-guide',
    icon: Sparkles,
    title: 'How do achievements and progression work?',
    lead: 'Userscore, mascot levels, challenges, and exclusive items.',
    paragraphs: [
      'Achievements mark meaningful actions such as completing a first simulation, building a success streak, exploring the workspace, and returning regularly. Every achievement has a clear requirement, progress indicator, and userscore reward. Standard achievements unlock once, so repeating the action does not duplicate the reward.',
      'Userscore determines your profile level. There are five stages: Beginner, Explorer, Advanced, Expert, and Master. Reaching a new threshold updates the profile status, styling, and version of the green triangular mascot. The progress bar in the top panel shows how many points remain until the next level.',
      'A new daily challenge is selected each calendar day and offers a repeatable reward. The monthly challenge requires a larger set of actions: complete 5 successful simulations in the demo. It awards userscore and an exclusive themed item. Unlocked items remain in your collection permanently and can be equipped, changed, or removed.',
    ],
  },
  {
    id: 'safe-demo',
    icon: ShieldCheck,
    title: 'Does this use real-world data?',
    lead: 'About generated data, the demo balance, and workspace limitations.',
    paragraphs: [
      'All values are created locally by a deterministic generator. No external or real-time data source is used.',
      'The demo is not connected to financial services, real money, user accounts, or payment systems. Every action is part of a self-contained simulation.',
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
          <p className="eyebrow">Demo knowledge base</p>
          <h1>Help Center</h1>
          <p>Everything you need to know before your first simulation.</p>
        </div>
        <div className="reading-progress">
          <strong>{helpTopics.length}/3</strong>
          <span>topics explored</span>
          <div className="mini-track">
            <i style={{ width: `${(helpTopics.length / 3) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="help-layout">
        <section className="help-content">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Popular questions</h2>
            </div>
            <span>~ 3 minutes</span>
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
              <h2>{isComplete ? 'Guide completed' : 'Finished reading?'}</h2>
              <p>
                {isComplete
                  ? 'The achievement is already in your collection and the userscore has been added.'
                  : 'Mark the guide as complete and collect your reward for exploring.'}
              </p>
            </div>
            <button disabled={isComplete} onClick={completeHelp}>
              {isComplete ? <><Check /> Done</> : 'Complete reading · +70'}
            </button>
          </section>
        </section>

        <aside className="help-aside">
          <section className="support-card panel">
            <MessageCircleQuestion />
            <h2>Could not find an answer?</h2>
            <p>A support option may be added here in a future version.</p>
            <button disabled>Contact support</button>
            <small>Demo element · no data is sent</small>
          </section>
          <section className="tip-card panel">
            <Sparkles />
            <div>
              <strong>Tip</strong>
              <p>Open all three topics to discover an additional exploration reward.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
