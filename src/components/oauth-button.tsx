'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Wrench } from 'lucide-react';

type OAuthButtonProps = {
  label: string;
  iconUrl: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  enable?: boolean;
};

export function OAuthButton({ 
  label, 
  iconUrl, 
  onClick, 
  isLoading, 
  enable = true // 默认启用
}: OAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      // 🟢 如果 enable 为 false，设置 disabled
      disabled={!enable || isLoading}
      onClick={enable ? onClick : undefined}
      className={cn(
        "h-12 w-12 p-1 rounded-full flex items-center justify-center aspect-square relative overflow-hidden", // relative 用于定位
        "bg-transparent border border-transparent shadow-none transition-all duration-200",
        // 启用时的 hover 样式 - 使用 ! 标记强制覆盖 ghost 变体的默认 hover 样式
        enable && "!hover:bg-slate-100/80 dark:!hover:bg-slate-800/80 !hover:border-slate-300 dark:!hover:border-slate-600 !hover:shadow-sm hover:cursor-pointer",
        // 禁用时的样式 (降低透明度，显示不可用感)
        !enable && "opacity-70 cursor-not-allowed bg-slate-100/50 dark:bg-slate-800/50 "
      )}
      title={enable ? `Sign in with ${label}` : `${label} is currently unavailable`}
      // aria-label={`Sign in with ${label}`}
    >
      {/* 🟢 图标容器 
         如果禁用了，原图标变灰、变淡，作为背景衬托
      */}
      <div className={cn("relative flex items-center justify-center", !enable && " blur-[3px]")}>
        {iconUrl && (
          <Image
            src={iconUrl}
            alt={label}
            width={35}
            height={35}
            className="object-contain"
          />
        )}
      </div>

    </Button>
  );
}