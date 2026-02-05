-- 1. 为了避免递归查询（RLS检查时又去查Profile），我们通常用 JWT 中的 metadata 来判断角色
-- 或者创建一个高性能的安全函数
create or replace function public.is_admin()
returns boolean as $$
begin
  return (select role from public.profiles where id = auth.uid()) = 'admin';
end;
$$ language plpgsql security definer;

-- 2. 修改 profiles 表的策略
-- 先删除旧策略（如果有的话，防止冲突）
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can see their own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;

-- 策略 A: 用户可以看自己的
create policy "Users can see their own profile"
on profiles for select
using ( auth.uid() = id );

-- 策略 B: 管理员可以看所有人的 (利用刚才写的函数)
create policy "Admins can view all profiles"
on profiles for select
using ( public.is_admin() );

-- 策略 C: 管理员可以更新所有人的信息
create policy "Admins can update all profiles"
on profiles for update
using ( public.is_admin() );

-- 策略 D: 管理员可以删除用户 (慎用，这只是删 profile，不会删 auth.users)
create policy "Admins can delete profiles"
on profiles for delete
using ( public.is_admin() );