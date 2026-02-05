// src/lib/static-helper.ts
import { locales } from "@/i18n";
import { getContents } from "@/lib/mdx";

// 1. 生成所有语言路径 (用于 [locale] layout)
export function generateLocaleParams() {
  return locales.map((locale) => ({ locale }));
}

// 2. 生成所有文章路径 (用于 blog/[slug])
export function generatePostParams(type: 
    'blog' | 'showcase' | 'docs' | 'products'|'mota-ai'|'legal') {
  const posts = getContents(type);
  const params = [];

  for (const locale of locales) {
    for (const post of posts) {
      if (type === 'docs') {
        // 如果 slug 是 "index"，对应 URL 的根目录，传空数组 []
        const slugArray = post.slug === 'index' 
          ? [] 
          : post.slug.split('/');
          
        params.push({
          locale: locale,
          slug: slugArray, // 👈 必须是数组
        });
      } else {
        // 其他普通路由保持字符串
        params.push({
          locale: locale,
          slug: post.slug,
        });
      }    
    }
  }
  return params;
}

// 3. 强制静态配置 (导出给页面用)
export const staticMode = 'force-static';