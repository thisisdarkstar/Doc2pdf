# DocToPDF Frontend

Next.js frontend for the DocToPDF operator console.

This app lets you:

- submit a documentation root URL to the backend
- choose Markdown, PDF, or both
- watch live job progress
- cancel an active conversion
- download generated artifacts
- review warnings surfaced by the backend

## Stack

- Next.js 16
- React 19
- TypeScript

## Environment

Create a local env file from the example:

```bash
cp .env.example .env.local
```

Required variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

For production, point this to your deployed backend API, for example:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/api
```

If your backend is hosted on Hugging Face Spaces, it will usually look like:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-space-name.hf.space/api
```

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

## Production build

Create a production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Deploying to Vercel

This frontend is a good fit for Vercel.

### Recommended setup

1. Create a separate repo from the contents of `frontend/`.
2. Import that repo into Vercel.
3. Set the root directory to the repo root if `frontend/` is the full repo.
4. Add:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/api
```

5. Redeploy.

## Backend expectations

The frontend expects these backend routes:

- `POST /api/jobs`
- `GET /api/jobs/{job_id}`
- `POST /api/jobs/{job_id}/cancel`
- `GET /api/jobs/{job_id}/artifacts/{artifact_name}`

The backend must also allow your frontend origin through CORS.

Example backend setting:

```bash
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

## Project structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  job-console.tsx
  theme-provider.tsx
  theme-toggle.tsx
lib/
  api.ts
  types.ts
```

## Main behavior

### Job flow

- the form submits a new conversion job to the backend
- the UI polls the job automatically every 2 seconds
- active jobs can be cancelled from the frontend
- completed jobs expose download links for generated artifacts

### UI

- dark/light theme toggle
- responsive layout for desktop, tablet, and mobile
- progress bar and phase labels
- warnings list from backend output

## Notes

- This frontend stores no secrets; only `NEXT_PUBLIC_*` values should be used here.
- Keep backend-only settings in the backend repo, not in this frontend repo.
