import matter from 'gray-matter';
import { locales,defaultLocale } from '../i18n';
import manifest from '@/generated/assets-manifest.json';


export type ContentType = 'blog' | 'showcase' | 'pages' | 'legal' | 'products' | 'mota-ai' | 'docs';

export type MdxPost = {
  slug: string;
  metadata: {
    title: string;
    date?: string;
    description?: string;
    tags?: string[];
    image?: string;
    author?: string;
    // Showcase 特有的字段
    categories?: string[];
    draft?: boolean;
    [key: string]: any;
  };
  content: string;
};

function getManifestData(type: ContentType): any[] {
  // @ts-ignore
  return manifest.content[type] || [];
}
function cleanMDXContent(content: string, metadata: MdxPost['metadata']): string {
  let cleaned = content;

  // ---------------------------------------------------------
  // 1. 基础清理 (修复 HTML 注释、未闭合标签)
  // ---------------------------------------------------------
  
  // 删除 HTML 注释
//   cleaned = cleaned.replace(/<!--.*?-->/gs, '');
  
  // 修复常见未闭合标签
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '<br />');
  cleaned = cleaned.replace(/<hr\s*\/?>/gi, '<hr />');
  
  // 修复未闭合 img (把 <img ... > 变成 <img ... />)
  cleaned = cleaned.replace(/<img([^>]*?)(?<!\/)>/gi, (match, attributes) => {
     if (match.endsWith('/>')) return match;
     return `<img${attributes} />`;
  });

  // 替换 align 属性
  cleaned = cleaned.replace(
    /<div\s+align="left">([\s\S]*?)<\/div>/gi, 
    (match, innerContent) => {
      // 1. 清洗内部：把换行符(\n)变成空格，把 <br> 删掉
      const inlineContent = innerContent
        .replace(/\r?\n/g, ' ')       // 换行 -> 空格
        .replace(/<br\s*\/?>/gi, '')  // 删除可能存在的 <br>
        .replace(/\s+/g, ' ')         // 把多个连续空格合并成一个
        .trim();                      // 去掉首尾空格

      // 2. 返回：用 Flex 容器包裹清洗后的一行内容
      // 增加 'not-prose' (如果你的 Tailwind 配置支持) 或者手动重置样式，
      // 防止 p 标签的 margin 干扰
      return `<div className="flex flex-wrap gap-2 items-center text-sm text-blue-600 dark:text-blue-400 my-4 leading-none">${inlineContent}</div>`;
    }
  );

  // ... 之前的 align="center" 等逻辑 ...
  cleaned = cleaned.replace(/align="center"/gi, 'className="text-center"');
  cleaned = cleaned.replace(/align="right"/gi, 'className="text-right"');

  // ---------------------------------------------------------
  // 2. 智能移除重复标题 (H1)
  // ---------------------------------------------------------
  
  // 逻辑：Portal 页面已经渲染了 H1，所以 Markdown 正文里的第一个 # 标题是多余的。
  // 我们移除第一个出现的 # Title (支持跨行匹配)
  // ^\s*#\s+ 匹配行首的 # 号
  cleaned = cleaned.replace(/^\s*#\s+.+$/m, '');


  // ---------------------------------------------------------
  // 3. 智能移除重复封面图 (Image)
  // ---------------------------------------------------------
  
  if (metadata.image) {
    // A. 移除 HTML 风格图片: <img src="..." /> 及其包裹的 <p>
    // 这种写法常见于 GitHub Readme: <p align="center"><img src="..." /></p>
    // 我们构建一个动态正则，匹配包含该图片 URL 的 img 标签
    // 注意：我们需要转义 metadata.image 中的特殊字符用于正则
    const escapedImage = metadata.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 匹配模式：
    // <p ...> (可选)
    //   <img ... src="IMAGE_URL" ... />
    // </p> (可选)
    const htmlImgRegex = new RegExp(
      `(<p[^>]*>\\s*)?<img[^>]*src=["']${escapedImage}["'][^>]*\\/?>(\\s*<\\/p>)?`, 
      'gi'
    );
    cleaned = cleaned.replace(htmlImgRegex, '');

    // B. 移除 Markdown 风格图片: ![alt](url)
    // ![...](IMAGE_URL)
    const mdImgRegex = new RegExp(
      `!\\[.*?\\]\\(${escapedImage}\\)`,
      'gi'
    );
    cleaned = cleaned.replace(mdImgRegex, '');
  }

  return cleaned;
}
// 获取指定类型的所有内容（用于生成列表页或聚合页）
export function getContents(type: ContentType, locale: string = defaultLocale): MdxPost[] {
  const allItems = getManifestData(type);
  // 1. 过滤逻辑 (移植原 filter)
  const filtered = allItems.filter((item: any) => {
    // 过滤掉 draft (生产环境)
    if (process.env.NODE_ENV === 'production' && item.metadata.draft === true) {
      return false;
    }

    // 语言过滤逻辑：
    // 如果文件名包含 .en.md，但当前请求的是 zh，则过滤掉
    const isLocalizedFile = locales.some(l => l !== defaultLocale && item.filename.includes(`.${l}.`));
    
    // 如果当前请求是默认语言(zh)，但文件是(en)，则跳过
    if (locale === defaultLocale && isLocalizedFile) return false;

    // 如果当前请求是(en)，但文件不是(en)且不是默认文件... 这里简化逻辑：
    // 我们主要需要确保取出"最合适"的文件。
    // 在列表页，通常我们只返回默认语言的文章，或者做更复杂的去重。
    // 原代码逻辑：!locales.some(l => l !== defaultLocale && f.includes(`.${l}.md`))
    // 原意是：只获取默认语言的文件 + 不带后缀的文件
    if (locales.some(l => l !== defaultLocale && item.filename.includes(`.${l}.`))) {
      return false; 
    }

    return true;
  });
   
// 2. 映射格式 (JSON 里已经是 parse 好的了)
  const posts: MdxPost[] = filtered.map((item: any) => ({
    slug: item.slug,
    metadata: item.metadata,
    content: item.content,
  }));

  // 3. 排序
  return posts.sort((a, b) => {
    if (a.metadata.date && b.metadata.date) {
      return new Date(a.metadata.date) > new Date(b.metadata.date) ? -1 : 1;
    }
    return 0;
  });
}

