// src/config/menu.ts

// 1. 定义允许的图标名称类型 (这能提供很好的智能提示)
export type IconName = 
  | "dashboard"    
  | "settings"     
  | "users" 
  | "logs" 
  | "video" 
  | "eye" 
  | "newspaper"
  | "orderList"
  | "presentation";

export type NavItem = {
  titleKey: string;
  href: string;
  icon: IconName; // 🔴 改动：这里现在存字符串
};

// 2. 修改用户菜单配置
export const userNavItems: NavItem[] = [
  {
    titleKey: 'nav_dashboard',
    href: '/dashboard',
    icon: "dashboard", // 🔴 传入字符串
  },
  {
    titleKey: 'nav_orderList',
    href: '/dashboard/orders',
    icon: "orderList", // 🔴 传入字符串
  },
  {
    titleKey: 'nav_settings',
    href: '/dashboard/settings',
    icon: "settings",
  },
];

// 3. 修改管理员菜单配置
export const adminNavItems: NavItem[] = [
  {
    titleKey: 'nav_overview',
    href: '/admin/console',
    icon: "dashboard",
  },
  {
    titleKey: 'nav_orders',
    href: '/admin/orders',
    icon: "orderList",
  },
  {
    titleKey: 'nav_users',
    href: '/admin/users',
    icon: "users",
  },
  
  {
    titleKey: 'nav_pitch_decks',
    href: '/admin/pitch-decks',
    icon: "presentation",
  },
];