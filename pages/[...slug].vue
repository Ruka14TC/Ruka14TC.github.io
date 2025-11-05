<template>
  <div
    v-if="error"
    class="flex h-[calc(100vh-3.5rem)] items-center justify-center"
  >
    <h3 class="scroll-m-20 border-r px-4 py-3 text-2xl font-semibold">
      404
    </h3>
    <span class="scroll-m-20 px-4">
      {{ $t('This page could not be found.') }}
    </span>
  </div>

  <template v-else-if="parsedContent">
    <main
      class="relative py-6"
      :class="[config.toc.enable && 'lg:grid lg:grid-cols-[1fr_220px] lg:gap-14 lg:py-8']"
    >
      <div class="mx-auto w-full min-w-0">
        <LayoutBreadcrumb v-if="config.main.breadCrumb" class="mb-4" />
        <LayoutTitle
          v-if="config.main.showTitle"
          :title="article?.title"
        />

        <!-- 改用 MDCRenderer 直接渲染解析後的內容 -->
        <MDCRenderer
          v-if="parsedContent"
          :body="parsedContent.body"
          :data="parsedContent.data"
          tag="article"
          class="docs-content"
        />

        <LayoutDocsFooter />
      </div>
      <div v-if="config.toc.enable" class="hidden text-sm lg:block">
        <div
          class="sticky"
          :class="[
            (config.aside.useLevel && config.aside.levelStyle === 'aside') ? 'md:top-[91px]' : 'md:top-[133px]',
          ]"
        >
          <LayoutToc :is-small="false" />
        </div>
      </div>
    </main>
  </template>
</template>

<script setup lang="ts">
/**
 * 文章檢視元件
 * 支援 SSG 模式，從外部 API 載入文章並在建置時預渲染
 */
import { parseMarkdown } from '@nuxtjs/mdc/runtime';

const route = useRoute();
const { loadArticle, article, parsedContent, error } = useArticle();

// 從路由參數取得文章 ID
const slugArray = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug];
const articleIdStr = slugArray[slugArray.length - 1];
const articleId = Number(articleIdStr);

/**
 * 使用 useAsyncData 在 SSG 時預先載入資料
 * 資料會被序列化到 payload，客戶端直接使用不會重新請求 API
 */
const { data: articleData } = await useAsyncData(
  `article-${articleId}`,
  async () => {
    try {
      // 載入文章資料
      await loadArticle(articleId);

      // 若有內容則解析 Markdown
      if (article.value?.content) {
        const parsed = await parseMarkdown(article.value.content);
        parsedContent.value = parsed;

        // 返回完整資料以便序列化
        return {
          article: article.value,
          parsedContent: parsed,
          success: true,
        };
      }

      return {
        article: article.value,
        parsedContent: null,
        success: false,
      };
    } catch (e) {
      console.error('[載入文章時發生錯誤]:', e);
      error.value = true;
      return {
        article: null,
        parsedContent: null,
        success: false,
      };
    }
  },
  {
    // 關鍵設定：確保在客戶端使用快取的資料，不重新請求
    lazy: false,
    server: true,
    getCachedData: (key) => {
      const nuxtApp = useNuxtApp();
      // 優先使用 payload 中的資料
      const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];

      if (cached) {
        // 恢復 article 和 parsedContent 的狀態
        if (cached.article) {
          article.value = cached.article;
        }
        if (cached.parsedContent) {
          parsedContent.value = cached.parsedContent;
        }
      }

      return cached;
    },
  },
);

const config = useConfig();
const appConfig = useAppConfig();

/**
 * SEO 設定
 */
const pageTitle = computed(() => {
  const title = article.value?.title ?? '404';
  const siteName = config.value?.site?.name ?? 'Ruka14TC';
  return `${title} - ${siteName}`;
});

const ogTitle = computed(() => article.value?.title ?? '404');
const ogImageTitle = computed(() => article.value?.title ?? '');

useSeoMeta({
  title: pageTitle,
  ogTitle,
  twitterCard: 'summary_large_image',
});

defineOgImageComponent(config.value?.site?.ogImageComponent ?? 'Ruka14TC', {
  title: ogImageTitle,
});
</script>
