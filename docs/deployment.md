# Deployment

## Vercel

1. Import the repository in Vercel.
2. Use the default Next.js framework settings.
3. Deploy the app. The current public routes are `/` and `/design-system`.

The playable prototype is static and does not require Supabase environment variables.

## Storybook

Run `npm run build-storybook` to verify the reusable Midnight Registry design-system story. The generated `storybook-static/` directory is ignored and should not be committed.

## Supabase

The current prototype does not have an active database schema. `supabase/schema.sql` is a placeholder for future persistence work.
