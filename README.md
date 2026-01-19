# StudyFlow

StudyFlow is een task manager en dagplanner voor studenten en werkenden. Je kunt taken plannen per dag, prioriteit en status aanpassen, en voortgang bekijken via eenvoudige statistieken.

**Live:** https://studyflow.jaycey.nl
**Repo:** https://github.com/jaycey3/studyflow

---

## Features

- OTP login (Supabase Auth)
- Taken aanmaken, bewerken en verwijderen (CRUD)
- Taken per dag bekijken
- Prioriteit en status aanpassen (via sneller interactie in de UI)
- Feedback/statistieken over voortgang

---

## Tech stack

- **Next.js** 
- **Supabase** (Database + Authentication)
- **HeroUI V3** + **Tailwind CSS** (UI)

---

## Projectstructuur

- `app/` – routes/pages (Next.js App Router)
- `components/` – herbruikbare UI componenten
- `lib/` – helpers (Supabase client / utilities)
- `public/` – statische assets
- `styles/` – globale styling (Tailwind & HeroUI)

---

## Lokale setup

### Vereisten
- Node.js (LTS)
- pnpm (aanbevolen)

### Installatie
```bash
git clone https://github.com/jaycey3/studyflow.git
cd studyflow
pnpm install
pnpm dev
```

## Environment variables

StudyFlow maakt gebruik van Supabase. Om het lokaal te gebruiken moet je een `.env.local` bestand aanmaken met de volgende variabelen:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Scripts

- `pnpm dev` – start de development server
- `pnpm build` – maakt een production build
- `pnpm start` – start de production server
- `pnpm lint` – controleert de code met ESLint

## Testing

Voor dit project zijn de volgende testmethodes toegepast:
- Linting met ESLint
- Type-safety met TypeScript
- Handmatige tests en usertests met eindgebruikers