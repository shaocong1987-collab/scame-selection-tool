/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 高级品牌官网主题：以黑白灰为底，克制使用科技蓝
        industrial: {
          dark: {
            DEFAULT: '#F5F5F7',
            gray: '#FFFFFF',
            steel: '#E5E5EA',
          },
          light: {
            DEFAULT: '#111111',
            gray: '#6E6E73',
            blue: '#0066CC',
          },
          blue: {
            DEFAULT: '#0066CC',
            dark: '#004A99',
            light: '#E8F2FF',
          },
          accent: {
            electric: '#0066CC',
            safety: '#1D9A6C',
            warning: '#B7791F',
            danger: '#C2410C',
          },
          status: {
            active: '#1D9A6C',
            inactive: '#86868B',
            error: '#C2410C',
          }
        },
        // 向后兼容的原SCAME配色
        scame: {
          blue: '#2563EB',       // 更新为更高对比度蓝色
          red: '#DC2626',        // 更新为更鲜艳红色
          gray: '#475569',       // 中灰，提高对比度
          light: '#F8FAFC',      // 更亮的背景色
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: [
          'IBM Plex Mono',      // 工业代码字体
          'Roboto Mono',
          'monospace'
        ],
        display: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      animation: {
        // 工业动画 - 简洁高效，避免花哨
        'pulse-industrial': 'pulse-industrial 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'status-pulse': 'status-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-industrial': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      boxShadow: {
        'industrial': '0 18px 45px rgba(0, 0, 0, 0.06)',
        'industrial-lg': '0 28px 70px rgba(0, 0, 0, 0.10)',
        'industrial-inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'industrial-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)',
        'panel-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FBFBFD 100%)',
        'tool-gradient': 'linear-gradient(90deg, #FBFBFD 0%, #FFFFFF 50%, #F5F5F7 100%)',
      },
      // 添加自定义间距和边框
      spacing: {
        'panel': '20px',
        'toolbar': '48px',
      },
      borderWidth: {
        'industrial': '1.5px',
      },
      borderRadius: {
        'industrial': '8px',
        'industrial-lg': '12px',
      },
    },
  },
  plugins: [],
};
