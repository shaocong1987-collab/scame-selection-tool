# Technology Stack

**Analysis Date:** 2026-04-16

## Languages

**Primary:**
- TypeScript 5.3.3 - 全栈开发，严格类型检查
- JavaScript (ES2022+) - 构建产物和浏览器运行

**Secondary:**
- CSS with Tailwind - 样式系统
- JSX/TSX - React组件模板

## Runtime

**Environment:**
- Node.js >=18.0.0
- 浏览器环境：现代浏览器（支持ES2022+）

**Package Manager:**
- pnpm >=8.0.0 (推荐)
- npm 兼容（package-lock.json存在）
- Lockfile: `package-lock.json` 存在

## Frameworks

**Core:**
- React 18.2.0 - UI框架
- Vite 5.0.8 - 构建工具和开发服务器
- TypeScript 5.3.3 - 类型系统和编译

**状态管理:**
- Zustand 4.4.7 - 轻量级状态管理
- React Query 5.18.0 - 服务器状态管理

**路由:**
- React Router DOM 6.20.1 - 客户端路由

**表单处理:**
- React Hook Form 7.48.2 - 表单管理
- Zod 3.22.4 - 表单验证模式

**样式系统:**
- Tailwind CSS 3.3.6 - 实用优先CSS框架
- Tailwind Merge 2.2.0 - 类名合并工具
- PostCSS 8.4.32 - CSS处理
- Autoprefixer 10.4.16 - 浏览器前缀

**图标库:**
- Lucide React 1.8.0 - 图标组件

**工具类:**
- clsx 2.0.0 - 条件类名组合
- @hookform/resolvers 3.3.2 - 表单验证解析器

## 测试框架

**单元测试:**
- Vitest 1.1.0 - 测试运行器
- React Testing Library 14.1.2 - React组件测试
- Jest DOM 6.1.5 - DOM断言扩展
- User Event 14.5.1 - 用户交互模拟
- JSDOM 23.0.1 - DOM环境模拟

**E2E测试:**
- Playwright 1.40.1 - 端到端测试

## 开发工具

**代码质量:**
- ESLint 8.56.0 - 代码检查
- Prettier 3.1.1 - 代码格式化
- TypeScript ESLint 6.15.0 - TypeScript规则

**构建配置:**
- Vite配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/vite.config.ts`
- TypeScript配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/tsconfig.json`
- Tailwind配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/tailwind.config.js`
- PostCSS配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/postcss.config.js`

## Key Dependencies

**关键业务逻辑:**
- 自定义SCAME编码解析库：`src/lib/scame/coding.ts`
- 产品匹配算法：`src/lib/scame/matching.ts`
- RAG系统：`src/lib/rag/` 目录

**HTTP客户端:**
- Axios 1.6.7 - HTTP请求库（已安装但当前未使用）

**UI组件:**
- Headless UI (计划中，当前使用自定义组件)

## Configuration

**环境配置:**
- 当前无 `.env` 文件
- 配置通过硬编码或未来环境变量管理
- 需要配置的变量：RAG向量数据库连接、API端点等

**构建配置:**
- Vite开发服务器：端口3000，host: true
- 路径别名：`@/*` → `src/*`
- 严格TypeScript模式启用
- 测试覆盖率报告：v8提供器

**代码检查配置:**
- ESLint配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/.eslintrc.cjs`
- Prettier配置：`/Users/sunshaocong/claude/startup/scame-selection-tool/.prettierrc.json`
- 规则：单引号、尾随逗号、100字符行宽、2空格缩进

## Platform Requirements

**开发环境:**
- Node.js 18+
- pnpm 8+ (推荐) 或 npm
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

**生产环境:**
- 静态文件托管（Vercel、Netlify、GitHub Pages等）
- 需要后端API服务（计划中）
- 向量数据库服务（ChromaDB、Pinecone等）

**浏览器支持:**
- ES2022+ 特性
- 模块化JavaScript
- CSS Grid/Flexbox
- 现代Web API

---

*Stack analysis: 2026-04-16*