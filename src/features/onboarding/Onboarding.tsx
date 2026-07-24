import { useEffect, useRef, useState, type ComponentType } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ListChecks,
  Sparkles,
  Trophy,
  type LucideProps,
} from 'lucide-react'
import { Avatar } from '../../shared/Avatar'
import { LEVELS } from '../../shared/config'
import { useTradingStore } from '../trading/store'

interface OnboardingStep {
  eyebrow: string
  title: string
  description: string
  icon: ComponentType<LucideProps>
  visual: 'avatar' | 'tasks' | 'reward'
}

const steps: OnboardingStep[] = [
  {
    eyebrow: 'Meet your avatar',
    title: 'This character grows with you',
    description: 'Your avatar reflects your current level. Earn userscore and watch it evolve from Beginner to Master.',
    icon: Sparkles,
    visual: 'avatar',
  },
  {
    eyebrow: 'Build your progress',
    title: 'Complete tasks and explore',
    description: 'Run simulations, try different datasets, keep daily streaks, and take on special challenges.',
    icon: ListChecks,
    visual: 'tasks',
  },
  {
    eyebrow: 'Collect achievements',
    title: 'Every milestone brings rewards',
    description: 'Achievements add userscore to your profile. Finish this tour to unlock your very first one.',
    icon: Trophy,
    visual: 'reward',
  },
]

function StepVisual({ kind }: { kind: OnboardingStep['visual'] }) {
  if (kind === 'avatar') {
    return (
      <div className="onboarding-avatar-line" aria-label="Avatar evolution">
        {LEVELS.slice(0, 3).map((level, index) => (
          <div key={level.id}>
            <span className="onboarding-avatar-stage">
              <Avatar src={level.avatar} alt={`${level.name} avatar`} />
              <small>{level.name}</small>
            </span>
            {index < 2 && <ArrowRight aria-hidden="true" />}
          </div>
        ))}
      </div>
    )
  }

  if (kind === 'tasks') {
    return (
      <div className="onboarding-task-list">
        <div><CheckCircle2 /><span><strong>First Prediction</strong><small>Run your first simulation</small></span><b>+60</b></div>
        <div><ListChecks /><span><strong>Daily challenge</strong><small>A fresh goal every day</small></span><b>+75</b></div>
        <div><Trophy /><span><strong>Monthly milestone</strong><small>Earn an exclusive item</small></span><b>+250</b></div>
      </div>
    )
  }

  return (
    <div className="onboarding-reward">
      <span><Trophy /></span>
      <div>
        <small>Achievement ready</small>
        <strong>Welcome Aboard</strong>
        <p>Complete the tour</p>
      </div>
      <b>+50</b>
    </div>
  )
}

export function Onboarding() {
  const completed = useTradingStore((state) => state.onboardingCompleted)
  const completeOnboarding = useTradingStore((state) => state.completeOnboarding)
  const [step, setStep] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const current = steps[step]
  const Icon = current.icon

  useEffect(() => {
    if (completed) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [completed])

  if (completed) return null

  const advance = () => {
    if (step < steps.length - 1) {
      setStep((value) => value + 1)
      return
    }
    completeOnboarding()
  }

  return (
    <div className="onboarding-backdrop">
      <div
        ref={dialogRef}
        className="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === 'Enter') advance()
        }}
      >
        <div className="onboarding-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((item, index) => (
            <span key={item.title} className={index <= step ? 'active' : ''} />
          ))}
        </div>

        <div className="onboarding-icon"><Icon /></div>
        <p className="onboarding-eyebrow">{current.eyebrow}</p>
        <h2 id="onboarding-title">{current.title}</h2>
        <p className="onboarding-description">{current.description}</p>

        <StepVisual kind={current.visual} />

        <footer className="onboarding-footer">
          <span>{step + 1} / {steps.length}</span>
          <div>
            {step > 0 && (
              <button className="onboarding-back" onClick={() => setStep((value) => value - 1)}>
                Back
              </button>
            )}
            <button className="onboarding-next" onClick={advance}>
              {step === steps.length - 1 ? 'Claim achievement' : 'Continue'}
              {step === steps.length - 1 ? <Trophy /> : <ArrowRight />}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
