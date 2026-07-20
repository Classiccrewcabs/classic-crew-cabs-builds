-- Classic Crew Cabs - Past Builds schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  year integer not null,
  make text not null,
  model text not null,
  package text,
  exterior_color text,
  engine text,
  transmission text,
  interior text,
  description text,
  status text not null default 'available' check (status in ('available', 'sold', 'featured')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists build_images (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references builds(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists build_images_build_id_idx on build_images(build_id);

-- keep updated_at current
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists builds_set_updated_at on builds;
create trigger builds_set_updated_at
  before update on builds
  for each row
  execute function set_updated_at();

-- Row Level Security: anyone can read, only a logged-in (authenticated) user can write.
-- Since this site only ever has one admin account (you), "authenticated" == "owner".
alter table builds enable row level security;
alter table build_images enable row level security;

drop policy if exists "builds are publicly readable" on builds;
create policy "builds are publicly readable"
  on builds for select
  using (true);

drop policy if exists "builds are writable by authenticated users" on builds;
create policy "builds are writable by authenticated users"
  on builds for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "build_images are publicly readable" on build_images;
create policy "build_images are publicly readable"
  on build_images for select
  using (true);

drop policy if exists "build_images are writable by authenticated users" on build_images;
create policy "build_images are writable by authenticated users"
  on build_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for photos: public read, authenticated write
insert into storage.buckets (id, name, public)
values ('build-photos', 'build-photos', true)
on conflict (id) do nothing;

drop policy if exists "build photos are publicly readable" on storage.objects;
create policy "build photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'build-photos');

drop policy if exists "build photos are writable by authenticated users" on storage.objects;
create policy "build photos are writable by authenticated users"
  on storage.objects for all
  using (bucket_id = 'build-photos' and auth.role() = 'authenticated')
  with check (bucket_id = 'build-photos' and auth.role() = 'authenticated');
