create table public.payments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  stripe_session_id text not null unique,
  user_id uuid references auth.users(id), -- 如果已登录，关联用户ID
  customer_email text not null,           -- 核心字段：通过邮箱关联
  amount integer,                         -- 金额 (分)
  status text,                            -- 'paid', 'pending', etc.
  tier_name text,                         -- 'Basic', 'Standard'
  product_name text
);

-- 开启 RLS (安全策略)
alter table public.payments enable row level security;

-- 允许用户查看自己的订单
create policy "Users can view own payments" 
on public.payments for select 
using (auth.uid() = user_id);