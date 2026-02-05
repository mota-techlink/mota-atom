import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ---------------------------------------------------------
// 配置路径
// ---------------------------------------------------------
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(process.cwd(), 'src/generated/assets-manifest.json');
const OUTPUT_DIR = path.dirname(OUTPUT_FILE);

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------------------------------------------------------
// 移植原来的清洗逻辑 (cleanMDXContent)
// ---------------------------------------------------------
function cleanMDXContent(content, metadata) {
  let cleaned = content;

  // 修复未闭合标签
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '<br />');
  cleaned = cleaned.replace(/<hr\s*\/?>/gi, '<hr />');
  cleaned = cleaned.replace(/<img([^>]*?)(?<!\/)>/gi, (match, attributes) => {
     if (match.endsWith('/>')) return match;
     return `<img${attributes} />`;
  });

  // 替换 align div
  cleaned = cleaned.replace(
    /<div\s+align="left">([\s\S]*?)<\/div>/gi, 
    (match, innerContent) => {
      const inlineContent = innerContent
        .replace(/\r?\n/g, ' ')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `<div className="flex flex-wrap gap-2 items-center text-sm text-blue-600 dark:text-blue-400 my-4 leading-none">${inlineContent}</div>`;
    }
  );

  cleaned = cleaned.replace(/align="center"/gi, 'className="text-center"');
  cleaned = cleaned.replace(/align="right"/gi, 'className="text-right"');
  
  // 移除重复标题 H1
  cleaned = cleaned.replace(/^\s*#\s+.+$/m, '');

  // 移除重复封面图
  if (metadata.image) {
    const escapedImage = metadata.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const htmlImgRegex = new RegExp(
      `(<p[^>]*>\\s*)?<img[^>]*src=["']${escapedImage}["'][^>]*\\/?>(\\s*<\\/p>)?`, 
      'gi'
    );
    cleaned = cleaned.replace(htmlImgRegex, '');
    
    const mdImgRegex = new RegExp(
      `!\\[.*?\\]\\(${escapedImage}\\)`,
      'gi'
    );
    cleaned = cleaned.replace(mdImgRegex, '');
  }

  return cleaned;
}

// ---------------------------------------------------------
// 任务 A: 扫描内容 (替代 fs.readdirSync + matter)
// ---------------------------------------------------------
function scanContent() {
  const contentMap = {};
  // 定义你要扫描的内容类型文件夹
  const types = ['blog', 'showcase', 'pages', 'legal', 'products', 'mota-ai', 'docs'];

  types.forEach(type => {
    const dir = path.join(CONTENT_DIR, type);
    if (!fs.existsSync(dir)) {
      contentMap[type] = [];
      return;
    }

    const files = fs.readdirSync(dir);
    const items = files
      .filter(f => f.match(/\.(md|mdx)$/))
      .map(filename => {
        const filePath = path.join(dir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        // 预清洗内容
        const cleanedContent = cleanMDXContent(content, data);

        return {
          filename, // 保留文件名用于 locale 判断
          slug: filename.replace(/\.(md|mdx)$/, '').replace(/\.[a-z]{2}$/, ''), // 基础 slug
          metadata: data,
          content: cleanedContent,
        };
      });

    contentMap[type] = items;
  });

  return contentMap;
}

// ---------------------------------------------------------
// 任务 B: 扫描图片 (替代 image-loader)
// ---------------------------------------------------------
function scanImages() {
  const imageMap = {};
  
  // 递归扫描函数
  function scanDir(currentPath, relativePath) {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    
    // 初始化当前目录的数组
    // key 比如: "/images/showcase"
    const dirKey = relativePath.replace(/\\/g, '/') || '/'; 
    if (!imageMap[dirKey]) imageMap[dirKey] = [];

    files.forEach(file => {
      if (file.isDirectory()) {
        scanDir(path.join(currentPath, file.name), path.join(relativePath, file.name));
      } else if (file.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
        // 如果是图片，加入到当前目录的 key 中
        // value 比如: "/images/showcase/1.jpg"
        const webPath = path.join(relativePath, file.name).replace(/\\/g, '/');
        const fullWebPath = webPath.startsWith('/') ? webPath : `/${webPath}`;
        
        // 存入当前文件夹的列表
        const storeKey = path.join('/', relativePath).replace(/\\/g, '/');
        if (!imageMap[storeKey]) imageMap[storeKey] = [];
        imageMap[storeKey].push(fullWebPath);
      }
    });
  }

  // 从 public 开始扫描
  if (fs.existsSync(PUBLIC_DIR)) {
    scanDir(PUBLIC_DIR, '');
  }

  return imageMap;
}

// ---------------------------------------------------------
// 执行并保存
// ---------------------------------------------------------
console.log('📦 Generating assets manifest...');
const assets = {
  content: scanContent(),
  images: scanImages(),
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assets, null, 2));
console.log(`✅ Assets manifest generated at ${OUTPUT_FILE}`);