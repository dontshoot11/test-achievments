# Userscore Demo Workspace

An interactive, self-contained prototype that demonstrates achievements, userscore progression, profile levels, and an evolving mascot.

## Online demo

[Open the prototype on GitHub Pages](https://dontshoot11.github.io/test-achievments/)

## Run locally

```bash
npm install
npm run dev
```

Vite will display the local URL, usually `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Demo flow

1. On the first launch, complete the getting-started tour to collect its reward.
2. On the Workspace screen, select BTC/USD or ETH/USD.
3. Enter an amount and choose a duration of 5 or 10 seconds.
4. Select Higher or Lower and watch the countdown.
5. Or select `I feel lucky` to start a simulation with a random dataset, amount, duration, and direction.
6. Follow the event sequence in the live activity log.
7. When the simulation finishes, achievements unlock and userscore is awarded.
8. Open Achievements to review progress and the updated avatar.
9. Open the Help Center, explore all three topics, and complete the guide.
10. Return on the next two calendar days to unlock a `3/3` visit streak.
11. Complete the random daily challenge on the Achievements screen.
12. Complete 5 successful simulations in a month to unlock the collectible item.
13. Select `Demo boost` to preview the maximum level.
14. Select `Reset demo` to restart the experience.

## Architecture

- `src/app` — layout and routing;
- `src/features/trading` — deterministic data generator, chart, simulations, and central store;
- `src/features/achievements` — achievement catalog and progression screen;
- `src/features/help` — interactive Help Center and reading progress;
- `src/features/onboarding` — rewarded getting-started tour shown on the first launch;
- `src/shared` — models and progression configuration;
- `public/avatars` — five generated stages of the green triangular mascot.

All displayed values are generated locally by a reproducible pseudo-random generator. Progress, the demo balance, and simulation history are stored in `localStorage`. The prototype does not use real money, accounts, payment systems, or external data.
