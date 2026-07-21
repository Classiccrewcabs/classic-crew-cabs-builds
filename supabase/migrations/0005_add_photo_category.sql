alter table build_images
  add column if not exists photo_category text not null default 'exterior'
    check (photo_category in ('exterior', 'interior', 'detail'));
