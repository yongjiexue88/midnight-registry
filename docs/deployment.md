# Deployment

## Vercel

1. Import the `pocket-town-companions` repository in Vercel.
2. Use the default Next.js framework settings.
3. Add environment variables from `.env.example`.
4. Deploy. The app uses App Router pages and route handlers under `app/api`.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed.sql` to load pet templates, tasks, and inventory items.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` only in server-side environments.
