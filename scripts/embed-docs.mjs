import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

// 检查必要的环境变量
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 🟢 修正：使用正确的 Key 变量名
);

// 计算文件内容的哈希值
function calculateChecksum(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// 🟢 修正：简单的文本切分函数 (输入是 string，输出是 chunk 数组)
function splitText(text, chunkSize = 800, chunkOverlap = 100) {
  if (typeof text !== 'string') return [];
  
  const chunks = [];
  let start = 0;
  
  // 防止死循环的简单保护
  if (text.length <= chunkSize) {
    return [{ pageContent: text }];
  }

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunkText = text.slice(start, end);
    chunks.push({ pageContent: chunkText });
    
    // 如果已经到了末尾，跳出循环
    if (end === text.length) break;
    
    // 移动指针，预留重叠部分
    start += chunkSize - chunkOverlap;
  }
  return chunks;
}

async function getEmbedding(text) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_WORKAI_TOKEN}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: [text] }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Cloudflare API Error:', err);
      throw new Error(`Cloudflare API returned ${response.status}`);
    }

    const result = await response.json();
    return result.result.data[0];
  } catch (error) {
    console.error('Embedding failed for text snippet:', text.substring(0, 20) + '...');
    throw error;
  }
}

async function processDocs() {
  const docsDir = path.join(process.cwd(), 'content/');
  // 确保目录存在
  if (!fs.existsSync(docsDir)) {
    console.error(`❌ Docs directory not found: ${docsDir}`);
    return;
  }

  const localFiles = getAllFiles(docsDir);
  console.log(`📂 Found ${localFiles.length} markdown files.`);

  // 1. 获取数据库中现有的所有文档记录
  const { data: dbFiles, error } = await supabase
    .from('documents')
    .select('file_path, checksum');

  if (error) {
    console.error('❌ Supabase Connect Error:', error.message);
    return;
  }

  const dbFileMap = new Map();
  if (dbFiles) {
    dbFiles.forEach(row => {
      if (!dbFileMap.has(row.file_path)) {
        dbFileMap.set(row.file_path, row.checksum);
      }
    });
  }

  const localFilePaths = new Set();

  // 2. 遍历本地文件
  for (const file of localFiles) {
    const relativePath = file.replace(process.cwd() + '/content', '');
    localFilePaths.add(relativePath);

    const contentRaw = fs.readFileSync(file, 'utf8');
    const currentChecksum = calculateChecksum(contentRaw);
    const existingChecksum = dbFileMap.get(relativePath);

    // Checksum 一致则跳过
    if (existingChecksum === currentChecksum) {
      // console.log(`⏭️  Skipping: ${relativePath}`);
      continue;
    }

    console.log(`🔄 Processing: ${relativePath}`);
    
    // 如果是更新，先删除旧向量
    if (existingChecksum) {
      await supabase.from('documents').delete().eq('file_path', relativePath);
    }

    const { content, data } = matter(contentRaw);
    
    // 🟢 修正：直接传入 content 字符串，不要套数组
    const chunks = splitText(content); 

    for (const chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk.pageContent);
        
        await supabase.from('documents').insert({
          content: chunk.pageContent,
          metadata: { 
            title: data.title || 'Untitled', 
            slug: relativePath.replace('.mdx', '').replace('.md', '') 
          },
          embedding: embedding,
          file_path: relativePath,
          checksum: currentChecksum
        });
      } catch (e) {
        console.error(`❌ Failed to process chunk for ${relativePath}`);
      }
    }
  }

  // 3. 处理删除
  for (const [dbPath] of dbFileMap) {
    if (!localFilePaths.has(dbPath)) {
      console.log(`🗑️  Deleting: ${dbPath}`);
      await supabase.from('documents').delete().eq('file_path', dbPath);
    }
  }

  console.log('🎉 Sync complete!');
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

processDocs();