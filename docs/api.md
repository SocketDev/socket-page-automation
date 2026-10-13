# API Reference

The package has a dependency-free root cadence API and an npm site-knowledge subpath. The public package exports are defined in [`package.json`](../package.json). TypeScript source links provide the exact function signatures and option/result fields.

## Root cadence API

Import from `@socketsecurity/page-automation`.

| Export                                                           | Purpose                                                                                                                                | Declaration                                                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `runChallengeAware`                                              | Run an operation until it completes, retry is requested, or a human challenge is paused and cleared within the configured time budget. | [`src/cadence/run-challenge-aware.mts`](../src/cadence/run-challenge-aware.mts) |
| `formatChallengeTimeout`                                         | Format the timeout error using the supplied operation label and budget.                                                                | [`src/cadence/run-challenge-aware.mts`](../src/cadence/run-challenge-aware.mts) |
| `challengeStep`, `doneStep`, `retryStep`                         | Create the three discriminated outcomes accepted from an operation.                                                                    | [`src/cadence/challenge-step.mts`](../src/cadence/challenge-step.mts)           |
| `runChallengeAwareBatch`                                         | Run operations with a shared cooldown result and challenge count.                                                                      | [`src/cadence/batch.mts`](../src/cadence/batch.mts)                             |
| `isCooldownActive`, `openCooldownWindow`                         | Create and check a cooldown time window.                                                                                               | [`src/cadence/batch.mts`](../src/cadence/batch.mts)                             |
| `CHALLENGE_BUDGET_MS`, `CHALLENGE_POLL_MS`, `COOLDOWN_WINDOW_MS` | Default challenge timing constants.                                                                                                    | [`src/cadence/constants.mts`](../src/cadence/constants.mts)                     |

The operation returns `{ kind: 'done', value }`, `{ kind: 'retry' }`, or `{ kind: 'challenge' }`. A challenge invokes the injected asynchronous `pause` callback with attempt count, elapsed time, budget, and label; when it returns, the operation runs again. A completed operation returns its value. The configured budget bounds challenge pauses. See the [`ChallengeAwareStep`](../src/cadence/challenge-step.mts) and [`ChallengeAwareConfig`](../src/cadence/run-challenge-aware.mts) declarations for exact types.

## Batch cooldown API

`runChallengeAwareBatch` accepts an array of async operations and a `BatchConfig`. It runs each operation through the challenge-aware runner. The first cleared challenge opens the cooldown window; the result contains each operation's value, the number of cleared challenges, and the last cooldown window.

```ts
import {
  challengeStep,
  doneStep,
  runChallengeAwareBatch,
} from '@socketsecurity/page-automation'

const result = await runChallengeAwareBatch(
  [
    async () =>
      (await updatePackage()) ? doneStep('updated') : challengeStep(),
    async () => doneStep(await updateOrgSettings()),
  ],
  {
    label: 'npm updates',
    pause: async context => await waitForOperator(context),
  },
)
```

`BatchConfig` extends the runner configuration without `onChallengeCleared` and adds `windowMs`. `BatchResult<T>` exposes `results`, `challengesSolved`, and `cooldown`. The defaults are declared in [`src/cadence/constants.mts`](../src/cadence/constants.mts).

## npm site facts

Import from `@socketsecurity/page-automation/npm`.

| Export                                                       | Purpose                                                                             |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `NPM_ORIGIN`, `NPM_WHOAMI_PATH`, `NPM_CHALLENGE_MARKER`      | npm origin, session-identity route, and human-verification marker.                  |
| `npmWhoamiUrl(origin?)`                                      | Build the whoami URL for the selected origin.                                       |
| `npmOrgUrl(org, origin?)`                                    | Build an organization URL.                                                          |
| `npmPackageSettingsUrl(pkg, origin?)`                        | Build a package access-settings URL. The package identifier is supplied URL-safe.   |
| `COOLDOWN_OPTIN_SELECTOR`                                    | Selector for npm's cooldown opt-in checkbox.                                        |
| `bulkActionApplyLocator()`, `bulkActionRowCheckboxLocator()` | Return selector hints for bulk-action controls.                                     |
| `trustedPublisherFieldLocator(field)`                        | Return a selector hint for a trusted-publisher field.                               |
| `LocatorHint`, `TrustedPublisherField`                       | Locator description/selector structure and supported trusted-publisher field names. |

These helpers return URL strings or locator hints. A browser driver must resolve locator hints to page elements; this package does not import Playwright or interact with the page.

## Package subpaths

| Subpath                         | Exported surface                                                    | Source                                                                          |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `.`                             | Challenge steps, runner, timing constants, and npm facts/selectors. | [`src/index.mts`](../src/index.mts)                                             |
| `./npm`                         | npm URLs, selectors, locator hints, and related types.              | [`src/npm/index.mts`](../src/npm/index.mts)                                     |
| `./npm/facts`                   | npm origin and route constants plus URL builders.                   | [`src/npm/facts.mts`](../src/npm/facts.mts)                                     |
| `./npm/selectors`               | npm selector constants, locator factories, and types.               | [`src/npm/selectors.mts`](../src/npm/selectors.mts)                             |
| `./cadence/batch`               | Batch cooldown helpers and types.                                   | [`src/cadence/batch.mts`](../src/cadence/batch.mts)                             |
| `./cadence/challenge-step`      | Challenge/done/retry steps and their union type.                    | [`src/cadence/challenge-step.mts`](../src/cadence/challenge-step.mts)           |
| `./cadence/constants`           | Timing constants.                                                   | [`src/cadence/constants.mts`](../src/cadence/constants.mts)                     |
| `./cadence/run-challenge-aware` | Runner and configuration/pause types.                               | [`src/cadence/run-challenge-aware.mts`](../src/cadence/run-challenge-aware.mts) |
