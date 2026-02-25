import { locales,defaultLocale } from '../i18n';
import manifest from '@/generated/assets-manifest.json';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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
  content: MDXRemoteSerializeResult;
};

function getManifestData(type: ContentType): any[] {
  // @ts-ignore
  return manifest.content[type] || [];
}

// 获取指定类型的所有内容（用于生成列表页或聚合页）
export function getContents(type: ContentType, locale: string = defaultLocale): MdxPost[] {
  const allItems = getManifestData(type);

  // 1. 过滤掉 draft (生产环境)
  const nonDraft = allItems.filter((item: any) => {
    if (process.env.NODE_ENV === 'production' && item.metadata.draft === true) {
      return false;
    }
    return true;
  });

  // 2. 按 slug 分组，为每个 slug 选择最合适的语言版本
  //    优先选择与请求 locale 匹配的文件，回退到默认（无后缀）版本
  const slugMap = new Map<string, { item: any; itemLocale: string }>();
  for (const item of nonDraft) {
    const itemLocale = locales.find(l => l !== defaultLocale && item.filename.includes(`.${l}.`)) || defaultLocale;

    const existing = slugMap.get(item.slug);
    if (!existing) {
      slugMap.set(item.slug, { item, itemLocale });
    } else if (itemLocale === locale && existing.itemLocale !== locale) {
      // 新条目的语言更匹配当前请求，替换
      slugMap.set(item.slug, { item, itemLocale });
    }
  }

  // 3. 映射格式
  const posts: MdxPost[] = Array.from(slugMap.values()).map(({ item }) => ({
    slug: item.slug,
    metadata: item.metadata,
    content: item.content,
  }));

  // 4. 排序
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



export const getBlogPosts = (locale: string = defaultLocale) => getContents('blog', locale);
export const getShowcasePosts = (locale: string = defaultLocale) => getContents('showcase', locale);

export const getProductBySlug = (slug: string, locale: string) => getContentBySlug('products', slug, locale);
export const getMotaAiProductBySlug = (slug: string, locale: string) => getContentBySlug('mota-ai', slug, locale);
export const getPostBySlug = (slug: string, locale: string) => getContentBySlug('blog', slug, locale);
export const getShowcaseBySlug = (slug: string, locale: string) => getContentBySlug('showcase', slug, locale);
export const getDocBySlug = (slug: string, locale: string) => getContentBySlug('docs', slug, locale);



export function getAllTags(locale: string = defaultLocale): string[] {
    const posts = getContents('blog', locale);
    const tags = new Set<string>();
    posts.forEach(p => p.metadata.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
}
