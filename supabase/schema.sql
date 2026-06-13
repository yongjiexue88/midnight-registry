-- Pocket Town Companions baseline schema.
-- Run in Supabase SQL Editor, or copy into a migration created with `supabase migration new`.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text not null default 'Town Keeper',
  avatar_url text,
  coins int not null default 500 check (coins >= 0),
  stars int not null default 20 check (stars >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_templates (
  id text primary key,
  name text not null,
  localized_name text,
  species text not null,
  rarity text not null,
  main_stat text not null check (main_stat in ('charm', 'strength', 'intelligence', 'luck')),
  appearance_keywords text[] not null default '{}',
  personality text not null default '',
  specialty_tasks text[] not null default '{}',
  growth_direction text not null default '',
  base_stats jsonb not null default '{}'::jsonb,
  asset_paths jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id text primary key,
  name text not null,
  localized_name text,
  description text not null default '',
  icon text not null,
  asset_path text,
  x numeric(5, 2) not null default 50,
  y numeric(5, 2) not null default 50,
  unlock_level int not null default 1 check (unlock_level >= 1),
  display_order int not null default 0
);

create table if not exists public.task_templates (
  id text primary key,
  name text not null,
  localized_name text,
  type text not null check (type in ('daily', 'care', 'training', 'work', 'adventure', 'event')),
  location_id text not null references public.locations(id),
  recommended_stat text not null check (recommended_stat in ('charm', 'strength', 'intelligence', 'luck')),
  energy_cost int not null default 0 check (energy_cost >= 0),
  duration_minutes int not null default 0 check (duration_minutes >= 0),
  base_success_rate int not null default 50 check (base_success_rate between 0 and 100),
  rewards jsonb not null default '[]'::jsonb,
  unlock_level int not null default 1 check (unlock_level >= 1),
  ui_state text not null default 'available' check (ui_state in ('available', 'in_progress', 'completed', 'locked')),
  created_at timestamptz not null default now()
);

create index if not exists task_templates_location_id_idx on public.task_templates(location_id);

create table if not exists public.inventory_items (
  id text primary key,
  name text not null,
  localized_name text,
  type text not null check (type in ('food', 'toy', 'furniture', 'outfit', 'material', 'pet_shard', 'event_item')),
  rarity text not null default 'common',
  effect jsonb not null default '{}'::jsonb,
  asset_path text,
  icon text not null default 'fa-gift',
  price int not null default 0 check (price >= 0),
  stack_limit int not null default 99 check (stack_limit > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.user_pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_template_id text not null references public.pet_templates(id),
  nickname text not null,
  level int not null default 1 check (level >= 1),
  exp int not null default 0 check (exp >= 0),
  stage text not null default 'baby' check (stage in ('baby', 'teen', 'adult')),
  stats jsonb not null default '{}'::jsonb,
  needs jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_pets_user_id_idx on public.user_pets(user_id);
create index if not exists user_pets_pet_template_id_idx on public.user_pets(pet_template_id);

create table if not exists public.task_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_pet_id uuid references public.user_pets(id) on delete set null,
  task_template_id text not null references public.task_templates(id),
  status text not null default 'completed' check (status in ('in_progress', 'completed', 'claimed', 'failed')),
  success boolean not null default false,
  success_rate int not null default 0 check (success_rate between 0 and 100),
  rewards jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz not null default now(),
  claimed_at timestamptz
);

create index if not exists task_runs_user_created_idx on public.task_runs(user_id, completed_at desc);
create index if not exists task_runs_user_pet_id_idx on public.task_runs(user_pet_id);
create index if not exists task_runs_task_template_id_idx on public.task_runs(task_template_id);

create table if not exists public.user_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null references public.inventory_items(id),
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists user_inventory_item_id_idx on public.user_inventory(item_id);

create table if not exists public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null default 'task',
  source_id text,
  rewards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists reward_claims_user_id_idx on public.reward_claims(user_id);

create table if not exists public.friendships (
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_id, addressee_id),
  constraint friendships_no_self check (requester_id <> addressee_id)
);

create index if not exists friendships_addressee_id_idx on public.friendships(addressee_id);

create table if not exists public.friend_pet_visits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  visitor_id uuid not null references auth.users(id) on delete cascade,
  user_pet_id uuid references public.user_pets(id) on delete set null,
  visit_type text not null default 'hello',
  rewards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists friend_pet_visits_owner_id_idx on public.friend_pet_visits(owner_id);
create index if not exists friend_pet_visits_visitor_id_idx on public.friend_pet_visits(visitor_id);
create index if not exists friend_pet_visits_user_pet_id_idx on public.friend_pet_visits(user_pet_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists user_pets_set_updated_at on public.user_pets;
create trigger user_pets_set_updated_at before update on public.user_pets for each row execute function public.set_updated_at();
drop trigger if exists user_inventory_set_updated_at on public.user_inventory;
create trigger user_inventory_set_updated_at before update on public.user_inventory for each row execute function public.set_updated_at();
drop trigger if exists friendships_set_updated_at on public.friendships;
create trigger friendships_set_updated_at before update on public.friendships for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.pet_templates enable row level security;
alter table public.locations enable row level security;
alter table public.task_templates enable row level security;
alter table public.inventory_items enable row level security;
alter table public.user_pets enable row level security;
alter table public.task_runs enable row level security;
alter table public.user_inventory enable row level security;
alter table public.reward_claims enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_pet_visits enable row level security;

drop policy if exists "Catalog pet templates are readable" on public.pet_templates;
drop policy if exists "Catalog locations are readable" on public.locations;
drop policy if exists "Catalog task templates are readable" on public.task_templates;
drop policy if exists "Catalog inventory items are readable" on public.inventory_items;
drop policy if exists "Profiles are visible to owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are editable by owner" on public.profiles;
drop policy if exists "User pets are visible to owner" on public.user_pets;
drop policy if exists "User pets are insertable by owner" on public.user_pets;
drop policy if exists "User pets are editable by owner" on public.user_pets;
drop policy if exists "User pets are deletable by owner" on public.user_pets;
drop policy if exists "Task runs are visible to owner" on public.task_runs;
drop policy if exists "Task runs are insertable by owner" on public.task_runs;
drop policy if exists "Inventory is visible to owner" on public.user_inventory;
drop policy if exists "Inventory is insertable by owner" on public.user_inventory;
drop policy if exists "Inventory is editable by owner" on public.user_inventory;
drop policy if exists "Reward claims are visible to owner" on public.reward_claims;
drop policy if exists "Reward claims are insertable by owner" on public.reward_claims;
drop policy if exists "Friendships are visible to related users" on public.friendships;
drop policy if exists "Friendships are requestable by requester" on public.friendships;
drop policy if exists "Friendships are editable by related users" on public.friendships;
drop policy if exists "Friend visits are visible to related users" on public.friend_pet_visits;
drop policy if exists "Friend visits are insertable by visitor" on public.friend_pet_visits;

create policy "Catalog pet templates are readable" on public.pet_templates for select using (true);
create policy "Catalog locations are readable" on public.locations for select using (true);
create policy "Catalog task templates are readable" on public.task_templates for select using (true);
create policy "Catalog inventory items are readable" on public.inventory_items for select using (true);

create policy "Profiles are visible to owner" on public.profiles for select using ((select auth.uid()) = id);
create policy "Profiles are insertable by owner" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "Profiles are editable by owner" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "User pets are visible to owner" on public.user_pets for select using ((select auth.uid()) = user_id);
create policy "User pets are insertable by owner" on public.user_pets for insert with check ((select auth.uid()) = user_id);
create policy "User pets are editable by owner" on public.user_pets for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "User pets are deletable by owner" on public.user_pets for delete using ((select auth.uid()) = user_id);

create policy "Task runs are visible to owner" on public.task_runs for select using ((select auth.uid()) = user_id);
create policy "Task runs are insertable by owner" on public.task_runs for insert with check ((select auth.uid()) = user_id);

create policy "Inventory is visible to owner" on public.user_inventory for select using ((select auth.uid()) = user_id);
create policy "Inventory is insertable by owner" on public.user_inventory for insert with check ((select auth.uid()) = user_id);
create policy "Inventory is editable by owner" on public.user_inventory for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Reward claims are visible to owner" on public.reward_claims for select using ((select auth.uid()) = user_id);
create policy "Reward claims are insertable by owner" on public.reward_claims for insert with check ((select auth.uid()) = user_id);

create policy "Friendships are visible to related users" on public.friendships for select using ((select auth.uid()) in (requester_id, addressee_id));
create policy "Friendships are requestable by requester" on public.friendships for insert with check ((select auth.uid()) = requester_id);
create policy "Friendships are editable by related users" on public.friendships for update using ((select auth.uid()) in (requester_id, addressee_id)) with check ((select auth.uid()) in (requester_id, addressee_id));

create policy "Friend visits are visible to related users" on public.friend_pet_visits for select using ((select auth.uid()) in (owner_id, visitor_id));
create policy "Friend visits are insertable by visitor" on public.friend_pet_visits for insert with check ((select auth.uid()) = visitor_id);

grant usage on schema public to anon, authenticated;
grant select on public.pet_templates, public.locations, public.task_templates, public.inventory_items to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_pets to authenticated;
grant select, insert on public.task_runs, public.reward_claims to authenticated;
grant select, insert, update on public.user_inventory, public.friendships to authenticated;
grant select, insert on public.friend_pet_visits to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into public.pet_templates (id, name, localized_name, species, rarity, main_stat, appearance_keywords, personality, specialty_tasks, growth_direction, base_stats, asset_paths) values
  ('biscuit', 'Biscuit Corgi', '饼干柯基', 'Corgi', 'good', 'strength', array['round corgi', 'cookie coat', 'friendly smile'], 'Warm, outgoing, and eager to greet every visitor.', array['cafe', 'reception', 'performance'], 'Social work and steady growth.', '{"charm":18,"strength":24,"intelligence":16,"luck":14}'::jsonb, '{"avatar":"/assets/pets/pet-biscuit-corgi.png","idle":"/assets/pets/pet-biscuit-corgi.png"}'::jsonb),
  ('mochi', 'Mochi Kitten', '麻薯小猫', 'Kitten', 'rare', 'charm', array['soft kitten', 'mochi cheeks', 'curious eyes'], 'Quiet, observant, and happiest around books and puzzles.', array['library', 'research', 'puzzle'], 'Charm and intelligence growth.', '{"charm":25,"strength":11,"intelligence":20,"luck":18}'::jsonb, '{"avatar":"/assets/pets/pet-mochi-kitten.png","idle":"/assets/pets/pet-mochi-kitten.png"}'::jsonb),
  ('pudding', 'Pudding Bunny', '布丁兔', 'Bunny', 'common', 'luck', array['cream bunny', 'pudding ears', 'tiny satchel'], 'Cheerful collector who finds surprises in ordinary places.', array['treasure', 'gathering', 'festival'], 'Luck growth for event drops.', '{"charm":19,"strength":12,"intelligence":15,"luck":24}'::jsonb, '{"avatar":"/assets/pets/pet-pudding-bunny.png","idle":"/assets/pets/pet-pudding-bunny.png"}'::jsonb),
  ('nugget', 'Nugget Shiba', '鸡块柴犬', 'Shiba', 'good', 'strength', array['golden shiba', 'brave scarf', 'sturdy paws'], 'Bold, loyal, and ready to protect the town.', array['patrol', 'delivery', 'guardian'], 'Strength and adventure growth.', '{"charm":16,"strength":28,"intelligence":17,"luck":13}'::jsonb, '{"avatar":"/assets/pets/pet-nugget-shiba.png","idle":"/assets/pets/pet-nugget-shiba.png"}'::jsonb),
  ('coco', 'Coco Panda', '可可熊猫', 'Panda', 'epic', 'luck', array['cocoa panda', 'apron', 'gentle face'], 'Patient caretaker who loves kitchens, farms, and routines.', array['farm', 'kitchen', 'crafting'], 'Balanced crafting and management growth.', '{"charm":24,"strength":21,"intelligence":19,"luck":32}'::jsonb, '{"avatar":"/assets/pets/pet-coco-panda.png","idle":"/assets/pets/pet-coco-panda.png"}'::jsonb),
  ('peanut', 'Peanut Hedgehog', '花生刺猬', 'Hedgehog', 'rare', 'intelligence', array['small hedgehog', 'night lantern', 'peanut colors'], 'Shy explorer who notices secret paths after sunset.', array['night_task', 'secret_event', 'special_drop'], 'Rare exploration growth.', '{"charm":14,"strength":15,"intelligence":29,"luck":18}'::jsonb, '{"avatar":"/assets/pets/pet-peanut-hedgehog.png","idle":"/assets/pets/pet-peanut-hedgehog.png"}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  localized_name = excluded.localized_name,
  species = excluded.species,
  rarity = excluded.rarity,
  main_stat = excluded.main_stat,
  appearance_keywords = excluded.appearance_keywords,
  personality = excluded.personality,
  specialty_tasks = excluded.specialty_tasks,
  growth_direction = excluded.growth_direction,
  base_stats = excluded.base_stats,
  asset_paths = excluded.asset_paths;

insert into public.locations (id, name, localized_name, description, icon, asset_path, x, y, unlock_level, display_order) values
  ('town_plaza', 'Town Plaza', '小镇广场', 'Main hangout for quick play, visits, and daily care.', 'fa-location-dot', '/assets/locations/town-plaza-scene.png', 66, 66, 1, 10),
  ('snack_stall', 'Snack Stall', '零食摊', 'Buy cozy food and complete hunger care tasks.', 'fa-burger', null, 20, 43, 1, 20),
  ('pet_clinic', 'Pet Clinic', '宠物诊所', 'Bath, checkups, and recovery events.', 'fa-kit-medical', null, 72, 34, 1, 30),
  ('study_corner', 'Study Corner', '学习角', 'Train intelligence and unlock puzzle tasks.', 'fa-book', null, 44, 25, 1, 40),
  ('job_board', 'Job Board', '任务板', 'Part-time work and town errands.', 'fa-clipboard-list', null, 29, 70, 1, 50),
  ('forest_gate', 'Forest Gate', '森林入口', 'Adventure tasks with higher rewards.', 'fa-tree', null, 82, 71, 4, 60)
on conflict (id) do update set
  name = excluded.name,
  localized_name = excluded.localized_name,
  description = excluded.description,
  icon = excluded.icon,
  asset_path = excluded.asset_path,
  x = excluded.x,
  y = excluded.y,
  unlock_level = excluded.unlock_level,
  display_order = excluded.display_order;

insert into public.inventory_items (id, name, localized_name, type, rarity, effect, icon, price, stack_limit) values
  ('town_burger', 'Town Burger', '小镇汉堡', 'food', 'common', '{"hunger":18,"energy":4}'::jsonb, 'fa-burger', 40, 99),
  ('cloud_brush', 'Cloud Brush', '云朵刷', 'toy', 'good', '{"cleanliness":20,"bond":3}'::jsonb, 'fa-wand-magic-sparkles', 80, 99),
  ('bounce_ball', 'Bounce Ball', '弹弹球', 'toy', 'common', '{"mood":18,"energy":-5,"bond":4}'::jsonb, 'fa-baseball', 55, 99),
  ('study_specs', 'Study Specs', '学习眼镜', 'outfit', 'rare', '{"intelligence":3}'::jsonb, 'fa-glasses', 220, 20),
  ('ribbon_bow', 'Ribbon Bow', '丝带蝴蝶结', 'outfit', 'rare', '{"charm":3,"mood":4}'::jsonb, 'fa-ribbon', 180, 20),
  ('cozy_bed', 'Cozy Bed', '温暖小床', 'furniture', 'good', '{"energy":30}'::jsonb, 'fa-couch', 260, 10),
  ('lucky_carrot', 'Lucky Carrot', '幸运胡萝卜', 'food', 'epic', '{"luck":4,"hunger":10}'::jsonb, 'fa-carrot', 320, 30),
  ('plaza_ticket', 'Plaza Ticket', '广场票券', 'material', 'common', '{"mood":10}'::jsonb, 'fa-ticket', 25, 99)
on conflict (id) do update set
  name = excluded.name,
  localized_name = excluded.localized_name,
  type = excluded.type,
  rarity = excluded.rarity,
  effect = excluded.effect,
  icon = excluded.icon,
  price = excluded.price,
  stack_limit = excluded.stack_limit;

insert into public.task_templates (id, name, localized_name, type, location_id, recommended_stat, energy_cost, duration_minutes, base_success_rate, rewards, unlock_level, ui_state) values
  ('daily_breakfast', 'Daily Breakfast', '每日早餐', 'daily', 'snack_stall', 'charm', 8, 5, 42, '[{"type":"coins","amount":60},{"type":"stars","amount":8},{"type":"exp","amount":25},{"type":"food","itemId":"town_burger","amount":1,"rarity":"common"}]'::jsonb, 1, 'available'),
  ('bubble_bath', 'Bubble Bath Shift', '泡泡洗澡班', 'care', 'pet_clinic', 'luck', 10, 8, 40, '[{"type":"coins","amount":70},{"type":"exp","amount":30},{"type":"toy","itemId":"cloud_brush","amount":1,"rarity":"good"}]'::jsonb, 1, 'available'),
  ('charm_practice', 'Charm Practice', '魅力练习', 'training', 'town_plaza', 'charm', 14, 12, 35, '[{"type":"stars","amount":18},{"type":"exp","amount":45}]'::jsonb, 2, 'available'),
  ('parcel_helper', 'Parcel Helper', '快递帮手', 'work', 'job_board', 'strength', 18, 20, 32, '[{"type":"coins","amount":160},{"type":"stars","amount":14},{"type":"exp","amount":55}]'::jsonb, 3, 'available'),
  ('library_puzzle', 'Library Puzzle', '图书馆谜题', 'training', 'study_corner', 'intelligence', 16, 15, 34, '[{"type":"stars","amount":22},{"type":"exp","amount":50},{"type":"outfit","itemId":"study_specs","amount":1,"rarity":"rare"}]'::jsonb, 3, 'available'),
  ('forest_foraging', 'Forest Foraging', '森林采集', 'adventure', 'forest_gate', 'luck', 24, 30, 26, '[{"type":"coins","amount":220},{"type":"stars","amount":35},{"type":"exp","amount":80},{"type":"food","itemId":"lucky_carrot","amount":1,"rarity":"epic"}]'::jsonb, 4, 'locked'),
  ('weekend_carnival', 'Weekend Carnival', '周末嘉年华', 'event', 'town_plaza', 'charm', 12, 10, 45, '[{"type":"coins","amount":120},{"type":"stars","amount":30},{"type":"exp","amount":35},{"type":"pet_shard","itemId":"plaza_ticket","amount":2,"rarity":"rare"}]'::jsonb, 1, 'available')
on conflict (id) do update set
  name = excluded.name,
  localized_name = excluded.localized_name,
  type = excluded.type,
  location_id = excluded.location_id,
  recommended_stat = excluded.recommended_stat,
  energy_cost = excluded.energy_cost,
  duration_minutes = excluded.duration_minutes,
  base_success_rate = excluded.base_success_rate,
  rewards = excluded.rewards,
  unlock_level = excluded.unlock_level,
  ui_state = excluded.ui_state;
