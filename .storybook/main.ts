import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', './**/*.mdx', './**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-onboarding', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (viteConfig) => {
    viteConfig.optimizeDeps = viteConfig.optimizeDeps || {}
    viteConfig.optimizeDeps.exclude = viteConfig.optimizeDeps.exclude || []
    viteConfig.optimizeDeps.exclude.push('@prisma/client')
    viteConfig.build = viteConfig.build || {}
    viteConfig.build.rollupOptions = viteConfig.build.rollupOptions || {}
    if (!viteConfig.build.rollupOptions.external) {
      viteConfig.build.rollupOptions.external = ['@prisma/client']
    } else if (Array.isArray(viteConfig.build.rollupOptions.external)) {
      viteConfig.build.rollupOptions.external.push('@prisma/client')
    }
    return viteConfig
  },
}

process.env.STORYBOOK = '1'

export default config
