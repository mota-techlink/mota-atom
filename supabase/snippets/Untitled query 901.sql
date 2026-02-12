-- 创建个人资料表
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  phone text,
  address_line1 text,
  city text,
  state text,
  postal_code text,
  country text default 'US'
);

-- 开启 RLS
alter table public.profiles enable row level security;

-- 策略：用户只能看和改自己的资料
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);