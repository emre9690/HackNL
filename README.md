# StadSpas — Discover Rotterdam

A hackathon MVP that helps residents (especially newcomers and international students) discover low-pressure, recurring social routines and spaces in Rotterdam. Built with a phone-mockup UI for demo purposes.

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Framer Motion
- **Map**: React Leaflet with OpenStreetMap tiles (no paid API key needed)
- **Icons**: lucide-react
- **Backend**: Node.js + Express
- **AI**: Anthropic Claude (optional — falls back to mock if no API key)
- **Persistence**: localStorage (no database, no auth)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Copy env file and add your Anthropic key
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=your_key_here

# 3. Start both frontend and backend
npm run dev
```

The app runs at **http://localhost:5173** and the server at **http://localhost:3001**.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | Claude API key. If absent, mock AI responses are used. |
| `CLAUDE_MODEL` | No | Defaults to `claude-haiku-4-5-20251001` |
| `PORT` | No | Server port. Defaults to `3001` |

## Demo Flow

Use the **Demo Controls** panel (bottom-right corner) to navigate:

1. **Auto Demo** — cycles through all screens automatically (2s each)
2. **Resident** — jump to the resident home screen
3. **Admin** — switch to the city dashboard view
4. **Reset** — clear localStorage and restart from landing

### Resident flow
Landing → Onboarding (3 steps) → Home → Event Detail → Arrival Badge

### Admin flow
Admin Dashboard → Suggestions (approve/reject AI proposals) → Insights (anonymised analytics)

## Screens

| Screen | Description |
|---|---|
| Landing | App intro with CTA |
| Onboarding | 3-step preference collection |
| Home | Filtered event feed with search |
| Event Detail | Full event info + map + save/arrival actions |
| Arrival Badge | Code word screen to find the group |
| Map | Leaflet map with all event markers |
| Saved | Bookmarked events |
| Profile | User archetype + preferences |
| Admin | AI suggestions + approved events + insights |

## Privacy Notes

- No user accounts or authentication
- Preferences are stored in browser localStorage only
- The free-text profile field is sent to Claude API (if configured) but not persisted server-side
- All attendance figures are demo data

## Project Structure

```
/
  src/
    components/   # Reusable UI components
    pages/        # Screen components
    data/         # Static mock data
    types/        # TypeScript interfaces
  server/
    routes/       # Express route handlers
    index.js      # Server entry point
```
