<template>
  <Alert :to :target :icon>
    {{ $t('Read more at') }} <span class="font-semibold">{{ displayTitle }}</span>
  </Alert>
</template>

<script setup lang="ts">
/**
 * ReadMore 元件
 * 顯示「繼續閱讀」提示,使用選單和文章資料取得標題
 */

// 定義 Props
const {
  title,
  to,
  icon = 'lucide:bookmark',
  articleId,
} = defineProps<{
  title?: string;
  to: string;
  target?: Target;
  icon?: string;
  articleId?: number;
}>();

// 取得選單和文章資料
const { menu, loadMenu } = useMenu();
const { article, loadArticle } = useArticle();

// 當有 articleId 時載入對應的文章資料
onMounted(async () => {
  await loadMenu();

  if (articleId) {
    await loadArticle(articleId);
  }
});

// 計算顯示標題
const displayTitle = computed(() => {
  // 優先使用傳入的 title
  if (title) {
    return title;
  }

  // 如果是外部連結,直接顯示 URL
  if (to.startsWith('http')) {
    return to;
  }

  // 如果有 articleId 且文章已載入,使用麵包屑資料
  if (articleId && article.value && menu.value) {
    const breadcrumbs = useBreadcrumb(menu.value, article.value);
    if (breadcrumbs.length > 0) {
      return breadcrumbs.map(x => x.title).join(' > ');
    }
  }

  // 如果從 to 參數取得 articleId
  const match = to.match(/\/article\/(\d+)/) || to.match(/[?&]id=(\d+)/);
  if (match && menu.value) {
    const linkArticleId = Number.parseInt(match[1], 10);

    // 在選單中尋找對應的文章標題
    for (const menuItem of menu.value.nav) {
      for (const link of menuItem.links) {
        const linkMatch = link.to.match(/\/article\/(\d+)/) || link.to.match(/[?&]id=(\d+)/);
        if (linkMatch && Number.parseInt(linkMatch[1], 10) === linkArticleId) {
          return `${menuItem.title} > ${link.title}`;
        }
      }
    }
  }

  // 預設顯示 to 參數
  return to;
});
</script>
