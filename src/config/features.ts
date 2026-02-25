// src/config/features.ts
import { IconKey } from "@/components/icons";

export interface FeatureItem {
  title: string;
  description: string;
  icon: IconKey;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

/**
 * 根据翻译函数生成 features 内容
 * @param t - 翻译函数，对应 "Features" 命名空间
 */
export function getFeaturesContent(t: (key: string) => string): FeaturesContent {
  return {
    title: t("title"),
    subtitle: t("subtitle"),
    features: [
      {
        title: t("zeroInfra_title"),
        description: t("zeroInfra_desc"),
        icon: "wallet" as IconKey,
      },
      {
        title: t("ecosystem_title"),
        description: t("ecosystem_desc"),
        icon: "layers" as IconKey,
      },
      {
        title: t("techStack_title"),
        description: t("techStack_desc"),
        icon: "cpu" as IconKey,
      },
      {
        title: t("ai_title"),
        description: t("ai_desc"),
        icon: "bot" as IconKey,
      },
      {
        title: t("web3_title"),
        description: t("web3_desc"),
        icon: "blocks" as IconKey,
      },
      {
        title: t("ux_title"),
        description: t("ux_desc"),
        icon: "glasses" as IconKey,
      },
    ],
  };
}