import { describe, expect, it, vi } from 'vitest'

import {
  isCooldownActive,
  openCooldownWindow,
  runChallengeAwareBatch,
} from '../../src/cadence/batch.mts'
import { challengeStep, doneStep } from '../../src/cadence/challenge-step.mts'

import type { ChallengeAwareStep } from '../../src/cadence/challenge-step.mts'

describe('cooldown window', () => {
  it('is active only within the window', () => {
    const w = openCooldownWindow(1000, 5000)
    expect(isCooldownActive(w, 1000)).toBe(true)
    expect(isCooldownActive(w, 5999)).toBe(true)
    expect(isCooldownActive(w, 6000)).toBe(false)
    expect(isCooldownActive(undefined, 0)).toBe(false)
  })
})

describe('runChallengeAwareBatch', () => {
  it('solves one challenge, then rides the cooldown for the rest of the batch', async () => {
    let clock = 0
    const now = () => clock
    const pause = vi.fn(async () => {
      clock += 1000
    })
    // Only the first operation challenges; the rest ride the cooldown window
    // that the solve opened.
    const firstSteps: Array<ChallengeAwareStep<string>> = [
      challengeStep(),
      doneStep('a'),
    ]
    let firstIndex = 0
    const operations: Array<() => Promise<ChallengeAwareStep<string>>> = [
      async () => firstSteps[firstIndex++]!,
      async () => doneStep('b'),
      async () => doneStep('c'),
    ]
    const result = await runChallengeAwareBatch(operations, {
      label: 'bulk publish',
      now,
      pause,
      windowMs: 300_000,
    })
    expect(result.results).toEqual(['a', 'b', 'c'])
    expect(result.challengesSolved).toBe(1)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(result.cooldown).toEqual({ openedAt: 1000, windowMs: 300_000 })
    expect(isCooldownActive(result.cooldown, clock)).toBe(true)
  })
})
