# Swaraj App

## Overview

Swaraj is a Reddit-style mobile application built with React Native (Expo) and Supabase. It features Google Sign-In, global and personalized feeds, and post creation. The app aims to provide a platform for sharing and discovering content, with a focus on modern UI/UX and scalability.

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime)
- **Language:** TypeScript
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **UI Components:** ShadCN, Lucide
- **Styling:** Tailwind CSS (via NativeWind)
- **Authentication:** Expo Auth Session, Expo Web Browser
- **Routing:** Expo Router
- **Other Libraries:** Expo Image Picker, Expo Location, Expo Haptics, Expo Blur, Expo Constants, Expo Font, Expo Symbols, Expo System UI, Expo Status Bar, React Native Async Storage, React Native Gesture Handler, React Native Safe Area Context, React Native Screens, React Native Web, React Native Webview

## Features

### Core Features
- **Google Sign-In:** Secure authentication via Supabase.
- **Global Feed:** View all posts from the community.
- **Personalized Feed:** Discover posts filtered by tags you follow.
- **Create Post:** Easily create and share new posts with optional images and location tagging.

### Bonus Features
- **Image Upload:** Attach images to your posts.
- **Location Tagging:** Add location data to your posts.
- **Upvote/Save Functionality:** Interact with posts by upvoting or saving them.
- **Clean TypeScript Usage:** Ensures type safety and reduces bugs.
- **Modern UI:** Designed for a smooth and intuitive user experience.
- **Personalization:** Beyond tags, future enhancements include personalization based on location and user behavior.

## Database Schema

The application uses the following Supabase tables:

- `users`: Stores user information (id, name, avatar_url, created_at).
- `posts`: Stores post details (id, user_id, title, description, image_url, lat, lng, created_at).
- `tags`: Stores available tags (id, name).
- `post_tags`: Junction table linking posts to tags (post_id, tag_id).
- `user_follows_tags`: Tracks which tags users follow (user_id, tag_id).
- `saved_posts`: Records posts saved by users (user_id, post_id).
- `upvotes`: Records upvotes on posts (user_id, post_id).

## Getting Started

### Prerequisites
- Node.js and npm/yarn installed.
- Expo CLI installed (`npm install -g expo-cli`).
- Supabase project set up with the above schema and Google Auth enabled.
- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` set in your `.env` file.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd swaraj
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

1.  Start the Expo development server:
    ```bash
    npx expo start
    ```
2.  Scan the QR code with your Expo Go app (iOS/Android) or choose to run on a simulator/web.

## Project Structure

```
swaraj/
├── src/
│   ├── app/                  # Expo Router app directory
│   │   ├── (auth)/           # Authentication related screens
│   │   │   ├── _layout.tsx
│   │   │   ├── auth.tsx      # Auth callback handler
│   │   │   └── login.tsx     # Login screen
│   │   ├── (tabs)/           # Tab-based navigation screens
│   │   │   ├── _layout.tsx
│   │   │   ├── about.tsx     # About screen
│   │   │   ├── create.tsx    # Create new post screen
│   │   │   ├── index.tsx     # Global feed screen
│   │   │   └── personalized.tsx # Personalized feed screen
│   │   ├── +not-found.tsx    # Not found screen
│   │   └── _layout.tsx       # Root layout for the app
│   ├── types/                # TypeScript type definitions
│   │   └── supabase.ts       # Supabase related types (Post, Tag)
│   └── utils/                # Utility functions and services
│       ├── services/         # API service calls
│       │   ├── auth.ts
│       │   ├── posts.ts
│       │   └── tags.ts
│       └── supabase.ts       # Supabase client initialization
├── components/             # Reusable UI components
├── constants/              # Application constants (e.g., Colors)
├── hooks/                  # Custom React hooks
├── scripts/                # Utility scripts (e.g., reset-project.js)
├── .env                    # Environment variables (not committed)
├── .gitignore
├── app.json                # Expo app configuration
├── babel.config.js         # Babel configuration
├── eas.json                # EAS Build configuration
├── eslint.config.js        # ESLint configuration
├── metro.config.js         # Metro bundler configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Linting

To run the linter and check for code quality issues:

```bash
npm run lint
```

## Scaling to 1 Million Users (Future Considerations)

- **Database:** Migrate to a more scalable PostgreSQL solution (e.g., Fly.io).
- **Caching:** Implement Redis for caching frequently accessed data like the global feed.
- **CDN:** Utilize a CDN for optimized delivery of images and other media assets.
- **Task Offloading:** Offload heavy tasks like image processing and location lookups to background services.
- **ML-Powered Personalization:** Develop machine learning models for advanced feed ranking and personalization based on user behavior.

## Extreme Pro Enhancements (Future Ideas)

- **UI/UX Polish:** Smooth screen transitions (react-native-reanimated, moti), skeleton loaders, dark/light mode toggle, swipe gestures for interactions.
- **AI-Based Personalization:** Collect engagement metrics to compute dynamic post scores for smarter feed ranking.
- **Live Deployment:** Generate production builds with EAS, potentially deploy an admin dashboard, and add deep linking.
- **Rich README:** Include ERD diagrams, app screenshots/GIFs, and a "What I'd Build with 1 More Week" section.
- **Optional Analytics Layer:** Log user interactions for data-driven UX improvements and integration with analytics platforms like Mixpanel.