-- Run this ONCE in YOUR Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- (Kept outside supabase/migrations on purpose so it is never applied to Lovable Cloud.)

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('CT-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6))),
  booking_type text not null check (booking_type in ('small_party', 'big_party')),
  guest_count integer not null,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 255),
  phone text not null check (char_length(phone) between 6 and 30),
  reservation_date date not null,
  reservation_time time not null,
  event_type text check (event_type is null or char_length(event_type) <= 60),
  special_requests text check (special_requests is null or char_length(special_requests) <= 1000),
  dietary_requirements text check (dietary_requirements is null or char_length(dietary_requirements) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Guest limits: Small Party 1-20, Big Party 21-150 (same rule as the website and server)
  constraint reservations_guest_limits check (
    (booking_type = 'small_party' and guest_count between 1 and 20)
    or (booking_type = 'big_party' and guest_count between 21 and 150)
  ),
  constraint reservations_big_party_event check (booking_type <> 'big_party' or event_type is not null)
);

-- Only the website's server (service role) touches this table. No public access.
alter table public.reservations enable row level security;
revoke all on public.reservations from anon, authenticated;
grant all on public.reservations to service_role;
