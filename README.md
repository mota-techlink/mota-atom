# Conda Enviroment

```bash
conda create -n mota-atom nodejs=20 -y
conda activate mota-atom
```

# Initial Next.JS
```bash
# 初始化 Next.js 项目
npx create-next-app@latest mota-atom --typescript --tailwind --eslint

cd mota-atom
# 进入目录并初始化 Shadcn UI
npx shadcn@latest init
```
>建议选择 Slate 或 Gray 颜色

# Supabase
## 1. Install
```bash
# 安装 Supabase CLI (本地开发核心)
# 使用 NPM 全局安装或通过二进制安装
npm install supabase --save-dev

# 验证安装
npx supabase --version
# 2.72.9
```
## 2. Initial
```bash
npx supabase init
```
>这会在项目根目录生成 supabase 文件夹

## 3. Local Docker
```bash
npx supabase start
```
>此时，你会获得本地的 DB、Auth 和 Studio（本地控制台）。这就是测试环境

## 4. Sync data model
> 当你修改了本地数据库后，生成迁移文件：
```bash
# 将本地变更提取到 migration 文件
npx supabase db diff -f init_schema
npx supabase db diff -f add_user_table
```
>这会在 supabase/migrations/ 下生成一个带时间戳的 .sql 文件。所有的表结构都会以 .sql 文件形式存储在 supabase/migrations 中。你可以直接在 VSCode 里编辑这些 SQL 脚本。

>同步生产： 当你想让线上数据库生效时
```bash
npx supabase db push
```
>你需要先运行 supabase login 并链接到你的远程项目 ID

## 5. Dependencies:
```bash
npm install @supabase/supabase-js @supabase/ssr
```
>需要 @supabase/ssr 包来在 Next.js 的 Server Components 和 Middleware 中安全地操作 Cookie

## 6. Config(Local)
>.env.local
```yaml
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的本地AnonKey
```
## Appendix: Check status
```bash
npx supabase status
```

[Console](http://127.0.0.1:54323/project/default)

[Mailpit](http://127.0.0.1:54323/project/default)

# Light/Dark Mode Support
```bash
npm install next-themes
```
>在 layout.tsx 中包裹 ThemeProvider，Shadcn 的组件会自动响应背景色切换


# Multi-Language Support (i18n)
## 1. Install
```bash
npm install next-intl
```
## 2.Config
src/i18n.ts (请求配置):
src/middleware.ts

>推荐使用 next-intl，它对 Next.js App Router 支持极佳。
目录结构：src/messages/zh.json, src/messages/en.json
路由：使用 [locale] 动态路由。

## 3. Middleware
>src/middleware.ts

# Taxonomy Template

## 1. Install
```bash
npm install gray-matter next-mdx-remote
npm install -D @tailwindcss/typography
```

## 2. Config Tailwind plugin
>tailwind.config.ts

## 3. Content read engin
>src/lib/mdx.ts

## 4. Build 'Resend' Style blog list
>src/app/[locale]/(portal)/blog/page.tsx

# Cloudflare Deploy support
## 1 Adapter
```bash
npm install next@15.5.2 react@19 react-dom@19 --save-exact
npm install -D @cloudflare/next-on-pages
```
## 2. Build
```bash
npx @cloudflare/next-on-pages
```

## 3 Previw(Wrangler)
```bash
npx wrangler pages dev .vercel/output/static
```
>这能让你在上传 GitHub 前，先在本地模拟 Cloudflare 的运行环境。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


📄 License & Copyright
Software Source Code
The source code of this project is licensed under the GNU Affero General Public License v3.0 (AGPLv3).

✅ You can modify and distribute the code.

✅ You must open-source your modifications if you host this as a service.

See the LICENSE file for details.

Data and Assets
The datasets, documentation, and non-code assets (located in data/ and docs/) are licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC-BY-NC-SA 4.0).

✅ You can use the data for analysis or personal projects.

❌ You cannot use the data for commercial purposes (e.g., reselling the dataset).

See the LICENSE-DATA file for details.

💎 Commercial License (Enterprise)
Integrating Mota Atom into a proprietary (closed-source) product? We offer a commercial license that exempts you from the AGPLv3 obligations and provides access to advanced enterprise features.

👉 [Contact us for Licensing] (mailto:contact@motaiot.com)
