-- 1. 启用向量扩展
create extension if not exists vector;

-- 2. 文档表 (知识库)
create table documents (
  id bigserial primary key,
  content text, -- 切片后的文本内容
  metadata jsonb, -- 存放如 { "slug": "/docs/install", "title": "安装" }
  embedding vector(768) -- Cloudflare bge-base-en-v1.5 输出维度通常是 768
);

-- 3. 对话会话表 (左侧历史列表)
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id), -- 如果需要鉴权
  title text, -- 对话摘要/标题
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. 消息记录表 (对话内容)
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text,
  created_at timestamptz default now()
);

-- 5. 核心：向量相似度搜索函数 (RPC)
create or replace function match_documents (
  query_embedding vector(768),
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