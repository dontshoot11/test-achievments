# Конфигурация демо

## Зачем

`config.ts` хранит единый каталог наборов данных, уровней, достижений, косметики и ежедневных заданий, чтобы UI и стор использовали одинаковые правила прогресса.

## Как пользоваться

Импортируйте каталоги `ASSETS`, `LEVELS`, `ACHIEVEMENTS`, `COSMETICS` и `DAILY_TASKS` напрямую. Для вычисляемого выбора используйте `getLevel(score)`, `getNextLevel(score)`, `getDailyTask(dateKey)` и `getMonthlyCosmetic(monthKey)`; ключи дат передаются в формате `YYYY-MM-DD` и `YYYY-MM`.

```ts
const level = getLevel(score)
const nextLevel = getNextLevel(score)
const dailyTask = getDailyTask('2026-08-27')
```
