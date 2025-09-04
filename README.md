# HoverTabOfLink - 智能链接预览扩展

一款现代化的浏览器链接预览工具，通过悬浮窗口预览体验，帮助用户在不离开当前页面的情况下快速获取链接信息，提升网页浏览和信息获取的效率。

## 🌟 产品特色

- 🔗 **智能链接预览** - 悬停或拖拽链接即可在悬浮窗中预览网页内容
- 🎯 **多种触发方式** - 支持拖动链接、鼠标悬停、快捷键等多种触发方式
- 🎨 **高度可定制** - 丰富的主题选择和个性化设置选项
- 📱 **响应式设计** - 可调整大小的悬浮窗，支持自由缩放
- ⚙️ **侧边栏设置** - 通过浏览器侧边栏提供完整的配置界面
- 🚀 **现代技术栈** - 基于 WXT + React + TypeScript + Tailwind CSS 构建

## 🎯 目标用户

- **内容研究者与学生**: 需要快速查阅大量链接资料而不想频繁切换标签页
- **高效率工作者**: 在处理邮件、文档或项目管理工具时，快速预览相关链接内容
- **普通网民**: 在浏览论坛、新闻、社交媒体时，对链接内容感到好奇但不想打断当前浏览节奏

## ✨ 核心功能

### 🔍 链接预览悬浮窗

#### 悬浮窗结构

- **Header (顶部)**
  - 网址显示区：显示当前预览页面的完整 URL，点击可在新标签页打开
  - 操作按钮区：固定、刷新、新标签页打开、关闭等功能按钮

- **Content (中部)**
  - 网页渲染区：使用 iframe 嵌入和渲染目标链接的网页内容
  - 宽度调整把手：左右两侧的拖拽把手，可实时调整悬浮窗宽度

- **Footer (底部)**
  - 高度调整把手：中间区域可拖拽调整悬浮窗高度
  - 角调整把手：左下角和右下角的圆弧把手，支持等比缩放

### ⚙️ 设置面板功能

#### 链接预览设置

- **触发方式**: 拖动链接、鼠标悬停、Alt+鼠标左键点击等
- **自定义快捷键**: 支持 Alt、Ctrl、Shift 等修饰键组合
- **悬停延迟**: 100ms - 2000ms 可调节延迟时间
- **弹窗大小**: 上次大小、默认大小、内容自适应
- **弹窗位置**: 跟随鼠标、屏幕居中、屏幕右上角
- **弹窗主题**: 浅色、深色、蓝色、红色、黄色、绿色及自定义主题
- **背景遮罩透明度**: 0%-100% 可调节透明度

#### 拖拽文字设置

- **搜索引擎设置**: 默认使用必应搜索
- **自动打开链接**: 拖拽文本为链接时是否自动预览
- **禁用网站命令**: 支持通配符的网站黑名单

#### 语言设置

- **多语言支持**: 默认简体中文，支持界面语言切换

## 🛠️ 技术架构

### 技术栈

- **开发框架**: WXT (Next-generation Web Extension development framework)
- **前端库**: React 18 + TypeScript
- **样式框架**: Tailwind CSS 4.0
- **UI 组件**: shadcn/ui
- **扩展规范**: Manifest V3
- **构建工具**: Vite

### 项目结构

