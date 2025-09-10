# HoverTabOfLink - 智能链接预览扩展

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/HoverTabOfLink)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![WXT](https://img.shields.io/badge/WXT-0.20.6-orange.svg)](https://wxt.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org)

一款现代化的浏览器链接预览工具，通过悬浮窗口预览体验，帮助用户在不离开当前页面的情况下快速获取链接信息，提升网页浏览和信息获取的效率。

## 📑 目录

- [📖 项目概述](#-项目概述)
- [🌟 产品特色](#-产品特色)
- [🎯 目标用户](#-目标用户)
- [✨ 核心功能](#-核心功能)
- [🛠️ 技术架构](#️-技术架构)
- [🚀 快速开始](#-快速开始)
- [📚 使用方法](#-使用方法)
- [📦 开发命令](#-开发命令)
- [🎨 自定义开发](#-自定义开发)
- [🌐 浏览器支持](#-浏览器支持)
- [📋 性能要求](#-性能要求)
- [🔧 故障排除](#-故障排除)
- [📊 性能指标](#-性能指标)
- [🗺️ 发展路线图](#️-发展路线图)
- [📈 更新日志](#-更新日志)
- [📄 许可证](#-许可证)
- [🤝 贡献指南](#-贡献指南)
- [🙏 致谢](#-致谢)
- [📞 联系我们](#-联系我们)
- [⭐ 支持项目](#-支持项目)

## 📖 项目概述

HoverTabOfLink 是一个基于现代 Web 扩展技术栈构建的智能链接预览工具。它采用 Manifest V3 规范，使用 WXT 框架、React 18、TypeScript 和 Tailwind CSS 4.0 等前沿技术，为用户提供流畅、高效、可高度自定义的链接预览体验。

### 核心价值

- **提升浏览效率** - 无需打开新标签页即可预览链接内容
- **减少认知负担** - 保持当前页面上下文，避免频繁切换
- **个性化体验** - 丰富的自定义选项满足不同用户需求
- **现代化架构** - 基于最新技术栈，保证性能和可维护性

## 🌟 产品特色

- 🔗 **智能链接预览** - 悬停或拖拽链接即可在悬浮窗中预览网页内容
- 🎯 **多种触发方式** - 支持拖动链接、鼠标悬停、快捷键等多种触发方式
- 🎨 **高度可定制** - 丰富的主题选择和个性化设置选项
- 📱 **响应式设计** - 可调整大小的悬浮窗，支持自由缩放
- ⚙️ **侧边栏设置** - 通过浏览器侧边栏提供完整的配置界面
- 🚀 **现代技术栈** - 基于 WXT + React + TypeScript + Tailwind CSS 构建

## 🎯 目标用户

### 主要用户群体

| 用户类型 | 使用场景 | 核心需求 |
|----------|----------|----------|
| **📚 内容研究者与学生** | 学术研究、资料收集 | 快速查阅大量链接而不频繁切换标签页 |
| **💼 高效率工作者** | 邮件处理、项目管理 | 在工作流程中快速预览相关链接内容 |
| **🌐 普通网民** | 社交媒体、新闻浏览 | 对链接内容好奇但不想打断当前浏览节奏 |
| **🔍 信息筛选者** | 内容审核、信息验证 | 批量预览链接以快速筛选有价值内容 |
| **📝 内容创作者** | 写作、编辑工作 | 引用链接时需要快速确认内容准确性 |

## ✨ 核心功能

### 🔍 链接预览悬浮窗

#### 悬浮窗结构

- **Header (顶部)**
  - 网址显示区：显示当前预览页面的完整 URL，点击可在新标签页打开
  - 操作按钮区：固定、刷新、新标签页打开、关闭等功能按钮

- **Content (中部)**
  - 网页渲染区：使用 iframe 嵌入和渲染目标链接的网页内容
  - 宽度调整把手：左右两侧的拖拽把手，可实时调整悬浮窗宽度


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

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **WXT** | 0.20.6 | 下一代 Web 扩展开发框架 |
| **React** | 19.1.0 | 用户界面构建 |
| **TypeScript** | 5.8.3 | 类型安全的 JavaScript |
| **Tailwind CSS** | 4.1.11 | 原子化 CSS 框架 |
| **Vite** | - | 快速构建工具 |
| **shadcn/ui** | - | 现代化 UI 组件库 |

### 扩展架构

- **Manifest V3** - 符合最新浏览器扩展规范
- **Side Panel API** - 使用浏览器原生侧边栏
- **Content Scripts** - 页面内容交互
- **Background Service Worker** - 后台任务处理
- **Storage API** - 用户设置持久化

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

### 系统要求

| 环境 | 最低版本 | 推荐版本 |
|------|----------|----------|
| **Node.js** | 18.0.0+ | 20.0.0+ |
| **pnpm** | 8.0.0+ | 9.10.0+ |
| **浏览器** | Chrome 88+ | Chrome 最新版 |

> **注意**: 项目使用 `pnpm@9.10.0` 作为包管理器，建议使用相同版本以确保依赖一致性。

### 安装指南

#### 1. 获取源码

```bash
# 克隆仓库
git clone <repository-url>
cd HoverTabOfLinkLatest

# 或者下载 ZIP 文件并解压
```

#### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

#### 3. 开发模式

```bash
# 启动开发服务器 (默认 Chrome)
pnpm run dev

# 或指定浏览器
pnpm run dev:chrome   # Chrome
pnpm run dev:firefox  # Firefox
pnpm run dev:edge     # Edge
pnpm run dev:safari   # Safari
```

#### 4. 加载扩展

**Chrome/Edge:**
1. 打开 `chrome://extensions/` 或 `edge://extensions/`
2. 启用右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录下的 `.output/chrome-mv3` 文件夹

**Firefox:**
1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击"临时载入附加组件"
3. 选择 `.output/firefox-mv2/manifest.json` 文件

#### 5. 生产构建

```bash
# 构建所有浏览器版本
pnpm run build

# 构建特定浏览器
pnpm run build:chrome
pnpm run build:firefox
pnpm run build:edge
pnpm run build:safari

# 创建发布包
pnpm run zip
pnpm run zip:chrome
```

## 📚 使用方法

### 基础使用

1. **打开设置面板**
   - 点击浏览器工具栏中的扩展图标
   - 或使用快捷键打开浏览器侧边栏

2. **配置触发方式**
   - 在设置面板中选择偏好的触发方式
   - 可选择：拖动链接、鼠标悬停、快捷键点击等

3. **预览链接**
   - 在任意网页中按配置的方式触发链接预览
   - 悬浮窗将显示链接内容的实时预览

4. **自定义窗口**
   - 使用悬浮窗边缘的调整把手改变大小
   - 拖拽标题栏移动窗口位置
   - 点击固定按钮保持窗口显示

### 高级功能

- **多主题支持**: 在设置中切换浅色/深色主题
- **快捷键自定义**: 配置个人偏好的快捷键组合
- **网站黑名单**: 为特定网站禁用预览功能
- **搜索集成**: 拖拽文本进行快速搜索

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

### 响应性能

- **触发响应**: 悬浮窗在触发后 < 200ms 内显示
- **内容加载**: 目标页面在 < 2s 内完成基础渲染
- **交互流畅**: 窗口调整、拖拽等操作保持 60fps

### 资源管理

- **内存占用**: 未激活状态 < 10MB，激活状态 < 50MB
- **CPU 使用**: 后台运行 < 1%，预览时 < 5%
- **网络请求**: 智能缓存，避免重复加载相同内容

### 数据存储

- **设置同步**: 使用 `chrome.storage.sync` 跨设备同步用户配置
- **本地缓存**: 使用 `chrome.storage.local` 缓存预览内容
- **存储限制**: 总存储空间 < 5MB，自动清理过期数据

## 🔧 故障排除

### 常见问题

**Q: 扩展无法加载或显示错误？**
A: 
1. 确保使用的是受支持的浏览器版本
2. 检查是否启用了开发者模式
3. 尝试重新加载扩展或重启浏览器
4. 查看浏览器控制台是否有错误信息

**Q: 悬浮窗无法显示或内容为空？**
A:
1. 检查目标网站是否设置了 X-Frame-Options 限制
2. 确认网站是否支持 iframe 嵌入
3. 尝试在设置中调整触发方式
4. 检查是否被网站黑名单功能禁用

**Q: 设置无法保存或丢失？**
A:
1. 确保浏览器允许扩展访问存储权限
2. 检查浏览器存储空间是否充足
3. 尝试重置设置到默认值
4. 重新安装扩展

**Q: 性能问题或页面卡顿？**
A:
1. 在设置中增加悬停延迟时间
2. 减少同时打开的预览窗口数量
3. 为高资源消耗网站添加黑名单
4. 检查浏览器内存使用情况

### 调试模式

开发模式下可以通过以下方式获取调试信息：

```bash
# 启动开发模式
pnpm run dev

# 查看扩展日志
# 1. 打开 chrome://extensions/
# 2. 找到 HoverTabOfLink 扩展
# 3. 点击 "检查视图" -> "service worker"
# 4. 在控制台查看日志信息
```

## 📊 性能指标

### 资源占用

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **内存占用** | < 50MB | 未激活状态下的内存使用 |
| **CPU 使用率** | < 5% | 后台运行时的 CPU 占用 |
| **启动时间** | < 200ms | 扩展初始化时间 |
| **预览响应** | < 500ms | 触发到显示的延迟时间 |

### 兼容性测试

| 浏览器 | 版本范围 | 测试状态 |
|--------|----------|----------|
| **Chrome** | 88+ | ✅ 完全支持 |
| **Edge** | 88+ | ✅ 完全支持 |
| **Firefox** | 78+ | ✅ 完全支持 |
| **Safari** | 14+ | ⚠️ 部分支持 |
| **Opera** | 74+ | ✅ 完全支持 |

## 🗺️ 发展路线图

### v1.1.0 (计划中)
- [ ] 智能内容摘要功能
- [ ] 预览历史记录
- [ ] 键盘快捷键支持
- [ ] 更多主题选项

### v1.2.0 (规划中)
- [ ] 多语言界面支持
- [ ] 云端设置同步
- [ ] 预览窗口标签页功能
- [ ] 内容搜索和高亮

### v2.0.0 (长期规划)
- [ ] AI 驱动的内容分析
- [ ] 多窗口并行预览
- [ ] 自定义预览模板
- [ ] 企业级功能支持

## 📈 更新日志

### v1.0.0 (2024-01-XX)

**🎉 首次发布**

**新功能:**
- ✨ 智能链接预览悬浮窗
- ⚙️ 完整的设置面板
- 🎨 多主题支持
- 🔧 多种触发方式
- 📱 响应式设计
- 🌐 多浏览器支持

**技术特性:**
- 🏗️ 基于 WXT 框架构建
- ⚡ React 18 + TypeScript
- 🎨 Tailwind CSS 4.0
- 📦 Manifest V3 规范
- 🔒 现代安全架构

## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 许可证开源。

```
Copyright 2024 HoverTabOfLink Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### 第三方许可证

本项目使用了以下开源库，请查看各自的许可证：
- [React](https://github.com/facebook/react/blob/main/LICENSE) - MIT License
- [WXT](https://github.com/wxt-dev/wxt/blob/main/LICENSE) - MIT License
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) - MIT License
- [shadcn/ui](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) - MIT License

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是 bug 报告、功能建议、代码贡献还是文档改进。

### 贡献流程

1. **Fork 仓库**
   ```bash
   # Fork 本仓库到你的 GitHub 账户
   # 然后克隆你的 fork
   git clone https://github.com/your-username/HoverTabOfLink.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **开发和测试**
   ```bash
   # 安装依赖
   pnpm install
   
   # 启动开发服务器
   pnpm run dev
   
   # 类型检查
   pnpm run compile
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # 或
   git commit -m "fix: fix your bug description"
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   # 然后在 GitHub 上创建 Pull Request
   ```

### 代码规范

- **TypeScript**: 使用严格的类型检查
- **React**: 遵循 React 18+ 最佳实践
- **样式**: 使用 Tailwind CSS 类名
- **组件**: 优先使用 shadcn/ui 组件
- **提交信息**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

### 报告问题

在提交 issue 时，请包含：
- 详细的问题描述
- 复现步骤
- 预期行为 vs 实际行为
- 浏览器版本和操作系统信息
- 相关的错误日志或截图

### 功能建议

我们欢迎新功能建议！请在 issue 中描述：
- 功能的使用场景
- 预期的用户体验
- 可能的实现方案
- 对现有功能的影响

## 🙏 致谢

感谢以下开源项目和社区的支持：

- [WXT](https://wxt.dev) - 现代化的 Web 扩展开发框架
- [React](https://reactjs.org) - 用户界面构建库
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com) - 精美的 React 组件库
- [Radix UI](https://www.radix-ui.com) - 无障碍的 UI 基础组件
- [Lucide](https://lucide.dev) - 精美的图标库

特别感谢所有贡献者和用户的反馈与支持！

## 📞 联系我们

- **GitHub Issues**: [报告问题或建议](https://github.com/your-username/HoverTabOfLink/issues)
- **GitHub Discussions**: [社区讨论](https://github.com/your-username/HoverTabOfLink/discussions)
- **Email**: your-email@example.com

## ⭐ 支持项目

如果这个项目对你有帮助，请考虑：

- 🌟 给项目点个 Star
- 🐛 报告 Bug 或提出改进建议
- 💡 贡献代码或文档
- 📢 向朋友推荐这个项目

---

<div align="center">

**使用 ❤️ 构建**

基于 [WXT](https://wxt.dev) • [React](https://reactjs.org) • [Tailwind CSS](https://tailwindcss.com) • [shadcn/ui](https://ui.shadcn.com)

[⬆️ 回到顶部](#hovertaboflink---智能链接预览扩展)

</div>
