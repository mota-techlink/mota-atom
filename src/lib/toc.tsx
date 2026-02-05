// src/lib/toc.ts
// import { toc } from "mdast-util-toc"; // 也可以不用库，纯手写正则，下面演示手写版更轻量
import GithubSlugger from 'github-slugger';

export interface TableOfContentsItem {
  title: string;
  url: string;
  items?: TableOfContentsItem[];
}

export interface TableOfContents {
  items: TableOfContentsItem[];
}

/**
 * 简单的正则提取 H2 和 H3
 */
export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const slugger = new GithubSlugger();
  const headings: TableOfContentsItem[] = [];
  // 匹配 ## Title 或 ### Title
  const regex = /^(#{2,3})\s+(.*)$/gm;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length; // 2 或 3
    const title = match[2].trim();
    // 生成简单的 slug: "My Title" -> "my-title"
    // 注意：这里的 slug 生成逻辑必须和 rehype-slug 插件保持一致，否则点击跳不过去
    // const url = `#${title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
    const url = `#${slugger.slug(title)}`;
    if (level === 2) {
      headings.push({ title, url, items: [] });
    } else if (level === 3 && headings.length > 0) {
      headings[headings.length - 1].items?.push({ title, url });
    }
  }

  return { items: headings };
}