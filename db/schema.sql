-- Enable Row Level Security (RLS) and define baseline schema for a simple PFM app
-- Tables: profiles, categories, transactions
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using ( id = auth.uid() );

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using ( id = auth.uid() );

drop policy if exists "Profiles are insertable by self" on public.profiles;
create policy "Profiles are insertable by self"
  on public.profiles for insert
  with check ( id = auth.uid() );

-- Categories
create table if not exists public.categories (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income','expense')),
  icon text,
  created_at timestamptz not null default now()
);

create index if not exists categories_profile_id_idx on public.categories(profile_id);

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by owner" on public.categories;
create policy "Categories are viewable by owner"
  on public.categories for select
  using ( profile_id = auth.uid() );

drop policy if exists "Categories are insertable by owner" on public.categories;
create policy "Categories are insertable by owner"
  on public.categories for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Categories are updatable by owner" on public.categories;
create policy "Categories are updatable by owner"
  on public.categories for update
  using ( profile_id = auth.uid() );

drop policy if exists "Categories are deletable by owner" on public.categories;
create policy "Categories are deletable by owner"
  on public.categories for delete
  using ( profile_id = auth.uid() );

-- Transactions
create table if not exists public.transactions (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null,
  type text not null check (type in ('income','expense')),
  category_id bigint references public.categories(id) on delete set null,
  occurred_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_profile_id_idx on public.transactions(profile_id);
create index if not exists transactions_occurred_at_idx on public.transactions(occurred_at);

alter table public.transactions enable row level security;

drop policy if exists "Transactions are viewable by owner" on public.transactions;
create policy "Transactions are viewable by owner"
  on public.transactions for select
  using ( profile_id = auth.uid() );

drop policy if exists "Transactions are insertable by owner" on public.transactions;
create policy "Transactions are insertable by owner"
  on public.transactions for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Transactions are updatable by owner" on public.transactions;
create policy "Transactions are updatable by owner"
  on public.transactions for update
  using ( profile_id = auth.uid() );

drop policy if exists "Transactions are deletable by owner" on public.transactions;
create policy "Transactions are deletable by owner"
  on public.transactions for delete
  using ( profile_id = auth.uid() );

-- Budgets
create table if not exists public.budgets (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  limit_amount numeric(14,2) not null,
  month text not null,
  created_at timestamptz not null default now()
);

create index if not exists budgets_profile_id_idx on public.budgets(profile_id);
create index if not exists budgets_month_idx on public.budgets(month);

alter table public.budgets enable row level security;

drop policy if exists "Budgets are viewable by owner" on public.budgets;
create policy "Budgets are viewable by owner"
  on public.budgets for select
  using ( profile_id = auth.uid() );

drop policy if exists "Budgets are insertable by owner" on public.budgets;
create policy "Budgets are insertable by owner"
  on public.budgets for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Budgets are updatable by owner" on public.budgets;
create policy "Budgets are updatable by owner"
  on public.budgets for update
  using ( profile_id = auth.uid() );

drop policy if exists "Budgets are deletable by owner" on public.budgets;
create policy "Budgets are deletable by owner"
  on public.budgets for delete
  using ( profile_id = auth.uid() );

-- Auto-create a profile when a new user registers in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce((new.raw_user_meta_data->>'full_name')::text, null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Investments
create table if not exists public.investments (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('fd', 'mutual_fund', 'stocks', 'ppf', 'gold', 'crypto', 'nps', 'bonds', 'others')),
  amount numeric(14,2) not null,
  current_value numeric(14,2) not null,
  expected_return numeric(14,2) not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists investments_profile_id_idx on public.investments(profile_id);

alter table public.investments enable row level security;

drop policy if exists "Investments are viewable by owner" on public.investments;
create policy "Investments are viewable by owner"
  on public.investments for select
  using ( profile_id = auth.uid() );

drop policy if exists "Investments are insertable by owner" on public.investments;
create policy "Investments are insertable by owner"
  on public.investments for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Investments are updatable by owner" on public.investments;
create policy "Investments are updatable by owner"
  on public.investments for update
  using ( profile_id = auth.uid() );

drop policy if exists "Investments are deletable by owner" on public.investments;
create policy "Investments are deletable by owner"
  on public.investments for delete
  using ( profile_id = auth.uid() );

-- Savings
create table if not exists public.savings (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  goal_name text not null,
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null,
  target_date timestamptz not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists savings_profile_id_idx on public.savings(profile_id);

alter table public.savings enable row level security;

drop policy if exists "Savings are viewable by owner" on public.savings;
create policy "Savings are viewable by owner"
  on public.savings for select
  using ( profile_id = auth.uid() );

drop policy if exists "Savings are insertable by owner" on public.savings;
create policy "Savings are insertable by owner"
  on public.savings for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Savings are updatable by owner" on public.savings;
create policy "Savings are updatable by owner"
  on public.savings for update
  using ( profile_id = auth.uid() );

drop policy if exists "Savings are deletable by owner" on public.savings;
create policy "Savings are deletable by owner"
  on public.savings for delete
  using ( profile_id = auth.uid() );

-- Monthly Limits
create table if not exists public.monthly_limits (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  month text not null,
  limit_amount numeric(14,2) not null,
  created_at timestamptz not null default now(),
  unique(profile_id, month)
);

create index if not exists monthly_limits_profile_id_idx on public.monthly_limits(profile_id);
create index if not exists monthly_limits_month_idx on public.monthly_limits(month);

alter table public.monthly_limits enable row level security;

drop policy if exists "Monthly limits are viewable by owner" on public.monthly_limits;
create policy "Monthly limits are viewable by owner"
  on public.monthly_limits for select
  using ( profile_id = auth.uid() );

drop policy if exists "Monthly limits are insertable by owner" on public.monthly_limits;
create policy "Monthly limits are insertable by owner"
  on public.monthly_limits for insert
  with check ( profile_id = auth.uid() );

drop policy if exists "Monthly limits are updatable by owner" on public.monthly_limits;
create policy "Monthly limits are updatable by owner"
  on public.monthly_limits for update
  using ( profile_id = auth.uid() );

drop policy if exists "Monthly limits are deletable by owner" on public.monthly_limits;
create policy "Monthly limits are deletable by owner"
  on public.monthly_limits for delete
  using ( profile_id = auth.uid() );