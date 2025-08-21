Flights App ✈️
Test task (ДержКод) — a single-page application for browsing and booking flight tickets.

# Tech Stack
* Vite — project bundler
* React 18 + TypeScript — frontend framework
* Material-UI (MUI) — UI components
* Redux Toolkit — state management (cart, favorites)
* RTK Query with Axios — API layer
* React Router v6 — routing
* Jest + React Testing Library — unit testing

# Getting Started

**clone the repo**   
git clone <repo-url>  
cd flights-app

**install dependencies**  
npm install

**start development server**  
npm run dev

**build for production**  
npm run build

**run tests**  
npm test

# Project Structure (Feature-Sliced Design)

src/
app/          # AppRouter, AppProviders, store  
pages/        # pages (FlightsPage, FlightDetailsPage, CartPage)  
features/     # features (cart, favorites, filters)  
entities/     # entities (flight)  
shared/       # api, theme, ui, lib, types  
tests/        # setupTests.ts, unit tests

# Implemented

* Project setup with Vite + React + TypeScript
* Redux Toolkit slices for cart and favorites
* RTK Query + Axios API service layer
* MUI theme (light/dark) with a toggle button
* Initial pages (FlightsPage, FlightDetailsPage, CartPage) with stubs
* Unit testing environment (Jest + RTL)

# Винести роботу з API в окремий сервісний шар (custom hooks або RTK Query).

**API Service Layer (RTK Query)**

Щоб розділити UI та бізнес‑логіку, робота з API винесена в окремий сервісний шар на базі **Redux Toolkit Query**.  
Це дає автоматичне кешування, статуси `isLoading/isError`, рефетчинг та нормалізований доступ до даних у всіх компонентах.

### Де лежить код
- **`src/entities/flight/api.ts`** — RTK Query API slice для рейсів.
- **`src/shared/types/flight.ts`** — строгі типи відповіді API (`Flight`, `Tickets`).
- **`src/app/store.ts`** — підключення `flightApi.reducer` і `flightApi.middleware`.

### Ендпоїнти
- `GET /flights` — список рейсів (з підтримкою фільтрів/сортування через query params).
- `GET /flights/:id` — деталі рейсу.

### Використання у компонентах
* ts
import { useGetFlightsQuery, useGetFlightByIdQuery } from '@/entities/flight/api';

// Список рейсів із URL-параметрів
* const { data, isLoading, error } = useGetFlightsQuery({ airline, sort });

// Деталі рейсу
* const { data: flight, isLoading, error } = useGetFlightByIdQuery(id);


# API: усі запити через окремий сервісний шар (Axios або RTK Query).

**API: окремий сервісний шар (RTK Query)**

Усі звернення до бекенда виконуються **через окремий сервісний шар**, побудований на **Redux Toolkit Query** (альтернатива кастомним Axios‑хукам). Це ізолює HTTP‑логіку від UI, забезпечує кешування, стани завантаження/помилок і рефетчинг «з коробки».

**Структура**
- `src/entities/flight/api.ts` — RTK Query slice з ендпоїнтами:
   - `GET /flights` — список рейсів (підтримка `?airline=&sort=`).
   - `GET /flights/:id` — деталі рейсу.
- `src/shared/types/flight.ts` — типи даних API.
- `src/app/store.ts` — підключення `flightApi.reducer` та `flightApi.middleware`.

**Використання у компонентах**
* ts
- import { useGetFlightsQuery, useGetFlightByIdQuery } from '@/entities/flight/api';

// Список рейсів з параметрами з URL
- const { data, isLoading, error } = useGetFlightsQuery({ airline, sort });

// Деталі рейсу
- const { data: flight } = useGetFlightByIdQuery(id);


# 🧪 Тести

У проєкті додано базове покриття unit-тестами для Redux-ред’юсера та утиліт.

### Технології
- **Jest** — як тестовий раннер
- **ts-jest** — для підтримки TypeScript
- **React Testing Library** (готово для UI-тестів, хоча зараз покрито тільки логіку)

### Покриття
1. **Cart reducer (`cartSlice`)**
    - додавання квитка до кошика
    - захист від дублювання одного й того ж місця
    - видалення квитка
    - очищення кошика

2. **Утиліти**
    - `seatUtils.genStableSeatGridByTickets`  
      (перевіряє стабільність генерації та правильну кількість зайнятих місць)
    - `date.ts` (`fmtTime`, `fmtDate`, `fmtDuration`)  
      (перевіряє форматування у 24-годинному UTC-часі, дати та тривалості польоту)

### Запуск
```bash
npm test
