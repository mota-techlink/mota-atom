// generate-assets.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob'; 
// 🟢 新增：引入序列化工具和插件
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// ---------------------------------------------------------
// 配置路径
// ---------------------------------------------------------
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(process.cwd(), 'src/generated/assets-manifest.json');
const OUTPUT_DIR = path.dirname(OUTPUT_FILE);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------------------------------------------------------
// 清洗逻辑 (保持不变)
// ---------------------------------------------------------
function cleanMDXContent(content, metadata) {
  let cleaned = content;
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '<br />');
  cleaned = cleaned.replace(/<hr\s*\/?>/gi, '<hr />');
  cleaned = cleaned.replace(/<img([^>]*?)(?<!\/)>/gi, (match, attributes) => {
     if (match.endsWith('/>')) return match;
     return `<img${attributes} />`;
  });
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
  cleaned = cleaned.replace(/^\s*#\s+.+$/m, '');
  if (metadata.image) {
    const escapedImage = metadata.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const htmlImgRegex = new RegExp(`(<p[^>]*>\\s*)?<img[^>]*src=["']${escapedImage}["'][^>]*\\/?>(\\s*<\\/p>)?`, 'gi');
    cleaned = cleaned.replace(htmlImgRegex, '');
    const mdImgRegex = new RegExp(`!\\[.*?\\]\\(${escapedImage}\\)`, 'gi');
    cleaned = cleaned.replace(mdImgRegex, '');
  }
  return cleaned;
}

// ---------------------------------------------------------
// 任务 A: 扫描内容 (修改为异步函数以支持 await serialize)
// ---------------------------------------------------------
async function scanContent() {
  const contentMap = {};
  const types = ['blog', 'showcase', 'pages', 'legal', 'products', 'mota-ai', 'docs'];

  for (const type of types) {
    const typeDir = path.join(CONTENT_DIR, type);
    
    // 如果目录不存在，跳过
    if (!fs.existsSync(typeDir)) {
      contentMap[type] = [];
      continue;
    }

    // 🟢 1. 使用 glob 递归扫描所有 .md/.mdx 文件
    // pattern: content/docs/**/*.mdx
    // windows 下路径分隔符需要处理，glob 倾向于 '/'
    const pattern = path.join(typeDir, '**/*.{md,mdx}').replace(/\\/g, '/');
    const files = await glob(pattern);

    const items = [];

    for (const filePath of files) {
      // 读取文件内容
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // 🟢 2. 计算相对路径 Slug
      // 例子: 
      // typeDir  = /usr/project/content/docs
      // filePath = /usr/project/content/docs/getting-started/installation.mdx
      // relative = getting-started/installation.mdx
      const relativePath = path.relative(typeDir, filePath);
      
      // 生成基础 slug (去掉扩展名) -> getting-started/installation
      // 并在 Windows 上强制把反斜杠转为正斜杠，保证 URL 一致性
      const slug = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\.[a-z]{2}$/, '') // 去掉 .zh, .en 等语言后缀
        .replace(/\\/g, '/');       // Windows 兼容

      // 处理文件名 (用于判断 locale)
      const filename = path.basename(filePath);

      // 3. 清洗内容
      const cleanedContent = cleanMDXContent(content, data);

      // 4. 编译 MDX
      const compiledSource = await serialize(cleanedContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
          format: 'mdx',
        },
        parseFrontmatter: false,
      });

      items.push({
        filename, // 保留文件名 (e.g. installation.zh.mdx)
        slug,     // 保留完整路径 Slug (e.g. getting-started/installation)
        metadata: data,
        content: compiledSource,
      });
    }

    contentMap[type] = items;
  }

  return contentMap;
}

// ---------------------------------------------------------
// 任务 B: 扫描图片 (保持不变)
// ---------------------------------------------------------
function scanImages() {
  const imageMap = {};
  function scanDir(currentPath, relativePath) {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    const dirKey = relativePath.replace(/\\/g, '/') || '/'; 
    if (!imageMap[dirKey]) imageMap[dirKey] = [];

    files.forEach(file => {
      if (file.isDirectory()) {
        scanDir(path.join(currentPath, file.name), path.join(relativePath, file.name));
      } else if (file.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
        const webPath = path.join(relativePath, file.name).replace(/\\/g, '/');
        const fullWebPath = webPath.startsWith('/') ? webPath : `/${webPath}`;
        const storeKey = path.join('/', relativePath).replace(/\\/g, '/');
        if (!imageMap[storeKey]) imageMap[storeKey] = [];
        imageMap[storeKey].push(fullWebPath);
      }
    });
  }
  if (fs.existsSync(PUBLIC_DIR)) {
    scanDir(PUBLIC_DIR, '');
  }
  return imageMap;
}

// ---------------------------------------------------------
// 执行并保存
// ---------------------------------------------------------
console.log('📦 Generating assets manifest...');
// 必须在一个 async 函数里执行
(async () => {
  try {
    const assets = {
      content: await scanContent(), // 等待编译完成
      images: scanImages(),
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assets, null, 2));
    console.log(`✅ Assets manifest generated at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
})();