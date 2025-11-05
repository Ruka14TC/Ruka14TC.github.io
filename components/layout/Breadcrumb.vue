<template>
  <UiBreadcrumb>
    <UiBreadcrumbList>
      <!-- 顯示載入狀態 -->
      <template v-if="menuLoading || articleLoading">
        <UiBreadcrumbItem>
          <span class="text-muted-foreground">載入中...</span>
        </UiBreadcrumbItem>
      </template>

      <!-- 顯示錯誤狀態 -->
      <template v-else-if="menuError || articleError">
        <UiBreadcrumbItem>
          <span class="text-destructive">載入失敗</span>
        </UiBreadcrumbItem>
      </template>

      <!-- 顯示麵包屑 -->
      <template v-else>
        <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.title">
          <UiBreadcrumbItem>
            <NuxtLinkLocale
              :href="index === breadcrumbs.length - 1 ? undefined : breadcrumb.href"
              class="hover:text-foreground transition-colors"
              :class="{ 'text-foreground': index === breadcrumbs.length - 1 }"
            >
              {{ breadcrumb.title }}
            </NuxtLinkLocale>
          </UiBreadcrumbItem>
          <UiBreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
        </template>
      </template>
    </UiBreadcrumbList>
  </UiBreadcrumb>
</template>

<script setup lang="ts">
/**
 * Breadcrumb 元件
 * 根據選單和文章資料顯示麵包屑導航
 * 自動載入所需的選單和文章資料
 */

// 取得選單資料
const { menu, loading: menuLoading, error: menuError, loadMenu } = useMenu();

// 取得文章資料
const { article, loading: articleLoading, error: articleError } = useArticle();

// 初始化載入選單資料
onMounted(async () => {
  await loadMenu();
});

// 計算麵包屑項目
const breadcrumbs = computed(() => {
  return useBreadcrumb(menu.value, article.value);
});
</script>
