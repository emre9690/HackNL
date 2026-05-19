# StadKompas — Discover Rotterdam

> Built at HackNL 2025 in 24 hours.

StadKompas helps newcomers and international students find **low-pressure, recurring social routines** in Rotterdam — study tables, board game nights, sketch cafés, Sunday walks. Not one-off events. Spaces you can return to.

The problem: Rotterdam has a rich informal social scene, but it's invisible to people who just arrived. WhatsApp groups, word-of-mouth, niche subreddits. StadKompas surfaces it.

---

## Demo

The app runs in a phone mockup — designed for live demo and video walkthroughs.

```bash
npm install
npm run dev
# → http://localhost:5173
```

Use the **Demo Controls** panel (bottom-right) to jump between screens or reset state.

### Flow

```
Landing → Onboarding → Home (For You feed) → Event Detail → Arrival Badge
                                         ↘ Map / Saved / Profile
```

**Admin mode** (toggle in Demo Controls): city dashboard where staff approve AI-suggested events and assign hosts.

---

## How the Recommendation Works

Onboarding collects four signals: **interests**, **vibe**, **language**, and **area**.

Each event is scored against your profile:

| Signal | Match type | Points |
|--------|-----------|--------|
| Interest | Exact category match | +3 |
| Interest | Exact vibe tag match | +2 |
| Interest group | Broad group match (e.g. any Creative interest → Creative-tagged events) | +1 |
| Language | Matches your language preference | +2 |
| Vibe | Matches your energy preference (Quiet → Calm events) | +1 |
| Area | Event is in your neighbourhood | +1 |

Events scoring below 3 are filtered out. The rest are sorted and shown as your **For You** feed. The fewer interests you pick, the tighter the list — by design.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Map | React Leaflet + OpenStreetMap (no paid key) |
| Icons | lucide-react |
| Backend | Node.js + Express |
| Persistence | localStorage (no database, no auth) |

---

## Project Structure

```
src/
  components/     # PhoneFrame, BottomNav, MapView, EventCard, ArrivalBadge, AdminDashboard
  pages/          # Landing, Onboarding, Home, EventDetail, SavedEvents, Profile
  data/           # 24 real Rotterdam-inspired events + demo user data
  types/          # TypeScript interfaces
server/
  routes/         # Express API routes
  index.js        # Server entry point
```

---

## Screens

| Screen | What it does |
|--------|-------------|
| Landing | Intro + CTA |
| Onboarding | 3-step preference collection (interests → vibe/language/area → profile) |
| Home | Personalised feed with search + category filters |
| Event Detail | Full info, map pin, attendance counter, save/arrival |
| Arrival Badge | Code word to identify the group in person |
| Map | All events as pins on a Leaflet map |
| Saved | Bookmarked events |
| Profile | User archetype + preferences + connections |
| Admin | AI event suggestions, host assignment, insights |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No | Claude API key — falls back to mock if absent |
| `CLAUDE_MODEL` | No | Defaults to `claude-haiku-4-5-20251001` |
| `PORT` | No | Server port, defaults to `3001` |

Copy `.env.example` to `.env` and fill in if needed. The app runs fully without an API key.

---

## Privacy

- No user accounts or authentication
- All preferences stored in browser localStorage only
- Free-text profile field is sent to Claude API if configured, never persisted server-side
- All attendance figures are demo data
