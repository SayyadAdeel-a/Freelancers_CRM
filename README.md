# Nudge CRM // Minimalist Freelance Operations

**The CRM for people who hate CRMs.** Nudge is a high-performance, industrial-inspired command center designed specifically for solo freelancers. It replaces enterprise complexity with focused, zero-friction client management.

![Nudge CRM Dashboard](<img width="1918" height="937" alt="Screenshot from 2026-04-30 16-57-39" src="https://github.com/user-attachments/assets/64667e0a-f9e6-44a7-81fe-1b050197de5c" />
)

## // Vision
Freelancers don't need a "747 cockpit" of pipelines and lead scores. They need a high-performance bicycle. Nudge provides the essential infrastructure to track relationships, log interactions, and automate follow-ups without the bloat.

## // Core Features
- **Client Command Center**: A consolidated, high-density directory of all your contacts.
- **Activity Stream**: Chronological interaction logs to ensure you never lose context.
- **Smart Reminders**: Automated email follow-ups powered by QStash and Resend.
- **Pro Tier Architecture**: Integrated subscription management via Lemon Squeezy.
- **Industrial Design System**: Built with the "Nothing" aesthetic—technical grids, mono-spaced utility, and high-contrast glassmorphism.

## // Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password & Google OAuth)
- **Infrastructure**: Firebase Admin SDK
- **Styling**: Tailwind CSS 4 + Shadcn/UI
- **Automation**: Upstash QStash
- **Communications**: Resend
- **Payments**: Lemon Squeezy
- **Observability**: Sentry & PostHog

## // Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/nudge-crm.git
cd nudge-crm
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory and populate it with your credentials:

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

### 3. Development Mode
```bash
npm run dev
```

## // Security Posture
Nudge is built with a "Security-First" architecture:
- **Strict CSP**: A hardened Content Security Policy prevents XSS and unauthorized data exfiltration.
- **Admin Boundary**: All write operations are gated behind Firebase ID token verification and executed via the Server-Side Admin SDK.
- **Encrypted Webhooks**: Signature verification ensures all payment events are authentic.

## // Roadmap
- [ ] Native Mobile Application (Responsive Web live)
- [ ] Client Portal for shared note viewing
- [ ] Direct Invoice Generation
- [ ] Multi-currency support for global freelancers

## // License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Built for the focused.**  
[adeelsayyad.tech](https://adeelsayyad.tech)
