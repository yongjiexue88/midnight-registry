# Deployment

## Vercel

1. Import the `pocket-town-companions` repository in Vercel.
2. Use the default Next.js framework settings.
3. Add environment variables from `.env.example`.
4. Deploy. The app uses App Router pages and route handlers under `app/api`.

## GitHub Actions Production Deploy

The repository includes `.github/workflows/deploy-vercel.yml`, which deploys `main` to Vercel.

Required GitHub repository secrets:

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

`NEXT_PUBLIC_*` values are exposed to browser code by Next.js. `SUPABASE_SERVICE_ROLE_KEY` must stay server-only and should never be referenced from client components.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed.sql` to load pet templates, tasks, and inventory items.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` only in server-side environments.
