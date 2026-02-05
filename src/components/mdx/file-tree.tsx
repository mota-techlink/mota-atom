// src/components/mdx/file-tree.tsx
import { File, Folder } from "lucide-react";

// 这是一个简化的视觉组件，手动写结构
export function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4 font-mono text-sm not-prose my-6">
      {children}
    </div>
  );
}
// 使用方式在 MDX 中:
// <FileTree>
//   <div className="flex items-center gap-2"><Folder className="w-4 h-4"/> src</div>
//   <div className="flex items-center gap-2 ml-4"><File className="w-4 h-4"/> app</div>
// </FileTree>