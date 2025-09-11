import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  alias: {
    '@': path.resolve(__dirname, './'),
  },
  vite: () => ({
    plugins: [tailwindcss()],
    // 关闭开发阶段的 CSS 源码映射，减少无害告警输出
    css: {
      devSourcemap: false,
    },
    // 关闭构建 sourcemap，避免插件在生成阶段提示映射不准确
    build: {
      sourcemap: false,
    },
  }),
  manifest: {
    permissions: ['sidePanel', 'storage', 'activeTab'],
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: 'Open Sidepanel'
    }
  },
});
