# page-automation

Browser page-automation and an anti-bot challenge cadence for npm-style
human-verification flows.

The root export is a dependency-free state machine: attempt an operation, and
when npm interjects a human-verification challenge, PAUSE through an injected
seam instead of blind-retrying, tick the cooldown, and re-attempt within a
budget. After one solved challenge, a batch of follow-up operations rides the
same cooldown window instead of re-challenging per operation. The pause is an
injected async seam, `(ctx) => Promise<void>`, so the core runs the same under
Playwright, a content script, or a test clock — it never depends on a browser.

## Install

```sh
npm install @socketsecurity/page-automation
```

## Usage

Root export, the runtime-agnostic cadence core:

```js
import { runChallengeAware } from '@socketsecurity/page-automation'

const user = await runChallengeAware(attemptWhoami, {
  label: 'npm whoami',
  // Injected pause: bring the challenge to the operator and wait. The core
  // never imports a browser driver.
  pause: async ({ elapsedMs, budgetMs }) =>
    bringToFrontAndWait(elapsedMs, budgetMs),
})
```

`./npm`, the dependency-free npm site-knowledge layer:

```js
import {
  COOLDOWN_OPTIN_SELECTOR,
  npmWhoamiUrl,
} from '@socketsecurity/page-automation/npm'
```

### Subpath exports

| Subpath | What it is | Dependencies |
| --- | --- | --- |
| `.` | The runtime-agnostic challenge-cadence state machine plus its constants. | none |
| `./npm` | npm site knowledge: the `didOptForCooldown` cooldown opt-in selector, page and URL facts, and stub locators for the future bulk-action and trusted-publisher flows. | none |

Two implementation seams are planned once consumers exist: `./driver` (the
Playwright implementation of the pause seam) and `./in-page` (the content-script
implementation). Neither ships in 0.1.0.

## Development

```sh
pnpm install
pnpm run build
pnpm test
```

## License

MIT
