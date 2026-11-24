# HB+ Google Auth (React Native + Expo)

A cross-platform app (Web, Android, iOS) built with React Native and React Native for Web from a single codebase. Users sign in with Google, and access is restricted to one email domain (`@hbplus.fit`).

**Live demo:** https://hbplusassignment.netlify.app

## Tech stack

- React Native + React Native for Web (Expo, Expo Router)
- Firebase Authentication (Google OAuth 2.0)
- Cloud Firestore (stores user profiles)
- Netlify (hosting)

## Features

- Google Sign-In button
- Email domain validation
- Protected dashboard page
- Logout
- Loading state during authentication
- Error handling with a clear message for blocked domains
- Responsive layout

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd hbplus-auth
   npm install
   ```
2. Create a Firebase project.
   - Enable **Authentication, Sign-in method, Google**.
   - Create a **Firestore Database**.
   - Add a **Web app** and copy its config values.
3. Copy `.env.example` to `.env` and fill in the values:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   EXPO_PUBLIC_FIREBASE_APP_ID=
   EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit
   ```
4. In **Firebase, Authentication, Settings, Authorized domains**, make sure `localhost` and your deployed domain are listed.
5. Add these Firestore rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null
           && request.auth.uid == uid
           && request.auth.token.email.matches('.*@hbplus[.]fit')
           && request.auth.token.email_verified == true;
       }
     }
   }
   ```
6. Run the app:
   ```bash
   npx expo start
   ```
   Press `w` for web or `a` for an Android emulator. Use `npx expo start -c` after changing `.env`.

## Deployment (Netlify)

- Build command: `npx expo export --platform web`
- Publish directory: `dist`
- `app.json` uses `"web": { "output": "single" }` so a static single-page build is produced.
- `public/_redirects` contains `/* /index.html 200` so direct URLs like `/dashboard` do not 404.
- Add all `EXPO_PUBLIC_*` variables in Netlify environment variables. They are baked in at build time, so redeploy after changing them.

## Authentication flow

1. The user clicks **Login with Google** and a Google popup opens.
2. Firebase returns the signed-in user.
3. `onAuthStateChanged` in `AuthContext` checks the email domain.
4. **Allowed domain:** the user profile is saved to Firestore and the user is redirected to `/dashboard`.
5. **Any other domain:** the user is signed out immediately and sees:
   > Access restricted. Please login using your official domain email.
6. **Logout** signs out of Firebase and returns to `/login`.

## How domain restriction works

- **Client side:** `src/utils/domain.ts` checks that the email ends with `@<EXPO_PUBLIC_ALLOWED_DOMAIN>`. The check lives in one place, `onAuthStateChanged`, so it also applies to sessions restored after a page refresh.
- **Server side:** the Firestore rules only allow access when the token email matches `@hbplus.fit` and is verified, so the restriction cannot be bypassed from the browser.
- The allowed domain is an environment variable, so it can change without editing code.

## Route protection

Every screen inside `src/app/(protected)/` is wrapped by a layout that checks authentication. While Firebase restores the session a loader is shown, and if there is no user the app redirects to `/login`. Opening `/dashboard` directly while logged out sends the user to the login page.

## Token handling

- Authentication is handled by the Firebase SDK, which manages ID tokens and refresh tokens and persists the session.
- No tokens or credentials are stored manually or written to the repo.
- `.env` is git-ignored. Only `.env.example` is committed.

## Folder structure

```
src/
  app/
    _layout.tsx          # AuthProvider wrapper
    index.tsx            # redirects based on auth state
    login.tsx            # login page
    (protected)/
      _layout.tsx        # route guard
      dashboard.tsx      # protected dashboard
  context/AuthContext.tsx  # user, loading, error, login, logout
  services/
    firebase.ts          # Firebase init
    users.ts             # saves user profile to Firestore
  utils/domain.ts        # domain validation
  constants/theme.ts
public/_redirects        # SPA fallback for Netlify
```

## Testing notes

I do not have an `@hbplus.fit` account. The blocked path was verified by logging in with a Gmail account against `hbplus.fit`. The allowed path was verified by temporarily setting `EXPO_PUBLIC_ALLOWED_DOMAIN=gmail.com` locally. The deployed build uses `hbplus.fit`.

## Screenshots

| Login | Blocked domain | Firesotre |
|---|---|---|
| <img width="1908" height="990" alt="image" src="https://github.com/user-attachments/assets/44d555c8-602f-49bf-b664-7ed467564ca6" /> | <img width="1911" height="948" alt="image" src="https://github.com/user-attachments/assets/dcc638e7-3a01-4284-9717-db99381d6594" /> | <img width="1907" height="862" alt="image" src="https://github.com/user-attachments/assets/f6476dda-7145-4b04-a9af-ce761c6302a6" /> |

## Not implemented

- Native (Android/iOS) Google sign-in. The UI and route guard work on mobile, but the login button is implemented for web only.
- Role-based access (bonus).
