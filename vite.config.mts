import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import importToCDN from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  envDir: './env',
  resolve: {
    // 配置别名
    alias: {
      '@': '/src' // @表示src目录
    }
  },
  css: {
    // 启用 CSS Modules
    modules: {
      localsConvention: 'camelCase' // 或者 'dashes' | 'camelCaseOnly'
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin(),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false
    }),
    importToCDN({
      modules: ['react', 'react-dom'],
      enableInDevMode: true
    })
    // viteCompression({
    //   algorithm: 'gzip',
    //   threshold: 10240,
    //   verbose: true, // 是否在控制台中输出压缩结果
    //   ext: '.gz',
    //   deleteOriginFile: true, // 源文件压缩后是否删除
    // }),
  ],
  // server: {
  //   proxy: {
  //     "/api": "localhost:8080"
  //   }
  // },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  esbuild: {
    // drop: ['console', 'debugger'], // dev执行
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500, // 单位 kb
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        experimentalMinChunkSize: 10 * 1024, // 单位b 合并小chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      },
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log']
      },
      external: ['react', 'react-dom']
    },
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      // 生产环境时移除console等
      compress: {
        pure_funcs: ['console.log'], // 只删除 console.log
        drop_console: true, // 删除所有 console
        drop_debugger: true
      }
    }
  }
});
