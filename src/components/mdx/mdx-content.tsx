import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { CodeBlock } from './code-block';
import { YouTube } from './youtube';
import { ImageSlider } from './image-slider';
import { GradientText } from './gradient-text';
import { GifVideo } from './gif-video';
import { ColorText } from './color-text';
import { BionicText } from './bionic-text';
import { BionicWrapper } from './bionic-wrapper';
// 🟢 新增：引入图标用于错误展示
import { AlertTriangle } from "lucide-react";
import { Steps, Step } from "@/components/mdx/steps";
import rehypeSlug from 'rehype-slug';

// 定义所有 MDX 可用的组件
const sharedComponents = {
  // 基础 HTML 覆盖
  pre: CodeBlock,
  // 自定义组件
  Callout: CustomCallout,
  Highlight: CustomHighlight,
  YouTube: YouTube,
  Slider: ImageSlider,  
  Gradient: (props: any) => (
    <span data-no-bionic="true">
      <GradientText {...props} />
    </span>
  ),
  GifVideo: GifVideo,
  ColorText: ColorText,
  Bionic: BionicText,
  // 你甚至可以覆盖 h1, h2 来增加锚点
  // 🟢 拦截标准 HTML 标签
  // 所有的段落 <p> 都会变成 <BionicWrapper as="p">
  p: (props: any) => <BionicWrapper as="p" {...props} />,
  
  // 所有的列表项 <li> 都会变成 <BionicWrapper as="li">
  li: (props: any) => <BionicWrapper as="li" {...props} />,
  
  // 引用块也可以加上
  blockquote: (props: any) => (
    <BionicWrapper 
      as="blockquote" 
      className="mt-6 border-l-2 border-slate-300 pl-6 italic" 
      {...props} 
    />
  ),
  Steps: Steps,
  Step: Step,
};

interface MdxContentProps {
  content: string;
  className?: string; // 允许传入额外的样式类
}

export function CustomHighlight({ children, color = "yellow" }: { children: React.ReactNode, color?: string }) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return (
    <span className={`px-1 rounded-md font-medium ${colorMap[color] || colorMap.yellow}`}>
      {children}
    </span>
  );
}

export function CustomCallout({ children, type = "default" }: { children: React.ReactNode, type?: "default" | "warning" | "danger" }) {
    const style = {
        default: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20",
        warning: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        danger: "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20",
    }
    return (
        <div className={`p-4 my-4 rounded-r-md ${style[type]}`}>
            {children}
        </div>
    )
}

export function MdxContent({ content, className }: MdxContentProps) {
  const options = {
    theme: 'github-dark-dimmed',
    keepBackground: false,
  };

  // 🟢 修改点：使用 try-catch 包裹 MDXRemote
  try {
    return (
      // 这里保留 prose 样式，但允许外部覆盖
      <div className={`blog-content ${className || ''}`}>
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {            
              rehypePlugins: [rehypeSlug,[rehypePrettyCode, options]],
              remarkPlugins: [remarkGfm, remarkBreaks],
            },
          }}
          components={sharedComponents}
        />
      </div>
    );
  } catch (error: any) {
    // 🟢 错误捕获 UI
    // 当 content 中包含非法 JS 语法（如未转义的花括号 {}）时，Acorn 解析器会抛出错误
    // 我们在这里捕获它，避免整个页面崩溃 (500 Error)
    console.error("MDX Compilation Error:", error);

    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 my-4 text-red-600 dark:text-red-400">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="font-bold text-lg">Content Rendering Error</h3>
        </div>
        
        <p className="font-mono text-sm bg-black/5 p-2 rounded mb-4 break-words">
          {error.message || "Failed to compile MDX content"}
        </p>

        <div className="text-sm mb-4">
          <p className="font-semibold">Common fixes:</p>
          <ul className="list-disc list-inside opacity-80">
            <li>Check for unescaped curly braces <code>{`{ }`}</code>. Use <code>{`\\{ \\}`}</code> instead.</li>
            <li>Ensure all HTML tags are closed (e.g. <code>{`<br />`}</code> instead of <code>{`<br>`}</code>).</li>
          </ul>
        </div>

        {/* 显示原始内容的前 500 个字符，方便调试定位 */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase opacity-50 mb-1">Raw Content Preview:</p>
          <pre className="text-xs font-mono bg-black/80 text-white p-4 rounded overflow-auto max-h-40 whitespace-pre-wrap">
            {content}
          </pre>
        </div>
      </div>
    );
  }
}