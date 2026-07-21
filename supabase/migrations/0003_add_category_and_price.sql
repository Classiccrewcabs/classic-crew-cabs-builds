alter table builds
  add column if not exists category text not null default 'past_build'
    check (category in ('for_sale', 'past_build'));

alter table builds
  add column if not exists price text;
