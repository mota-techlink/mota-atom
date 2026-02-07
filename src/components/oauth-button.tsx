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
        "h-14 w-14 p-3 rounded-full flex items-center justify-center aspect-square relative overflow-hidden", // relative 用于定位
        "bg-transparent border-none shadow-none",
        // 启用时的 hover 样式
        enable && "hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all",
        // 禁用时的样式 (降低透明度，显示不可用感)
        !enable && "opacity-70 cursor-not-allowed bg-slate-100/50 dark:bg-slate-800/50"
      )}
      title={enable ? `Sign in with ${label}` : `${label} is currently unavailable`}
      aria-label={`Sign in with ${label}`}
    >
      {/* 🟢 图标容器 
         如果禁用了，原图标变灰、变淡，作为背景衬托
      */}
      <div className={cn("relative flex items-center justify-center", !enable && " blur-[1px]")}>
        {iconUrl && (
          <Image
            src={iconUrl}
            alt={label}
            width={50}
            height={50}
            className="object-contain"
          />
        )}
      </div>

    </Button>
  );
}