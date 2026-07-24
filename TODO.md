# TODO — Userscore Demo Workspace

## Goal

Maintain a local, interactive demo that showcases:

- two switchable generated datasets;
- a live deterministic chart;
- 5- and 10-second prediction simulations;
- a structured activity log;
- userscore, achievements, profile levels, and mascot evolution;
- daily and monthly challenges;
- local persistence and a complete demo reset.

> The prototype is fully self-contained. It does not connect to external data, financial services, real money, payments, or user accounts.

## Implemented

- [x] React, TypeScript, and Vite application.
- [x] Zustand state management and React Router navigation.
- [x] Deterministic value generation with separate histories.
- [x] Responsive chart with active-simulation start marker.
- [x] Simulation controls, validation, countdown, result calculation, and history.
- [x] Filterable activity log.
- [x] Achievement engine with userscore rewards.
- [x] Five profile levels and five local mascot avatars.
- [x] Daily and monthly challenges with a collectible reward.
- [x] Interactive Help Center with reading progress.
- [x] Local persistence, reset control, and presentation boost.
- [x] Unit tests for value generation, simulations, visits, challenges, and progression.

## Remaining improvements

- [ ] Add saved-state versioning and safe migrations.
- [ ] Add explicit loading, empty, and error states where useful.
- [ ] Audit keyboard navigation, focus visibility, contrast, and reduced motion.
- [ ] Pause background updates while the browser tab is hidden.
- [ ] Verify that timers and chart updates do not cause unnecessary work.
- [ ] Add broader achievement-engine test coverage.
- [ ] Run a manual smoke test in current Chrome, Safari, and Firefox.
- [ ] Confirm that lint, tests, and the production build pass before release.
