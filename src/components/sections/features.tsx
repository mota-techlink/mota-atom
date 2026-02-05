import matter from "gray-matter";
import { Icons, IconKey } from "@/components/icons"; // 引入刚才创建的图标映射
import { featuresContent } from "@/config/features";

// 定义数据接口
interface FeatureItem {
  title: string;
  description: string;
  icon: IconKey;
}

interface FeatureData {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export async function FeaturesSection() {
  
  const content = featuresContent;
  return (
    <section className="container space-y-16 py-24 md:py-32">
      {/* 头部区域：Headline & Sub-headline */}
      <div className="mx-auto max-w-[58rem] text-center space-y-4">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          {content.title}
        </h2>
        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7 max-w-[42rem] mx-auto">
          {content.subtitle}
        </p>
      </div>

      {/* 特性网格区域 */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {content.features.map((feature, index) => {
          // 动态获取图标组件
          const IconComponent = Icons[feature.icon] || Icons.zap;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-background/50 p-2 transition-all hover:bg-accent/50 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">                              
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-primary shrink-0" />
                  <h3 className="font-bold leading-tight">{feature.title}</h3>                  
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}