-- 1. 启用向量扩展
create extension if not exists vector with schema extensions;
SET search_path TO public, extensions;
-- ==========================================
-- Part A: RAG 知识库系统 (增强版)
-- ==========================================

create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding extensions.vector(768), 
  -- 🟢 新增: 用于增量更新的字段
  file_path text unique, -- 唯一标识文件路径，防止重复插入
  checksum text,         --用于比对文件内容是否发生变化
  created_at timestamptz default now()
);

-- 开启 RLS
alter table documents enable row level security;
create policy "Allow public read access" on documents for select using (true);
create policy "Allow service role insert/update" on documents for all using (true);

-- ==========================================
-- Part B: 对话历史记录系统 (你的原始设计)
-- ==========================================

-- 会话表 (左侧历史列表)
create table if not exists chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id), -- 关联到 Supabase Auth 用户
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 开启 RLS (建议仅允许用户访问自己的会话)
alter table chat_sessions enable row level security;
create policy "Users can see own sessions" on chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on chat_sessions for insert with check (auth.uid() = user_id);

-- 消息表 (具体对话内容)
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant', 'system')), -- 增加 system 以防万一
  content text,
  created_at timestamptz default now()
);

-- 开启 RLS
alter table chat_messages enable row level security;
create policy "Users can see own messages" on chat_messages for select using (
  exists (select 1 from chat_sessions where id = chat_messages.session_id and user_id = auth.uid())
);
create policy "Users can insert own messages" on chat_messages for insert with check (
  exists (select 1 from chat_sessions where id = chat_messages.session_id and user_id = auth.uid())
);

-- ==========================================
-- Part C: 核心搜索函数
-- ==========================================

create or replace function match_documents (
  query_embedding extensions.vector(768),
  match_threshold float,
  match_count int
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql stable as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;