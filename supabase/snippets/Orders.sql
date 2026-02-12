-- 1. 创建枚举类型 (规范化状态)
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type payment_provider as enum ('stripe', 'paypal', 'crypto', 'manual');

-- 2. 创建核心订单表
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- 用户关联
  user_id uuid references auth.users(id),
  customer_email text not null,
  customer_phone text,
  
  -- 订单详情
  order_number text unique not null, -- 比如: 'ORD-20260209-X8Y9' (比 UUID 更友好的订单号)
  product_name text not null,
  tier_name text,
  amount_total numeric(10,2) not null, -- 存金额 (单位: 元/美元)
  currency text default 'usd',
  
  -- 支付信息
  status order_status default 'pending',
  payment_provider payment_provider default 'stripe',
  payment_transaction_id text, -- Stripe Session ID 或 PayPal Transaction ID
  payment_method_details jsonb, -- 存具体的支付细节 (如: {"card": "visa", "last4": "4242"})
  
  -- 交付与物流信息
  shipping_address jsonb, -- 存结构化地址: { line1, city, country, postal_code }
  shipping_method text default 'standard', -- 'standard', 'express', 'digital'
  expected_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  tracking_number text
);

-- 3. 开启 RLS
alter table public.orders enable row level security;

-- 允许用户看自己的订单
create policy "Users can view own orders" 
on public.orders for select 
using (auth.uid() = user_id);

-- 允许 Service Role (Webhook) 读写所有订单
create policy "Service role manages all orders"
on public.orders for all
to service_role
using (true)
with check (true);