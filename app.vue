<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <LayoutBanner v-if="config.banner.enable" />
  <LayoutHeader />
  <div
    v-if="!pageConfig.fullpage && baseRouteName !== 'index'"
    class="min-h-screen"
    :class="{ 'border-b': config.footer.border }"
  >
    <div
      class="flex-1 items-start px-4 md:grid md:gap-6 md:px-8 lg:gap-10"
      :class="[
        config.main.padded && 'container',
        pageConfig.aside && 'md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]',
      ]"
    >
      <aside
        v-if="pageConfig.aside"
        class="fixed z-30 -ml-2 hidden w-full shrink-0 overflow-y-auto top-[102px] md:sticky md:block"
        :class="[
          (config.aside.useLevel && config.aside.levelStyle === 'aside') ? 'h-[calc(100vh-3.5rem)] md:top-[61px]' : 'h-[calc(100vh-6rem)] md:top-[101px]',
        ]"
      >
        <LayoutAside :is-mobile="false" />
      </aside>
      <NuxtPage />
    </div>
  </div>
  <div v-else class="min-h-screen">
    <NuxtPage />
  </div>

  <Toaster />
  <!-- <LayoutFooter /> -->
</template>

<script setup lang="ts">
/**
 * App 根元件
 */
import Toaster from '@/components/ui/toast/Toaster.vue';

// 取得設定和路由資訊
const config = useConfig();
const route = useRoute();
const { themeClass, radius } = useThemes();

// 計算基礎路由名稱
const baseRouteName = computed(() => useRouteBaseName()(route));

const pageConfig = computed(() => ({
  fullpage: false, // 寫死為 false
  aside: true, // 預設為 true
}));

// SEO Meta 設定
useSeoMeta({
  description: config.value.site.description,
  ogDescription: config.value.site.description,
  twitterCard: 'summary_large_image',
});

// Head 設定
useHead({
  bodyAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});
</script>
