// src/config/features.ts
import { IconKey } from "@/components/icons";

export interface FeatureItem {
  title: string;
  description: string;
  icon: IconKey;
}

export const featuresContent = {
  title: "Features",
  subtitle: "The comprehensive open-source portal that gives you a Storefront, Member Hub, and Admin Dashboard out of the box.",
  features: [
    {
      title: "Zero Infrastructure Costs",
      description: "Stop worrying about AWS bills. Architected for serverless-first deployment that stays free until you scale.",
      icon: "wallet" as IconKey,
    },
    {
      title: "3-in-1 Ecosystem",
      description: "A unified portal integrating Public Storefront, Member Hub, and Admin Dashboard seamlessly.",
      icon: "layers" as IconKey,
    },
    {
      title: "Modern Tech Stack",
      description: "Built with the bleeding edge: Next.js 15, Shadcn/UI, Tailwind CSS, and Supabase.",
      icon: "cpu" as IconKey,
    },
    {
      title: "Native AI Support",
      description: "Built-in RAG-powered customer support and 24/7 AI Chatbot with local content awareness.",
      icon: "bot" as IconKey,
    },
    {
      title: "Web3 Ready",
      description: "Future-proof your startup with seamless integration for next-gen digital assets and identity.",
      icon: "blocks" as IconKey,
    },
    {
      title: "Enhanced UX",
      description: "Features distinct user experience tools like Bionic Reading to improve content consumption.",
      icon: "glasses" as IconKey,
    },
  ],
};



// Stop worrying about AWS bills and start building. We combine the latest tech into a powerful toolkit.