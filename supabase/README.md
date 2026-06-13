# Supabase Notes

The current Midnight Registry prototype runs without a database.

`schema.sql` is intentionally a placeholder until the game needs persistent saves, shift results, resident archives, or account-backed progress. Do not apply the old Pocket Town schema or seed data to new projects.

When persistence is added, create a new migration around the Midnight Registry domain model instead of reviving the archived pet-care tables.