// 📖 通用获取单篇内容函数
export function getContentBySlug(type: ContentType, slug: string, locale: string = defaultLocale): MdxPost | null {
  const allItems = getManifestData(type);
  const realSlug = slug.replace(/\.mdx?$/, '');

  // 查找优先级：
  // 1. slug.zh.mdx (具体语言)
  // 2. slug.mdx (默认/无后缀)
  
  let targetItem = allItems.find((item: any) => 
    item.slug === realSlug && item.filename.includes(`.${locale}.`)
  );

  if (!targetItem) {
    // 回退到默认语言 (假设默认是不带 locale 后缀的)
    targetItem = allItems.find((item: any) => 
      item.slug === realSlug && !locales.some(l => item.filename.includes(`.${l}.`))
    );
  }

  if (!targetItem) return null;

  return {
    slug: realSlug,
    metadata: targetItem.metadata,
    content: targetItem.content, // 内容在构建时已经清洗过了
  };
}



export const getBlogPosts = () => getContents('blog');
export const getShowcasePosts = () => getContents('showcase');

export const getProductBySlug = (slug: string, locale: string) => getContentBySlug('products', slug, locale);
export const getMotaAiProductBySlug = (slug: string, locale: string) => getContentBySlug('mota-ai', slug, locale);
export const getPostBySlug = (slug: string, locale: string) => getContentBySlug('blog', slug, locale);
export const getShowcaseBySlug = (slug: string, locale: string) => getContentBySlug('showcase', slug, locale);
export const getDocBySlug = (slug: string, locale: string) => getContentBySlug('docs', slug, locale);



export function getAllTags(): string[] {
    const posts = getContents('blog');
    const tags = new Set<string>();
    posts.forEach(p => p.metadata.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
}
