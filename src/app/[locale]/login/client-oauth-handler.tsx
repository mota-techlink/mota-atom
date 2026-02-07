'use client';

import { OAuthButton } from "@/components/oauth-button";
import { signInWithProvider } from "@/app/auth/actions";
import { OAuthProviderConfig } from "@/config/site"; // 引入类型

export default function ClientOAuthHandler({ 
  provider 
}: { 
  provider: OAuthProviderConfig // 使用新类型
}) {
  return (
    <OAuthButton
      label={provider.label}
      iconUrl={provider.icon}
      enable={provider.enable} // 🟢 传递 enable 状态
      onClick={async () => {
        // 双重保险：虽然按钮 disabled 了，但逻辑层也判断一下
        if (!provider.enable) return;

        const result = await signInWithProvider(provider.id);
        
        if (result?.url) {
          window.location.href = result.url;
        } else if (result?.error) {
          console.error(`Error logging in with ${provider.label}:`, result.error);
        }
      }}
    />
  );
}