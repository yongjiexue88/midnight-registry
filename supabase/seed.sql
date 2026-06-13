insert into pet_templates (id, name, species, rarity, main_stat, base_stats, asset_paths) values
  ('biscuit', 'Biscuit', 'Corgi', 'good', 'strength', '{"charm":18,"strength":24,"intelligence":16,"luck":14}', '{"avatar":"/assets/pets/pet-biscuit-corgi.png","idle":"/assets/pets/pet-biscuit-corgi.png"}'),
  ('mochi', 'Mochi', 'Kitten', 'rare', 'charm', '{"charm":25,"strength":11,"intelligence":20,"luck":18}', '{"avatar":"/assets/pets/pet-mochi-kitten.png","idle":"/assets/pets/pet-mochi-kitten.png"}'),
  ('pudding', 'Pudding', 'Bunny', 'common', 'luck', '{"charm":19,"strength":12,"intelligence":15,"luck":24}', '{"avatar":"/assets/pets/pet-pudding-bunny.png","idle":"/assets/pets/pet-pudding-bunny.png"}'),
  ('nugget', 'Nugget', 'Shiba', 'good', 'strength', '{"charm":16,"strength":28,"intelligence":17,"luck":13}', '{"avatar":"/assets/pets/pet-nugget-shiba.png","idle":"/assets/pets/pet-nugget-shiba.png"}'),
  ('coco', 'Coco', 'Panda', 'epic', 'luck', '{"charm":24,"strength":21,"intelligence":19,"luck":32}', '{"avatar":"/assets/pets/pet-coco-panda.png","idle":"/assets/pets/pet-coco-panda.png"}'),
  ('peanut', 'Peanut', 'Hedgehog', 'rare', 'intelligence', '{"charm":14,"strength":15,"intelligence":29,"luck":18}', '{"avatar":"/assets/pets/pet-peanut-hedgehog.png","idle":"/assets/pets/pet-peanut-hedgehog.png"}')
on conflict (id) do update set
  name = excluded.name,
  species = excluded.species,
  rarity = excluded.rarity,
  main_stat = excluded.main_stat,
  base_stats = excluded.base_stats,
  asset_paths = excluded.asset_paths;

insert into task_templates (id, name, type, location_id, recommended_stat, energy_cost, duration_minutes, base_success_rate, rewards, unlock_level) values
  ('daily_breakfast', 'Daily Breakfast', 'daily', 'snack_stall', 'charm', 8, 5, 42, '[{"type":"coins","amount":60},{"type":"stars","amount":8},{"type":"exp","amount":25},{"type":"food","itemId":"town_burger","amount":1,"rarity":"common"}]', 1),
  ('bubble_bath', 'Bubble Bath Shift', 'care', 'pet_clinic', 'luck', 10, 8, 40, '[{"type":"coins","amount":70},{"type":"exp","amount":30},{"type":"toy","itemId":"cloud_brush","amount":1,"rarity":"good"}]', 1),
  ('charm_practice', 'Charm Practice', 'training', 'town_plaza', 'charm', 14, 12, 35, '[{"type":"stars","amount":18},{"type":"exp","amount":45}]', 2),
  ('parcel_helper', 'Parcel Helper', 'work', 'job_board', 'strength', 18, 20, 32, '[{"type":"coins","amount":160},{"type":"stars","amount":14},{"type":"exp","amount":55}]', 3),
  ('library_puzzle', 'Library Puzzle', 'training', 'study_corner', 'intelligence', 16, 15, 34, '[{"type":"stars","amount":22},{"type":"exp","amount":50},{"type":"outfit","itemId":"study_specs","amount":1,"rarity":"rare"}]', 3),
  ('forest_foraging', 'Forest Foraging', 'adventure', 'forest_gate', 'luck', 24, 30, 26, '[{"type":"coins","amount":220},{"type":"stars","amount":35},{"type":"exp","amount":80},{"type":"food","itemId":"lucky_carrot","amount":1,"rarity":"epic"}]', 4)
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  location_id = excluded.location_id,
  recommended_stat = excluded.recommended_stat,
  energy_cost = excluded.energy_cost,
  duration_minutes = excluded.duration_minutes,
  base_success_rate = excluded.base_success_rate,
  rewards = excluded.rewards,
  unlock_level = excluded.unlock_level;

insert into inventory_items (id, name, type, rarity, effect, asset_path) values
  ('town_burger', 'Town Burger', 'food', 'common', '{"hunger":18,"energy":4}', null),
  ('cloud_brush', 'Cloud Brush', 'toy', 'good', '{"cleanliness":20,"bond":3}', null),
  ('bounce_ball', 'Bounce Ball', 'toy', 'common', '{"mood":18,"energy":-5,"bond":4}', null),
  ('study_specs', 'Study Specs', 'outfit', 'rare', '{"intelligence":3}', null),
  ('ribbon_bow', 'Ribbon Bow', 'outfit', 'rare', '{"charm":3,"mood":4}', null),
  ('cozy_bed', 'Cozy Bed', 'furniture', 'good', '{"energy":30}', null),
  ('lucky_carrot', 'Lucky Carrot', 'food', 'epic', '{"luck":4,"hunger":10}', null),
  ('plaza_ticket', 'Plaza Ticket', 'material', 'common', '{"mood":10}', null)
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  rarity = excluded.rarity,
  effect = excluded.effect,
  asset_path = excluded.asset_path;
