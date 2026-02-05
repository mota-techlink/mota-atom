import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 1. 强制获取当前执行命令的绝对路径
const currentDir = process.cwd();

// 定义内容目录 (相对于项目根目录)
const CONTENT_DIRS = ['content/docs', 'content/mota-ai'];

// 2. 定义输出文件的绝对路径
const PUBLIC_DIR = path.join(currentDir, 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'search.json');

function stripMarkdown(content) {
  return content
    .replace(/---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

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

async function buildSearchIndex() {
  // 3. 确保 public 目录存在，如果不存在则创建
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const searchIndex = [];

  CONTENT_DIRS.forEach(dir => {
    // 使用绝对路径读取内容
    const fullPath = path.join(currentDir, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠ Warning: Content directory not found: ${fullPath}`);
      return;
    }

    const files = getAllFiles(fullPath);

    files.forEach(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // 生成 slug
      let slug = filePath
        .replace(path.join(currentDir, 'content'), '') // 移除绝对路径前缀
        .replace(/\\/g, '/')
        .replace(/\.mdx?$/, '');

      if (slug.endsWith('/index')) {
        slug = slug.replace('/index', '');
      }

      const type = dir.includes('mota-ai') ? 'AI Product' : 'Documentation';

      searchIndex.push({
        title: data.title || path.basename(slug),
        description: data.description || '',
        content: stripMarkdown(content),
        slug: slug,
        type: type
      });
    });
  });

  // 4. 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex));
  
  // 打印绝对路径，方便调试
  console.log(`✅ Search index generated at: ${OUTPUT_FILE}`);
  console.log(`📊 Total documents indexed: ${searchIndex.length}`);
}

buildSearchIndex();