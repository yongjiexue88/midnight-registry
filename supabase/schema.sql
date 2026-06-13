create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  coins int default 500,
  stars int default 20,
  created_at timestamptz default now()
);

create table pet_templates (
  id text primary key,
  name text not null,
  species text not null,
  rarity text not null,
  main_stat text not null,
  base_stats jsonb not null,
  asset_paths jsonb not null,
  created_at timestamptz default now()
);

create table user_pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  pet_template_id text references pet_templates(id),
  nickname text,
  level int default 1,
  exp int default 0,
  stats jsonb not null,
  needs jsonb not null,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table task_templates (
  id text primary key,
  name text not null,
  type text not null,
  location_id text not null,
  recommended_stat text not null,
  energy_cost int not null,
  duration_minutes int not null,
  base_success_rate int not null,
  rewards jsonb not null,
  unlock_level int default 1,
  created_at timestamptz default now()
);

create table task_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_pet_id uuid references user_pets(id) on delete cascade,
  task_template_id text references task_templates(id),
  success boolean not null,
  rewards jsonb not null,
  created_at timestamptz default now()
);

create table inventory_items (
  id text primary key,
  name text not null,
  type text not null,
  rarity text not null,
  effect jsonb,
  asset_path text,
  created_at timestamptz default now()
);

create table user_inventory (
  user_id uuid references auth.users(id) on delete cascade,
  item_id text references inventory_items(id),
  quantity int default 0,
  primary key (user_id, item_id)
);

alter table profiles enable row level security;
alter table user_pets enable row level security;
alter table task_runs enable row level security;
alter table user_inventory enable row level security;

create policy "profiles are visible to owner" on profiles
  for select using (auth.uid() = id);
create policy "profiles are editable by owner" on profiles
  for update using (auth.uid() = id);

create policy "user pets are visible to owner" on user_pets
  for select using (auth.uid() = user_id);
create policy "user pets are editable by owner" on user_pets
  for all using (auth.uid() = user_id);

create policy "task runs are visible to owner" on task_runs
  for select using (auth.uid() = user_id);
create policy "task runs are insertable by owner" on task_runs
  for insert with check (auth.uid() = user_id);

create policy "inventory is visible to owner" on user_inventory
  for select using (auth.uid() = user_id);
create policy "inventory is editable by owner" on user_inventory
  for all using (auth.uid() = user_id);
