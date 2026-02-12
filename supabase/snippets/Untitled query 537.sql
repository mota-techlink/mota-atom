-- 1. 为 profiles 表增加 Stripe 客户 ID 字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- 2. 创建一个订阅表 (可选，如果以后有月付产品)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  stripe_subscription_id text UNIQUE,
  status text, -- active, trialing, canceled, past_due
  price_id text,
  tier_name text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);