```
HoverTabOfLinkLatest/
├── entrypoints/           # 扩展入口点
│   ├── background.ts      # 后台脚本
│   ├── content.ts         # 内容脚本
│   └── sidepanel/         # 侧边栏 UI
│       ├── App.tsx        # 主 React 应用
│       ├── index.html     # HTML 模板
│       └── main.tsx       # React 入口点
├── components/            # React 组件
│   └── ui/                # shadcn/ui 组件
├── lib/                   # 工具函数
│   └── utils.ts           # 通用工具
├── hooks/                 # 自定义 React Hooks
│   ├── use-theme.ts       # 主题管理 Hook
│   ├── use-settings.ts    # 设置存储 Hook
│   └── use-mobile.ts      # 移动端检测 Hook
├── assets/                # 静态资源
├── public/                # 公共资源 (图标等)
├── app.config.ts          # 运行时配置
├── components.json        # shadcn/ui 配置
├── wxt.config.ts          # WXT 配置
└── package.json           # 依赖和脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd HoverTabOfLinkLatest
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发**
   ```bash
   pnpm dev
   ```

4. **加载扩展到浏览器**
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `.output/chrome-mv3` 文件夹

### 使用方法

1. 点击浏览器工具栏中的扩展图标打开设置面板
2. 在设置面板中配置触发方式和个性化选项
3. 在网页中按配置的方式触发链接预览功能
4. 使用悬浮窗的调整把手自定义窗口大小

## 📦 开发命令

```bash
# 开发模式 (默认 Chrome)
pnpm dev

# 特定浏览器开发
pnpm dev:chrome
pnpm dev:firefox
pnpm dev:edge
pnpm dev:safari

# 生产构建 (默认 Chrome)
pnpm build

# 特定浏览器构建
pnpm build:chrome
pnpm build:firefox
pnpm build:edge
pnpm build:safari

# 创建扩展压缩包
pnpm zip
pnpm zip:chrome
pnpm zip:firefox
pnpm zip:edge
pnpm zip:safari

# 类型检查
pnpm compile
```

## 🎨 自定义开发

### 添加 shadcn/ui 组件

项目已预配置 shadcn/ui，可直接添加组件：

```bash
# 添加按钮组件
pnpm dlx shadcn@latest add button

# 添加对话框组件
pnpm dlx shadcn@latest add dialog
```

### 样式定制

- 编辑 `assets/tailwind.css` 修改全局样式
- 在 `components.json` 中修改主题颜色
- 在 `wxt.config.ts` 中配置 Tailwind CSS 4.0

### 扩展配置

- 在 `wxt.config.ts` 中更新 manifest 权限
- 在 `package.json` 中修改扩展元数据
- 在 `public/icon/` 中更换图标

### 侧边栏内容

- 编辑 `entrypoints/sidepanel/App.tsx` 修改主 UI
- 根据需要添加新的路由/页面
- 扩展更多 React 组件

## 🌐 浏览器支持

通过 WXT 的通用浏览器兼容性，支持所有主流浏览器：

- ✅ **Chrome** (Manifest V3) - `pnpm dev:chrome`, `pnpm build:chrome`
- ✅ **Firefox** (Manifest V2) - `pnpm dev:firefox`, `pnpm build:firefox`
- ✅ **Edge** (Manifest V3) - `pnpm dev:edge`, `pnpm build:edge`
- ✅ **Safari** (Manifest V2) - `pnpm dev:safari`, `pnpm build:safari`
- ✅ **其他基于 Chromium 的浏览器** (Opera, Brave 等)

## 📋 性能要求

- **响应速度**: 触发预览后悬浮窗立即出现，无明显延迟
- **资源占用**: 未激活状态下保持极低的 CPU 和内存占用
- **数据存储**: 使用 `chrome.storage.sync` 或 `chrome.storage.local` 持久化用户设置

## 🗺️ 未来规划

- **智能文本处理**: 集成 AI 能力，支持内容总结、翻译、关键词提取
- **历史记录**: 提供预览历史列表，快速重新打开之前预览的链接
- **多链接模式**: 支持同时固定多个预览窗口，方便内容对比

## 📄 许可证

本项目基于 Apache License 2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

Apache-2.0 License - 欢迎在您的项目中自由使用此模板！

## 🤝 贡献

1. Fork 本仓库
2. 创建功能分支
3. 提交您的更改
4. 提交 Pull Request

---

使用 ❤️ 构建，基于 [WXT](https://wxt.dev)、[Tailwind CSS](https://tailwindcss.com) 和 [shadcn/ui](https://ui.shadcn.com)
