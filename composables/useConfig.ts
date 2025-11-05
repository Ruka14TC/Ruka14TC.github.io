/**
 * Config Composable
 */
import { createDefu } from 'defu';

/**
 * 自訂 defu 合併函式
 * 處理字串陣列的特殊合併邏輯
 */
const customDefu = createDefu((obj, key, value) => {
  if (Array.isArray(value) && value.every((x: any) => typeof x === 'string')) {
    obj[key] = value;
    return true;
  }
});

/**
 * 預設設定
 */
const defaultConfig: DefaultConfig = {
  site: {
    name: 'Ruka14TC',
    description: 'FF14繁中小攻略',
    ogImage: '/hero.png',
    ogImageComponent: 'Ruka14TC',
    ogImageColor: 'light',
    umami: {
      enable: false,
      src: 'https://cloud.umami.is/script.js',
      dataWebsiteId: '',
    },
  },
  theme: {
    customizable: true,
    color: 'zinc',
    radius: 0.5,
  },
  banner: {
    enable: false,
    showClose: true,
    content: 'Welcome to **Ruka14TC**',
    to: '',
    target: '_blank',
    border: true,
  },
  header: {
    showLoadingIndicator: true,
    title: 'Ruka14TC',
    showTitle: true,
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
    },
    showTitleInMobile: false,
    border: false,
    darkModeToggle: true,
    languageSwitcher: {
      enable: true,
      triggerType: 'icon',
      dropdownType: 'select',
    },
    nav: [],
    links: [],
  },
  aside: {
    useLevel: true,
    levelStyle: 'aside',
    headerLevelNavAlign: 'start',
    collapse: false,
    collapseLevel: 1,
    folderStyle: 'default',
  },
  main: {
    breadCrumb: true,
    showTitle: true,
    codeCopyToast: false,
    codeCopyIcon: 'lucide:clipboard',
    codeCopyToastText: 'Copied to clipboard!',
    fieldRequiredText: 'required',
    padded: true,
    editLink: {
      enable: false,
      pattern: '',
      text: 'Edit this page',
      icon: 'lucide:square-pen',
      placement: ['docsFooter'],
    },
    backToTop: true,
    pm: ['npm', 'pnpm', 'bun', 'yarn'],
    imageZoom: true,
    codeIcon: {
      'package.json': 'vscode-icons:file-type-node',
      'tsconfig.json': 'vscode-icons:file-type-tsconfig',
      '.npmrc': 'vscode-icons:file-type-npm',
      '.editorconfig': 'vscode-icons:file-type-editorconfig',
      '.eslintrc': 'vscode-icons:file-type-eslint',
      '.eslintrc.cjs': 'vscode-icons:file-type-eslint',
      '.eslintignore': 'vscode-icons:file-type-eslint',
      'eslint.config.js': 'vscode-icons:file-type-eslint',
      'eslint.config.mjs': 'vscode-icons:file-type-eslint',
      'eslint.config.cjs': 'vscode-icons:file-type-eslint',
      '.gitignore': 'vscode-icons:file-type-git',
      'yarn.lock': 'vscode-icons:file-type-yarn',
      '.env': 'vscode-icons:file-type-dotenv',
      '.env.example': 'vscode-icons:file-type-dotenv',
      '.vscode/settings.json': 'vscode-icons:file-type-vscode',
      'nuxt': 'vscode-icons:file-type-nuxt',
      '.nuxtrc': 'vscode-icons:file-type-nuxt',
      '.nuxtignore': 'vscode-icons:file-type-nuxt',
      'nuxt.config.js': 'vscode-icons:file-type-nuxt',
      'nuxt.config.ts': 'vscode-icons:file-type-nuxt',
      'nuxt.schema.ts': 'vscode-icons:file-type-nuxt',
      'tailwind.config.js': 'vscode-icons:file-type-tailwind',
      'tailwind.config.ts': 'vscode-icons:file-type-tailwind',
      'vue': 'vscode-icons:file-type-vue',
      'ts': 'vscode-icons:file-type-typescript',
      'tsx': 'vscode-icons:file-type-typescript',
      'mjs': 'vscode-icons:file-type-js',
      'cjs': 'vscode-icons:file-type-js',
      'js': 'vscode-icons:file-type-js',
      'jsx': 'vscode-icons:file-type-js',
      'md': 'vscode-icons:file-type-markdown',
      'mdc': 'vscode-icons:file-type-markdown',
      'css': 'vscode-icons:file-type-css',
      'py': 'vscode-icons:file-type-python',
      'npm': 'vscode-icons:file-type-npm',
      'pnpm': 'vscode-icons:file-type-pnpm',
      'pnpm-lock.yaml': 'vscode-icons:file-type-pnpm',
      'pnpm-workspace.yaml': 'vscode-icons:file-type-pnpm',
      'npx': 'vscode-icons:file-type-npm',
      'yarn': 'vscode-icons:file-type-yarn',
      'bun': 'vscode-icons:file-type-bun',
      'bun.lock': 'vscode-icons:file-type-bun',
      'deno': 'vscode-icons:file-type-deno',
      'yml': 'vscode-icons:file-type-light-yaml',
      'json': 'vscode-icons:file-type-json',
      'terminal': 'lucide:terminal',
    },
  },
  footer: {
    border: true,
    credits: '',
    links: [],
  },
  toc: {
    enable: false,
    enableInMobile: false,
    enableInHomepage: false,
    title: '目錄',
    links: [],
    iconLinks: [],
    carbonAds: {
      enable: false,
      disableInDev: false,
      disableInMobile: false,
      fallback: false,
      fallbackMessage: 'Please support us by disabling your ad blocker.',
      code: '',
      placement: '',
      format: 'cover',
    },
  },
  search: {
    enable: false,
    inAside: false,
    style: 'input',
    placeholder: 'Search...',
    placeholderDetailed: 'Search documentation...',
  },
};

/**
 * Config Composable
 *
 * @returns {ComputedRef} 合併後的設定物件
 */
export function useConfig() {
  // 使用 tryUseNuxtApp 來安全地取得 Nuxt 實例
  const nuxtApp = tryUseNuxtApp();

  // 取得 app.config.ts 中的設定
  const appConfig = computed(() => {
    // 如果 Nuxt 實例不存在（例如在預渲染的某些階段），返回空物件
    if (!nuxtApp) {
      return {};
    }
    return useAppConfig()?.shadcnDocs || {};
  });

  return computed(() => {
    // 使用 customDefu 合併 appConfig 和 defaultConfig
    const processedConfig = customDefu(appConfig.value, defaultConfig);

    return {
      ...processedConfig,
      // 直接使用處理後的設定,不再從 navigation 或 page 中覆寫
      header: processedConfig.header as DefaultConfig['header'],
      banner: processedConfig.banner as DefaultConfig['banner'],
      main: processedConfig.main as DefaultConfig['main'],
      aside: processedConfig.aside as DefaultConfig['aside'],
      toc: processedConfig.toc as DefaultConfig['toc'],
      footer: processedConfig.footer as DefaultConfig['footer'],
    };
  });
}
