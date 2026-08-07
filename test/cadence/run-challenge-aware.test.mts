import { describe, expect, it, vi } from 'vitest'

import { challengeStep, doneStep } from '../../src/cadence/challenge-step.mts'
import { runChallengeAware } from '../../src/cadence/run-challenge-aware.mts'

import type { ChallengeAwareStep } from '../../src/cadence/challenge-step.mts'

describe('runChallengeAware', () => {
  it('returns on the first attempt and never pauses when there is no challenge', async () => {
    const pause = vi.fn(async () => {})
    const value = await runChallengeAware(async () => doneStep(42), {
      label: 'publish',
      pause,
    })
    expect(value).toBe(42)
    expect(pause).not.toHaveBeenCalled()
  })

  it('pauses once on a single challenge, then ticks the cooldown on the solve', async () => {
    let clock = 0
    const now = () => clock
    const pause = vi.fn(async () => {
      clock += 1000
    })
    const onChallengeCleared = vi.fn()
    const steps: Array<ChallengeAwareStep<string>> = [
      challengeStep(),
      doneStep('ok'),
    ]
    let i = 0
    const value = await runChallengeAware(async () => steps[i++]!, {
      label: 'publish',
      now,
      onChallengeCleared,
      pause,
    })
    expect(value).toBe('ok')
    expect(pause).toHaveBeenCalledTimes(1)
    expect(onChallengeCleared).toHaveBeenCalledTimes(1)
    expect(onChallengeCleared).toHaveBeenCalledWith({ clearedAt: 1000 })
  })

  it('throws a What/Where/Saw/Fix block once the challenge outlasts its budget', async () => {
    let clock = 0
    const now = () => clock
    // Each pause advances the fake clock by half the budget, so the third
    // attempt sees elapsed === budget and the run gives up.
    const pause = vi.fn(async () => {
      clock += 60_000
    })
    await expect(
      runChallengeAware(async () => challengeStep<never>(), {
        budgetMs: 120_000,
        label: 'publish',
        now,
        pause,
      }),
    ).rejects.toThrow(/human-verification challenge/)
    expect(pause).toHaveBeenCalledTimes(2)
  })
})
