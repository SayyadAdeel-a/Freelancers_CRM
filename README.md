<div align="center">

# NUDGE // CRM
**INDUSTRIAL MINIMALISM FOR SOLO FREELANCERS**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

"The CRM for people who hate CRMs."

[**Live Demo**](https://freelancers-crm-one.vercel.app) • [**Report Bug**](https://github.com/yourusername/nudge-crm/issues) • [**Request Feature**](https://github.com/yourusername/nudge-crm/issues)

<br />

<img width="1918" height="937" alt="Nudge CRM Dashboard Preview" src="https://github.com/user-attachments/assets/64667e0a-f9e6-44a7-81fe-1b050197de5c" />

</div>

---

## ⚡ // VISION
Freelancers don't need a **"747 cockpit"** of complex pipelines and lead scoring. They need a **high-performance bicycle**. 

Nudge provides the essential industrial infrastructure to track relationships, log interactions, and automate follow-ups with zero friction and zero bloat.

---

## 🛠 // CORE ARCHITECTURE

| Feature | Description |
| :--- | :--- |
| **Command Center** | High-density directory for rapid client management. |
| **Activity Stream** | Chronological logs of every interaction. |
| **Smart Reminders** | Automated email follow-ups via QStash & Resend. |
| **Pro Infrastructure** | Subscription scaling via Lemon Squeezy integration. |
| **Industrial UI** | Technical grids, mono typography, and glassmorphism. |

---

## 🚀 // TECH STACK

- **Frontend**: Next.js 15 (App Router), React 19, Lucide Icons
- **Styling**: Tailwind CSS 4, Shadcn/UI, Framer Motion
- **Backend**: Firebase Firestore (NoSQL), Firebase Auth
- **Server**: Next.js Server Actions, Firebase Admin SDK
- **DevOps**: Sentry (Error Tracking), PostHog (Analytics)
- **Services**: Upstash QStash (Cron), Resend (Email), Lemon Squeezy (Billing)

---

## ⚙️ // SETUP & DEPLOYMENT

### 1. Installation
```bash
git clone https://github.com/yourusername/nudge-crm.git
cd nudge-crm
npm install
```

### 2. Environment Variables
<details>
<summary><b>Click to expand .env.local configuration</b></summary>

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin (Secret)
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# Payments & Automation
LEMON_SQUEEZY_API_KEY="..."
LEMON_SQUEEZY_STORE_ID="..."
LEMON_SQUEEZY_VARIANT_ID="..."
LEMON_SQUEEZY_WEBHOOK_SECRET="..."
QSTASH_TOKEN="..."
QSTASH_CURRENT_SIGNING_KEY="..."
QSTASH_NEXT_SIGNING_KEY="..."
RESEND_API_KEY="..."

# Analytics
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="..."
NEXT_PUBLIC_POSTHOG_HOST="..."
```
</details>

### 3. Local Development
```bash
npm run dev
```

---

## 🔐 // SECURITY PROTOCOL
Nudge implements a **Security-First** industrial posture:
*   **Hardened CSP**: Strict Content Security Policy to eliminate XSS.
*   **Admin Boundary**: All write operations verified via Firebase ID tokens on the server.
*   **Signed Webhooks**: HMAC signature verification for all billing events.

---

## 🗺 // ROADMAP
- [x] Industrial UI Redesign
- [x] Pro Plan Integration
- [ ] Native Mobile Application
- [ ] Shared Client Portal
- [ ] Automated Invoicing Engine

---

<div align="center">

**BUILT FOR THE FOCUSED.**

[adeelsayyad.tech](https://adeelsayyad.tech)

</div>
