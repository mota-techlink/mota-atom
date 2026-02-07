'use client';

import { OAuthButton } from "@/components/oauth-button";
import { OAuthProviderConfig } from "@/config/site"; // 引入类型
import { useState } from "react";

export default function ClientOAuthHandler({ 
  provider 
}: { 
  provider: OAuthProviderConfig // 使用新类型
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  return (
    <OAuthButton
      label={provider.label}
      iconUrl={provider.icon}
      enable={provider.enable}
      isLoading={isNavigating} // 传递 loading 状态给按钮
      onClick={() => {
        // 1. 检查是否启用
        if (!provider.enable) return;

        // 2. 设置 loading 状态 (防止重复点击)
        setIsNavigating(true);

        // 3. 🟢 核心修改：直接导航到 GET API 路由
        // 路径格式: /api/auth/{providerId}
        // 浏览器会发起 GET 请求，由 Route Handler 处理重定向
        window.location.href = `/auth/${provider.id}`;
      }}
    />
  );
}