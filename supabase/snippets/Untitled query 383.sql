-- 优化 is_admin 函数：避免直接查询触发表级 RLS
create or replace function public.is_admin()
returns boolean as $$
declare
  _role text;
begin
  -- 直接查询，不依赖 View 或 RLS，利用 security definer 的特权
  select role into _role from public.profiles where id = auth.uid();
  return _role = 'admin';
end;
$$ language plpgsql security definer;