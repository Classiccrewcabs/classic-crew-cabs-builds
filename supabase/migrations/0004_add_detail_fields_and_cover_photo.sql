alter table builds add column if not exists title text;
alter table builds add column if not exists axles text;
alter table builds add column if not exists brakes text;
alter table builds add column if not exists creature_comforts text;

alter table builds
  add column if not exists cover_image_id uuid references build_images(id) on delete set null;
