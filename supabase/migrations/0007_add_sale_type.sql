alter table builds
  add column if not exists sale_type text not null default 'turn_key'
    check (sale_type in ('turn_key', 'project'));
