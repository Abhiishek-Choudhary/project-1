# FreshDash — Hyperlocal Grocery Delivery

Production-ready React Native (Expo) grocery delivery app matching Stitch UI designs. Supports **Customer**, **Vendor**, and **Delivery Partner** roles.

## Tech Stack

- React Native + Expo + TypeScript
- React Navigation (stack + bottom tabs)
- Zustand (client state) + TanStack Query (server state)
- Axios (REST API layer)
- React Hook Form + Zod
- Socket.IO (live order updates)
- AsyncStorage + Expo Secure Store

## Getting Started

**Requirements:** Node.js 20+ (tested on v24), npm 10+, Expo Go app on device/emulator.

```bash
npm install
cp .env.example .env
npx expo start
```

### Demo Login

1. Open app → enter phone → Continue
2. OTP screen → use **`123456`**
3. Sign up as **Vendor** or **Delivery Partner** to access those dashboards

Mock APIs are enabled by default (`USE_MOCK = true` in services). Set `EXPO_PUBLIC_API_URL` in `.env` when connecting to your Node.js backend.

**Backend handoff:** See [`progress.md`](./progress.md) for API contracts, Socket.IO events, data models, and integration checklist.

## Project Structure

```
src/
├── api/           # Axios client, endpoints, mock data
├── components/    # Reusable UI (design system)
├── constants/     # Theme, enums, routes
├── contexts/      # Theme, toast, modal, socket
├── features/      # Feature modules (auth schemas)
├── hooks/         # Business logic hooks
├── navigation/    # Role-based navigators
├── screens/       # auth | user | vendor | delivery
├── services/      # API service layer
├── store/         # Zustand stores
├── types/         # TypeScript interfaces
└── utils/         # Formatters, storage, errors
```

## Stitch UI Screens

- **Organic Market** — store product grid, categories, floating cart bar
- **Product Detail** — strawberries layout, nutrition grid, related products
- **Shopping Cart** — address, items, coupon, order summary, checkout CTA

## Backend Integration

REST endpoints are defined in `src/api/endpoints.ts`. Set `USE_MOCK = false` in service files and configure:

```
EXPO_PUBLIC_API_URL=http://your-api:3000/api
EXPO_PUBLIC_SOCKET_URL=http://your-api:3000
```

## Features

| Module | Features |
|--------|----------|
| Auth | Login, signup, OTP, JWT, role-based routing |
| User | Home, search, cart, checkout, orders, tracking, profile |
| Vendor | Dashboard, inventory CRUD, orders, earnings |
| Delivery | Assignments, pickup/delivery confirmation |
| Realtime | Socket.IO order subscription |
| UX | Dark/light theme, toasts, modals, empty/loading states |

## License

Private — All rights reserved.
# project-1
