# Smart EV – Smart Electric Vehicle Charging Station Locator
### Complete Web Application Development Specification, UI/UX Design, Backend, Database and Integration Guide

---

## 1. Project Overview

**Smart EV** is a responsive web application engineered to help electric vehicle drivers locate nearby EV charging stations using their browser's geographical location. It provides real-time straight-line and turn-by-turn road route navigation, charging prices in Indian Rupees (₹/kWh), connector standards (CCS2, Type 2, CHAdeMO), and charger availability status.

The web application reuses the Firebase project **`smartevstation-23664`** from the original Android application, ensuring complete schema parity.

---

## 2. Implemented Features

- **Splash / Initial Loading Screen (`/`)**: Real-time Firebase Auth state observer with smooth redirects to `/map` or `/login`.
- **User Authentication (`/login`, `/signup`)**:
  - Secure registration and login using Firebase Authentication.
  - Password visibility toggles, input validation, and user-friendly error banners.
  - Transparent demo/offline mode for local development before cloud API keys are inserted.
- **Location Permission Onboarding (`/location`)**:
  - User-driven browser Geolocation API prompt.
  - Informative explanation with fallback option to proceed without GPS.
- **Main Interactive Map (`/map`)**:
  - OpenStreetMap tiles with verified attribution.
  - Custom EV station map pins with active state highlighting.
  - Pulsing blue GPS marker for current user location.
  - Desktop split-screen view (sidebar panel + map) and mobile responsive layout (tab switcher + floating card).
  - Recenter / My Location control.
- **Station Directory & Search (`/stations`)**:
  - Real-time case-insensitive keyword search by station name and address.
  - **Cheapest Sorting**: Ascending numeric price (₹/kWh).
  - **Nearest Sorting**: Ascending Haversine distance with safety guard when GPS is unavailable.
- **Station Specifications & Details (`/stations/:stationId`)**:
  - Pricing, connector types, available/total charger counts, and rating display.
  - Direct actions: "View on Map" and "Get Route".
- **Turn-by-Turn Road Route Navigation (`/route/:stationId`)**:
  - OSRM driving engine query with geometry decoding.
  - High-visibility dual-layered polyline rendered on the map.
  - Accurate road distance (km) and estimated travel duration (minutes/hours).
  - One-click Google Maps external navigation fallback.
- **User Profile & Logout Menu**:
  - Displays authenticated email/name with accessible logout confirmation modal.
- **Firestore Security Rules (`firestore.rules`)**:
  - Public read-only access to `stations` for authenticated users; write-protected against unauthorized tampering.
  - User profile isolation (`users/{uid}`).

---

## 3. Project Directory Structure

```
c:/ev/
├── public/
│   ├── assets/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/
│   │   │   ├── ConfirmLogoutDialog.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── map/
│   │   │   └── MapView.tsx
│   │   ├── routing/
│   │   │   └── RoutePanel.tsx
│   │   └── stations/
│   │       ├── SearchBar.tsx
│   │       ├── SortControls.tsx
│   │       ├── StationCard.tsx
│   │       ├── StationDetails.tsx
│   │       └── StationList.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── LocationContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRoute.ts
│   │   ├── useStations.ts
│   │   └── useUserLocation.ts
│   ├── lib/
│   │   └── firebase.ts
│   ├── pages/
│   │   ├── LocationPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MapPage.tsx
│   │   ├── RoutePage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── SplashPage.tsx
│   │   ├── StationDetailsPage.tsx
│   │   └── StationListPage.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── types/
│   │   ├── route.ts
│   │   ├── station.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── distance.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .env.example
├── .gitignore
├── firestore.rules
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 4. Environment Configuration

Copy `.env.example` to `.env` and populate your Firebase Web App configuration:

```bash
cp .env.example .env
```

### Environment Variables:

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `smartevstation-23664.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Existing Firebase Project ID | `smartevstation-23664` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage Bucket | `smartevstation-23664.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Web App ID | `1:123456789012:web:abcdef` |
| `VITE_OSRM_ROUTING_URL` | OSRM Driving Engine API | `https://router.project-osrm.org/route/v1/driving` |
| `VITE_OSM_TILE_URL` | OpenStreetMap Tile Server | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| `VITE_OSM_ATTRIBUTION` | Tile Attribution | `&copy; OpenStreetMap contributors` |

---

## 5. Local Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The server will start on [http://localhost:3000](http://localhost:3000).

### 3. Production Build & Type Check
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## 6. Firestore Security Rules Deployment

To deploy the included `firestore.rules` to your Firebase project `smartevstation-23664`:

```bash
npm install -g firebase-tools
firebase login
firebase use smartevstation-23664
firebase deploy --only firestore:rules
```

---

## 7. Firebase Hosting Deployment

```bash
firebase init hosting
# Select existing project: smartevstation-23664
# Set public directory: dist
# Configure as single-page app (rewrite all urls to /index.html): Yes
npm run build
firebase deploy --only hosting
```
