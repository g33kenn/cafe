# Elvin's Coffee Recipes ☕

A sleek, responsive web application for dialing in and tracking espresso recipes for the **Breville Bambino** espresso machine and **Fellow Opus** conical burr grinder.

🌐 **Live Site:** [cafe.pixelvin.com](https://cafe.pixelvin.com)

---

## Features

- **Interactive Espresso Recipes**: Track coffee dose (g), grind setting (Fellow Opus clicks), and yield (g) with rich tasting notes.
- **Card Customization**: Custom banner background color with smart contrast detection (auto WCAG 2.0 contrast or manual white/black text) and live preview.
- **Demo Mode**: Instant local exploration for unauthenticated guests, backed by browser `localStorage`. Add, edit, and delete demo recipes with a one-click reset.
- **Cloud Sync**: Seamless Google Authentication via Firebase to securely persist your personal coffee recipe catalog across all your devices.
- **Coffee Compass**: Built-in coffee extraction troubleshooting wheel to diagnose under-extracted (sour) or over-extracted (bitter) shots.
- **Mobile Responsive & Accessible**: Clean design tuned for mobile and desktop screens with keyboard navigation and modal accessibility.

---

## Tech Stack

- **HTML5 & Vanilla JavaScript** (ES Modules)
- **Tailwind CSS** (Utility-first styling)
- **Google Fonts** (Lora & Inter typography)
- **Firebase 11** (Authentication & Cloud Firestore)

---

## Getting Started

### Local Development

You can open `index.html` directly in any modern browser, or run a local static HTTP server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js / npx
npx serve .
```

Visit `http://localhost:8000` in your browser.

### Firebase Configuration

To enable cloud sync for your own Firebase project:
1. Create a project on the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google Sign-In provider).
3. Enable **Cloud Firestore**.
4. In `index.html`, replace the `firebaseConfig` object with your web app credentials.
5. Configure Firestore Security Rules to restrict recipe access per user:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/coffee_recipes/{recipeId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
