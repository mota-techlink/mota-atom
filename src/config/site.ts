import { log } from "console"

export const siteConfig = {
  name: "MOTA TECHLINK",
  logoLight: "/logos/mota-techlink-logo-wht.png", // 亮色模式 Logo
  logoDark: "/logos/mota-techlink-logo-blk.png",   // 暗色模式 Logo
  Icon: "/logos/mota-icon-v2.png",    // 网站图标 Favicon
  logo: "/logos/mota-logo-v2.png",
  banner: "/images/mota-banner.png",
  
  description:
    "Launch Your Dream Startup with AI Support, Zero Cost and Infinite Scale...",
  url: "https://motaiot.com", 
  ogImage: "https://motaiot.com/og.jpg",
  contact: {
    email: "contract@motaiot.com",
    phone: "+1 (917) 310-2808",
    address: "1329 Willoughby Ave Brooklyn, NY 11237-3177, USA",  
  },
  google_map: {
    // Google Maps 经纬度
    mapCoordinates: {
      lat: 40.7065032,
      lng: -73.9209374
    },    
    mapEnable: true,
    mapZoom: 11,
    mapMarker: "images/beachflag.png",
    mapURL: "https://www.google.com/maps/place/MOTA+TECHLINK+INC./@40.7065031,-73.9258083,17z/data=!3m1!4b1!4m6!3m5!1s0x4cb5e44496595be9:0x6c229d34b2a8ae32!8m2!3d40.7065032!4d-73.9209374!16s%2Fg%2F11ys91d0m4",
  },
  links: {
    twitter: "https://twitter.com/motatechlink",
    github: "https://github.com/mota-techlink/mota-atom",
  },
  // Landing Page 的核心特性介绍
  features: [
    {
      title: "Next.js 15 & App Router",
      description: "App Router, Server Components, and Server Actions. Ready for the future.",
    },
    {
      title: "Supabase Auth & Database",
      description: "Complete authentication system and Postgres database fully integrated.",
    },
    {
      title: "Resend Style Blog",
      description: "Beautifully designed blog with MDX, syntax highlighting, and typography.",
    },
    {
      title: "Admin Dashboard",
      description: "Role-based access control (RBAC) and user management included.",
    },
    {
      title: "Mobile First",
      description: "Responsive layout that works perfectly on mobile devices.",
    },
    {
      title: "Taxonomy Inspired",
      description: "Built using the design principles from the popular Taxonomy template.",
    },
  ]
}

export type SiteConfig = typeof siteConfig