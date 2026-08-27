-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  tier text check (tier in ('free', 'pro', 'business', 'enterprise')) default 'free' not null,
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')) default 'active' not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Translations table
create table public.translations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('pending', 'transcribing', 'translating', 'dubbing', 'merging', 'completed', 'failed')) default 'pending' not null,
  source_url text,
  source_file_path text,
  source_language text,
  target_language text not null,
  duration_seconds integer,
  output_file_path text,
  error_message text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- Usage table
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  month text not null, -- YYYY-MM format
  minutes_used numeric(10, 2) default 0 not null,
  translations_count integer default 0 not null,
  unique(user_id, month)
);

-- Row-level security
alter table public.subscriptions enable row level security;
alter table public.translations enable row level security;
alter table public.usage enable row level security;

-- Users can only read/write their own data
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can view own translations" on public.translations
  for select using (auth.uid() = user_id);

create policy "Users can insert own translations" on public.translations
  for insert with check (auth.uid() = user_id);

create policy "Users can view own usage" on public.usage
  for select using (auth.uid() = user_id);

-- Create subscription row on signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Indexes
create index idx_translations_user_id on public.translations(user_id);
create index idx_translations_status on public.translations(status);
create index idx_usage_user_month on public.usage(user_id, month);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
