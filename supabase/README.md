# Supabase Setup

`schema.sql` is the baseline database contract for Pocket Town Companions.

## Apply Locally Or In Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Authentication settings, enable the providers you want for the game.
5. Add the public values to Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Use a publishable key in the browser. Never expose a service role or secret key in `NEXT_PUBLIC_*`.

## Migration Workflow

This machine does not currently have the Supabase CLI installed, so no timestamped migration file was generated here. When the CLI is available, create the migration first and copy this SQL into it:

```bash
supabase migration new pocket_town_baseline_schema
```

Then verify with local Supabase or a branch before applying it to production.

## Access Model

- Catalog tables are readable by anonymous and authenticated clients.
- Player progress tables are authenticated-only and protected by RLS.
- Owned rows use `owner_id = auth.uid()`.
- Friend tables allow both sides of a friendship or visit to read related rows.
