-- Enable RLS on storage.objects (often restricted by permissions, and usually ignored if already enabled)
-- Only run this if you have the necessary privileges, otherwise skip it.
-- alter table storage.objects enable row level security;

-- Create the products bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 1. Allow Public Read Access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 2. Allow Authenticated Uploads
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'products' );

-- 3. Allow Authenticated Updates
drop policy if exists "Authenticated Update" on storage.objects;
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'products' );

-- 4. Allow Authenticated Deletes
drop policy if exists "Authenticated Delete" on storage.objects;
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'products' );
