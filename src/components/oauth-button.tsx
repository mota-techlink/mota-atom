// components/oauth-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
// 如果您使用了 TypeScript，可能需要引入类型
// import type { MouseEventHandler } from 'react';

type OAuthButtonProps = {
  provider: string;
  label: string;
  iconUrl: string;
  // 确保 onClick 的类型定义允许接收事件对象
  // onClick: () => void; // ❌ 之前的可能定义
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // ✅ 更标准的定义
};

export function OAuthButton({ label, iconUrl, onClick }: OAuthButtonProps) {
  return (
    <Button
      // 🟢 核心修复：必须显式指定 type 为 "button"
      // 这样浏览器就绝对不会把它当作提交按钮处理
      type="button" 
      variant="outline"
      className="w-full flex items-center gap-2 justify-center"
      // 将传入的 onClick 处理函数绑定到按钮上
      onClick={onClick}
    >
      {iconUrl && (
        <Image src={iconUrl} alt={label} width={20} height={20} className="mr-2" />
      )}
      {label}
    </Button>
  );
}