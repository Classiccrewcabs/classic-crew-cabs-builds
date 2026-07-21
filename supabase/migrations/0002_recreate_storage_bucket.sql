-- The build-photos bucket + its policies from 0001_init.sql didn't take
-- effect on the live project (bucket was missing). Re-apply, safely
-- idempotent so it's harmless if it already exists.

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
