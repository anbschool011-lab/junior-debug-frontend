# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Bun installed - [install Bun](https://bun.sh/docs/installation)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun install

# Step 4: Start the development server with auto-reloading and an instant preview.
bun run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Bun 1.3.4
- Vite 7.2.7
- TypeScript
- React 19.2.1
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can publish this site using Vercel (recommended) or other static hosting. The repo includes `frontend/vercel.json` configured to use Vercel's static-build with Vite output (`dist`).

Vercel quick steps:

1. Push this repository to GitHub.
2. In Vercel, import the repository and select the `frontend` directory as the root (or set the Project's "Root Directory" to `frontend`).
3. Use these Project settings:
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add any environment variables the frontend requires (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel Project Settings.
5. Deploy.

Notes:

- This project was scaffolded with Bun in mind, but Vercel commonly installs with `npm` or `pnpm`. The `vercel.json` uses `@vercel/static-build` so `npm run build` will be executed — ensure `node` and `npm` are selected in the Vercel project settings if prompts appear.
- You can still develop locally with Bun: `bun install` and `bun run dev`.

## Environment variables

This project expects the following Vite environment variables to be set for both local development and when deploying on Vercel:

- `VITE_BACKEND_URL` — URL of your backend service (Render). Do not include a trailing slash.
- `VITE_SUPABASE_URL` — (optional) your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — (optional) your Supabase anon key.

Local development:

1. Copy `frontend/.env.example` to `frontend/.env` and replace the placeholder values.
2. Run `bun install` (or `npm ci`) and `bun run dev` (or `npm run dev`).

Vercel:

1. In Vercel, open the Project → Settings → Environment Variables.
2. Add `VITE_BACKEND_URL` (and any `VITE_...` vars) for the appropriate Environment (Preview/Production).
3. Redeploy the project.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
