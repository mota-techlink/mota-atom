// 类型定义示例 (src/types/product.ts)
export type PricingTier = {
  name: string; // e.g., "MVP", "Pro", "Enterprise"
  price: string; // e.g., "$999"
  description: string;
  deliveryTime: string; // e.g., "2 weeks"
  features: string[]; // 勾选列表
}

export type ProductFrontmatter = {
  title: string;
  description: string;
  gallery: string[]; // 图片数组
  techStack: string[]; // e.g., ["Python", "Tensorflow"]
  pricing: [PricingTier, PricingTier, PricingTier]; // 对应 Basic, Standard, Premium
  relatedShowcases: string[]; // showcase 的 slugs, e.g., ["chat-bot-v1", "finance-rag"]
  faq: { question: string; answer: string }[];
}